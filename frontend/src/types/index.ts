export type PdfUploadResponse = {
  original_filename: string;
  saved_as: string;
  saved_to: string;
  message: string;
};

export type DimensionItem = { page: number; type: string; value: string; context_excerpt?: string };

export type ShopDrawingResponse = {
  summary: string;
  critical_issues: any[];
  dimension_conflicts: any[];
  missing_information: any[];
  code_violations: any[];
  detailing_errors: any[];
  structural_conflicts: any[];
  rfi_to_generate: any[];
  recommendations: any[];
};

export type BomResponse = Record<string, Array<Record<string, any>>>;
export type CompareResponse = Record<string, any>;
export type ImageAnalysis = Record<string, any>;
export type AutoRfiResponse = Record<string, any>;
