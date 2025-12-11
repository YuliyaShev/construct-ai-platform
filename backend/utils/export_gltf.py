import json
from typing import Dict, List


def export_gltf(mesh: Dict) -> str:
    """
    Build a minimal glTF (JSON) string with positions and triangle indices.
    """
    vertices = mesh.get("vertices", [])
    faces = mesh.get("faces", [])
    positions = [coord for v in vertices for coord in v]
    indices = [idx for f in faces for idx in f]

    gltf = {
        "asset": {"version": "2.0"},
        "buffers": [
            {"uri": "data:application/octet-stream;base64,", "byteLength": 0}
        ],
        "bufferViews": [],
        "accessors": [],
        "meshes": [
            {
                "primitives": [
                    {
                        "attributes": {"POSITION": 0},
                        "indices": 1,
                    }
                ]
            }
        ],
        "nodes": [{"mesh": 0, "name": "ConstructAIModel"}],
        "scenes": [{"nodes": [0]}],
        "scene": 0,
    }

    gltf["accessors"].append({
        "bufferView": None,
        "componentType": 5126,  # float
        "count": len(vertices),
        "type": "VEC3",
        "max": [max(p[0] for p in vertices) if vertices else 0, max(p[1] for p in vertices) if vertices else 0, max(p[2] for p in vertices) if vertices else 0],
        "min": [min(p[0] for p in vertices) if vertices else 0, min(p[1] for p in vertices) if vertices else 0, min(p[2] for p in vertices) if vertices else 0],
        "name": "positions",
        "array": positions,
    })
    gltf["accessors"].append({
        "bufferView": None,
        "componentType": 5123,  # unsigned short
        "count": len(indices),
        "type": "SCALAR",
        "array": indices,
        "name": "indices",
    })

    return json.dumps(gltf)
