import axios from "axios";

// Default to Next.js rewrite proxy (/api) unless an explicit backend URL is provided.
const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

// helpers for uploads
export async function uploadPdf(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/upload-pdf", form, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}
