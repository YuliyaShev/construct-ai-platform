from typing import List, Dict
from bim.ifc_schema import ifc_header, ifc_footer


def write_ifc_from_mesh(version: str, mesh: Dict, members: List[Dict]) -> str:
    """
    Minimal IFC text with proxy elements capturing mesh + metadata.
    Not full geometry, but carries properties for BIM handoff.
    """
    eid = 1
    lines = [ifc_header(version)]

    # Project/site/building/storey
    lines.append(f"#{eid}= IFCPROJECT('0h$','Construct AI Project',$,$,$,$,$,$);"); proj=eid; eid+=1
    lines.append(f"#{eid}= IFCSITE('1s$','Site',$,$,$,$,$,$,$,$,$,$,$,$);"); site=eid; eid+=1
    lines.append(f"#{eid}= IFCBUILDING('2b$','Building',$,$,$,$,$,$,$,$);"); bld=eid; eid+=1
    lines.append(f"#{eid}= IFCBUILDINGSTOREY('3st$','Storey',$,$,$,$,$,$);"); st=eid; eid+=1
    lines.append(f"#{eid}= IFCRELAGGREGATES('4rel',$,$,$,(#{proj}), (#{site}));"); eid+=1
    lines.append(f"#{eid}= IFCRELAGGREGATES('5rel',$,$,$,(#{site}), (#{bld}));"); eid+=1
    lines.append(f"#{eid}= IFCRELAGGREGATES('6rel',$,$,$,(#{bld}), (#{st}));"); eid+=1

    # Members as IfcBuildingElementProxy with props
    proxies = []
    for m in members:
        pid = eid; eid +=1
        proxies.append(pid)
        lines.append(f"#{pid}= IFCBUILDINGELEMENTPROXY('{pid}','$','{m.get('profile','Member')}',${'$'},${'$'},${'$'},${'$'},$);")
        # Property set
        psid = eid; eid+=1
        lines.append(f"#{psid}= IFCPROPERTYSET('{psid}','$','AI_Metadata',("
                     f"IFCPROPERTYSINGLEVALUE('Profile',$,IFCTEXT('{m.get('profile','')}'),$),"
                     f"IFCPROPERTYSINGLEVALUE('Length_mm',$,IFCREAL({m.get('length_mm',0)}),$),"
                     f"IFCPROPERTYSINGLEVALUE('AngleStart',$,IFCREAL({m.get('angle_start_deg',0)}),$),"
                     f"IFCPROPERTYSINGLEVALUE('AngleEnd',$,IFCREAL({m.get('angle_end_deg',0)}),$),"
                     f"IFCPROPERTYSINGLEVALUE('Page',$,IFCTEXT('{m.get('page','')}'),$)"
                     f"));")
        rid = eid; eid+=1
        lines.append(f"#{rid}= IFCRELDEFINESBYPROPERTIES('{rid}',$,$,$,(#{pid}),#{psid});")

    # Relate proxies to storey
    if proxies:
        lines.append(f"#{eid}= IFCRELAGGREGATES('{eid}',$,$,$,(#{st}),({','.join(f'#{p}' for p in proxies)}));"); eid+=1

    lines.append(ifc_footer())
    return "\n".join(lines)
