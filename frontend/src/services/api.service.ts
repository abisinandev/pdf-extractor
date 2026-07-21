import axios from "axios";
import { API } from "../constants/constant.routes";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    [key: string]: any;
  };
}

export interface GetPdfResponse {
  success: boolean;
  message: string;
  data?: {
    id: string,
    originalName: string,
    mimeType: string,
    storagePath: string,
    extractedText: string
  };
}

export const uploadPdf = (
  file: File,
  onProgress?: (percent: number) => void
) => {
  const formData = new FormData();
  formData.append("document", file);

  return apiClient.post<UploadResponse>(API.upload, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    },
  });
};

export const getPdfText = (fileId: string) => {
  return apiClient.get<GetPdfResponse>(`${API.pdf}/${fileId}`);
};


export const extract = async (fileName: string, pages: number[], outputFilename?: string) => {
  const response = await apiClient.post(
    `${API.pdf}/${fileName}${API.extract}`,
    { pages, filename: outputFilename },
    { responseType: "blob" }
  );

  return response.data;
}