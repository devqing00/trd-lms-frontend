"use client";

import { useCallback, useRef, useState } from "react";
import {
  Upload,
  X,
  File,
  FileText,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

interface FileUploadProps {
  /** Accepted MIME types (e.g., ["application/pdf", "video/*"]) */
  accept?: string[];
  /** Max file size in bytes (default: 50MB) */
  maxSize?: number;
  /** Allow multiple files */
  multiple?: boolean;
  /** Callback when files are selected */
  onFilesSelected: (files: UploadFile[]) => void;
  /** External file list (controlled) */
  files?: UploadFile[];
  /** Remove callback */
  onRemove?: (fileId: string) => void;
  className?: string;
  /** Label text */
  label?: string;
  /** Help text */
  description?: string;
}

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
}

/* ─── Helper ─── */

const FILE_ICONS: Record<string, React.ElementType> = {
  "application/pdf": FileText,
  "video/": Film,
  "image/": ImageIcon,
};

function getFileIcon(type: string) {
  for (const [key, Icon] of Object.entries(FILE_ICONS)) {
    if (type.startsWith(key)) return Icon;
  }
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateId() {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ─── Component ─── */

function FileUpload({
  accept,
  maxSize = 50 * 1024 * 1024,
  multiple = true,
  onFilesSelected,
  files = [],
  onRemove,
  className,
  label = "Upload Files",
  description,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `${file.name} exceeds ${formatFileSize(maxSize)} limit`;
      }
      if (accept && accept.length > 0) {
        const isAccepted = accept.some((type) => {
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.replace("/*", "/"));
          }
          return file.type === type;
        });
        if (!isAccepted) {
          return `${file.name} is not an accepted file type`;
        }
      }
      return null;
    },
    [accept, maxSize]
  );

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const errors: string[] = [];
      const validFiles: UploadFile[] = [];

      const rawFiles = Array.from(fileList);
      for (const file of rawFiles) {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push({
            id: generateId(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: "pending",
          });
        }
      }

      setValidationErrors(errors);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [validateFile, onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [processFiles]
  );

  const acceptStr = accept?.join(",");

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label */}
      {label && <label className="text-text-primary text-sm font-medium">{label}</label>}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "rounded-card flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-8 text-center transition-all duration-200",
          isDragging
            ? "border-accent-blue bg-accent-blue/5 shadow-hard"
            : "border-border-default bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary"
        )}
        role="button"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
            isDragging ? "bg-accent-blue/10 text-accent-blue" : "bg-bg-tertiary text-text-tertiary"
          )}
        >
          <Upload className="h-7 w-7" />
        </div>
        <div>
          <p className="text-text-primary text-sm font-medium">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-text-tertiary mt-1 text-xs">
            {description ?? `or click to browse • Max ${formatFileSize(maxSize)}`}
          </p>
        </div>
        {accept && (
          <div className="flex flex-wrap justify-center gap-1">
            {accept.map((type) => (
              <Badge key={type} variant="default" className="text-[10px]">
                {type.replace("application/", ".").replace("/*", "")}
              </Badge>
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={acceptStr}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="space-y-1">
          {validationErrors.map((err, i) => (
            <p key={i} className="text-accent-red flex items-center gap-1.5 text-xs">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}

      {/* File list with progress */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => {
            const Icon = getFileIcon(f.type);
            return (
              <div
                key={f.id}
                className="border-border-default bg-bg-secondary flex items-center gap-3 rounded-xl border-2 p-3"
              >
                <div className="bg-bg-tertiary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="text-text-tertiary h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary truncate text-sm font-medium">{f.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-text-tertiary text-xs">{formatFileSize(f.size)}</p>
                    {f.status === "uploading" && (
                      <span className="text-accent-blue text-xs">{f.progress}%</span>
                    )}
                    {f.status === "complete" && (
                      <span className="text-accent-green flex items-center gap-1 text-xs">
                        <CheckCircle2 className="h-3 w-3" /> Uploaded
                      </span>
                    )}
                    {f.status === "error" && (
                      <span className="text-accent-red flex items-center gap-1 text-xs">
                        <AlertCircle className="h-3 w-3" /> {f.error ?? "Failed"}
                      </span>
                    )}
                  </div>
                  {/* Progress bar */}
                  {f.status === "uploading" && (
                    <div className="bg-bg-tertiary mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-accent-blue h-full rounded-full transition-all duration-300"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(f.id);
                    }}
                    aria-label={`Remove ${f.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { FileUpload };
