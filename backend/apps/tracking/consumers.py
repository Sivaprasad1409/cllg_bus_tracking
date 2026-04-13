"""
WebSocket consumer for real-time bus tracking.
"""
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .simulator import GPSSimulator


class TrackingConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer that:
    1. Authenticates via JWT (handled by middleware)
    2. Joins the bus_tracking group
    3. Starts the GPS simulator if not running
    4. Broadcasts bus locations to all connected clients
    """

    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4003)
            return

        self.group_name = "bus_tracking"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Start simulator if not already running
        simulator = GPSSimulator()
        if not GPSSimulator._running:
            asyncio.create_task(simulator.run(interval=3))

        # Send initial positions
        locations = await simulator.simulate_step()
        if locations:
            await self.send(text_data=json.dumps({
                "type": "bus_locations",
                "data": locations
            }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        """Handle incoming messages (e.g., request specific bus tracking)."""
        try:
            data = json.loads(text_data)
            msg_type = data.get('type')

            if msg_type == 'request_update':
                simulator = GPSSimulator()
                locations = await simulator.simulate_step()
                if locations:
                    await self.send(text_data=json.dumps({
                        "type": "bus_locations",
                        "data": locations
                    }))
        except json.JSONDecodeError:
            pass

    async def bus_locations(self, event):
        """Handle bus.locations group message — send to WebSocket client."""
        await self.send(text_data=json.dumps({
            "type": "bus_locations",
            "data": event["locations"]
        }))
