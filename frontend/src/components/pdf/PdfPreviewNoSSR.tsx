"use client";

import dynamic from "next/dynamic";

const PdfPreviewNoSSR = dynamic(() => import("./PdfPreview"), {
  ssr: false
});

export default PdfPreviewNoSSR;
