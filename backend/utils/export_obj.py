def export_obj(mesh: dict) -> str:
    verts = mesh.get("vertices", [])
    faces = mesh.get("faces", [])
    lines = []
    for v in verts:
        lines.append(f"v {v[0]} {v[1]} {v[2]}")
    for f in faces:
        # OBJ is 1-indexed
        lines.append(f"f {f[0]+1} {f[1]+1} {f[2]+1}")
    return "\n".join(lines)
