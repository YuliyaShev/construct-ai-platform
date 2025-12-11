import random
from typing import Dict, List


def generate_agents(room_loads: List[Dict], exits: List[Dict], density: str = "normal") -> List[Dict]:
    speed_base = {"sparse": (1.0, 1.5), "normal": (0.9, 1.3), "heavy": (0.8, 1.2)}.get(density, (0.9, 1.3))
    agents: List[Dict] = []
    for room in room_loads:
        count = room.get("occupants", 0)
        for i in range(count):
            speed = round(random.uniform(*speed_base), 2)
            reaction = round(random.uniform(0, 10), 2)
            agents.append(
                {
                    "id": f"agent-{room.get('id', 'r')}-{i}",
                    "position": room.get("center", (0, 0)),
                    "speed": speed,
                    "reaction_time": reaction,
                    "target_exit": random.choice(exits)["id"] if exits else None,
                    "state": "waiting",
                    "queue_time": 0.0,
                    "time": 0.0,
                }
            )
    return agents
