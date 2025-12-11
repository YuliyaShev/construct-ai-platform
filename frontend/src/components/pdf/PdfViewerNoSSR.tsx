"use client";

import dynamic from "next/dynamic";

const PdfViewerNoSSR = dynamic(() => import("../PdfHeatmapViewer").then((m) => m.PdfHeatmapViewer), {
  ssr: false
});

export default PdfViewerNoSSR;
