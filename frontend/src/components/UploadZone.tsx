import React, { useRef, useState } from "react";
import { UploadCloud, FileText, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { uploadPdf } from "../services/api.service";

interface UploadZoneProps {
  onUploadSuccess: (fileId: string, file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    setSuccess(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) validateAndUpload(files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const files = e.target.files;
    if (files && files.length > 0) validateAndUpload(files[0]);
  };

  const validateAndUpload = (file: File) => {
    console.log("validateAndUpload: ", file);

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds the 10MB limit.");
      return;
    }
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(10);
    setError(null);

    try {
      const { data } = await uploadPdf(file, (percent) => {
        setUploadProgress(10 + Math.round(percent * 0.8));
      });

      setUploadProgress(100);
      if (data.success && data.data?.storage_path) {
        setSuccess(`Successfully uploaded "${file.name}"`);
        onUploadSuccess(data.data.storage_path, file);
      } else {
        setError(data.message || "Upload succeeded but no file ID was returned.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          "An error occurred during upload. Make sure the backend is running."
        );
      } else {
        setError("Unexpected error during upload.");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 bg-theme-card shadow-sm
          ${isDragging
            ? "border-theme-primary bg-theme-primary/10 scale-[1.01] ring-4 ring-theme-primary/20"
            : "border-theme-border hover:border-theme-primary hover:shadow-md"
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-theme-surface group-hover:bg-theme-primary/10 transition-colors duration-300">
            <UploadCloud className="h-10 w-10 text-theme-text-mut group-hover:text-theme-primary transition-colors duration-300" />
          </div>

          <div>
            <p className="text-lg font-semibold text-theme-text">
              Drag & Drop PDF here
            </p>
            <p className="text-sm text-theme-text-sec mt-1">
              or{" "}
              <span className="text-theme-primary font-medium group-hover:underline">
                browse files
              </span>{" "}
              from your device
            </p>
          </div>

          <div className="text-xs text-theme-text-sec bg-theme-surface px-3 py-1 rounded-full font-medium">
            PDF files only · Max 10MB
          </div>
        </div>

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-theme-bg/95 rounded-2xl flex flex-col items-center justify-center p-6 space-y-4 z-10">
            <FileText className="h-10 w-10 text-theme-primary animate-bounce" />
            <div className="w-64 bg-theme-surface h-2 rounded-full overflow-hidden border border-theme-border">
              <div
                className="bg-theme-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-theme-text-sec font-medium animate-pulse">
              Uploading & parsing PDF… {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-sm font-medium shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-green-900/20 border border-green-800/50 rounded-lg text-green-400 text-sm font-medium shadow-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};
