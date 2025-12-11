import math
from typing import Dict, List

from utils.egress_navmesh import build_navmesh
from utils.egress_agents import generate_agents
from utils.egress_fire_model import apply_fire_blockages
from utils.egress_ai import interpret_egress_results

TIME_STEP = 0.1
DOOR_FLOW_RATE = 1.33  # persons/sec per 22"


def run_simulation(geometry: Dict, fire_start: Dict, density: str = "normal") -> Dict:
    navmesh = build_navmesh(geometry)
    navmesh = apply_fire_blockages(navmesh, fire_start)

    exits = navmesh.get("exits", [])
    room_loads = geometry.get("rooms", [])
    agents = generate_agents(room_loads, exits, density)

    t = 0.0
    bottlenecks = set()
    exited = 0
    total_agents = len(agents)
    exit_queue: Dict[str, List[Dict]] = {ex["id"]: [] for ex in exits}
    timeline = []

    while exited < total_agents and t < 900:
        # queue assignment
        for a in agents:
            if a["state"] == "waiting" and t >= a["reaction_time"]:
                a["state"] = "moving"
            if a["state"] == "moving":
                exit_id = a["target_exit"]
                if exit_id:
                    exit_queue[exit_id].append(a)
                    a["state"] = "queued"

        # process queues (door flow)
        for exit_id, queue in exit_queue.items():
            capacity = DOOR_FLOW_RATE * TIME_STEP
            allowed = int(math.floor(capacity))
            if len(queue) > allowed:
                bottlenecks.add(exit_id)
            for _ in range(min(allowed, len(queue))):
                ag = queue.pop(0)
                ag["state"] = "exited"
                ag["time"] = t
                exited += 1
        t += TIME_STEP
        timeline.append({"time": t, "exited": exited})

    summary = {
        "total_time": round(t, 1),
        "time_90_percent": next((p["time"] for p in timeline if p["exited"] >= 0.9 * total_agents), t),
        "bottlenecks": list(bottlenecks),
        "exit_capacity_insufficient": bool(bottlenecks),
    }
    violations = interpret_egress_results(summary)

    return {
        "summary": summary,
        "timeline": timeline,
        "trajectory": agents,
        "bottlenecks": list(bottlenecks),
        "violations": violations,
        "heatmap": None,
        "report": None,
    }
