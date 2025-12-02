import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus2, Ruler, Boxes, FileStack, Image as ImageIcon, Home } from "lucide-react";

const tools = [
  { href: "/upload", title: "Upload & Analyze PDF", icon: FilePlus2, desc: "Upload, summarize, and extract text." },
  { href: "/shop-drawing", title: "Shop Drawing Checker", icon: Ruler, desc: "Detect issues, conflicts, RFIs." },
  { href: "/bom", title: "BOM Extractor", icon: Boxes, desc: "Generate BOM by trade." },
  { href: "/compare", title: "Compare Revisions", icon: FileStack, desc: "Text, dimensions, geometry changes." },
  { href: "/rfi", title: "Auto RFI Generator", icon: FileStack, desc: "Generate RFIs automatically." },
  { href: "/image", title: "Image Analyzer", icon: ImageIcon, desc: "Analyze drawings/photos." }
];

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tools.map(({ href, title, icon: Icon, desc }) => (
        <Card key={href} className="hover:shadow-xl transition">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-700">
                <Icon size={18} />
              </div>
              <CardTitle>{title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">{desc}</p>
            <Link href={href}>
              <Button variant="secondary">Open</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
