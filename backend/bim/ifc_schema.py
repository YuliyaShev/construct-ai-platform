# Minimal IFC entity helpers (simplified for export text)

def ifc_header(version: str = "IFC4") -> str:
    return f"""ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [{version}]'), '2;1');
FILE_NAME('construct_ai.ifc','',('Construct AI'),('Construct AI'), 'ConstructAI','ConstructAI','');
FILE_SCHEMA(('{version}'));
ENDSEC;
DATA;
"""


def ifc_footer() -> str:
    return "ENDSEC;\nEND-ISO-10303-21;\n"
