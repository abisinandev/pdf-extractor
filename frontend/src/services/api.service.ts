import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface UploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
}

export interface GetPdfResponse {
  success: boolean;
  message: string;
  data?: string;
}

export const uploadPdf = (
  file: File,
  onProgress?: (percent: number) => void
) => {
  const formData = new FormData();
  formData.append("pdf", file);

  return apiClient.post<UploadResponse>("/upload", formData, {
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
  return apiClient.get<GetPdfResponse>(`/pdf/${fileId}`);
};


export const extract = async (fileName: string, pages: []) => {
  const response = await apiClient.post(
    `/pdfs/${fileName}/extract`,
    { pages },
    { responseType: "blob" }
  );

  return response.data;
}