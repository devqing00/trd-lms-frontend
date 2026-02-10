"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Video,
  Image as ImageIcon,
  File,
  Trash2,
  BookOpen,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInstructorCourses } from "@/lib/hooks/use-queries";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

const FILE_ICON: Record<string, React.ReactNode> = {
  pdf: <FileText className="text-accent-red h-5 w-5" />,
  video: <Video className="text-accent-blue h-5 w-5" />,
  image: <ImageIcon className="text-accent-green h-5 w-5" />,
  default: <File className="text-text-tertiary h-5 w-5" />,
};

function getFileCategory(type: string): string {
  if (type.includes("pdf")) return "pdf";
  if (type.includes("video")) return "video";
  if (type.includes("image")) return "image";
  return "default";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Simulate uploaded files per course
const MOCK_FILES: Record<string, UploadedFile[]> = {};

export default function InstructorMaterialsPage() {
  const [courseFilter, setCourseFilter] = useState("all");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<Record<string, UploadedFile[]>>(MOCK_FILES);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: courses = [] } = useInstructorCourses();

  const courseFiles =
    courseFilter !== "all" ? (files[courseFilter] ?? []) : Object.values(files).flat();

  function handleFiles(fileList: FileList) {
    if (courseFilter === "all") return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: `file-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      type: f.type,
      size: f.size,
      uploadedAt: new Date().toISOString(),
    }));
    setFiles((prev) => ({
      ...prev,
      [courseFilter]: [...(prev[courseFilter] ?? []), ...newFiles],
    }));
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? "s" : ""} uploaded`);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  function removeFile(fileId: string) {
    setFiles((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = (updated[key] ?? []).filter((f) => f.id !== fileId);
      }
      return updated;
    });
    toast.success("File removed");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Materials
        </h1>
        <p className="text-text-secondary mt-1">Upload and manage course materials</p>
      </div>

      {/* Course selector */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full sm:w-72">
              <BookOpen className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-text-tertiary text-sm">
            {courseFiles.length} file{courseFiles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      {/* Upload zone */}
      {courseFilter !== "all" && (
        <Card
          className={`border-2 border-dashed transition-all ${
            dragOver ? "border-accent-green bg-accent-green/5" : "border-border-default"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <div className="bg-accent-green/10 flex h-14 w-14 items-center justify-center rounded-2xl">
              <Upload className="text-accent-green h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-text-primary text-sm font-semibold">Drag & drop files here</p>
              <p className="text-text-tertiary text-xs">
                PDF, documents, videos, slides — or click below
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <Plus className="mr-1 h-4 w-4" /> Browse Files
            </Button>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi,.png,.jpg,.jpeg"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </CardContent>
        </Card>
      )}

      {/* Files list */}
      {courseFiles.length > 0 ? (
        <div className="space-y-2">
          {courseFiles.map((file) => {
            const cat = getFileCategory(file.type);
            return (
              <Card key={file.id}>
                <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                  <div className="bg-bg-tertiary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    {FILE_ICON[cat] ?? FILE_ICON.default}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-medium">{file.name}</p>
                    <p className="text-text-tertiary text-xs">
                      {formatSize(file.size)} &middot;{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-accent-red h-8 w-8 shrink-0"
                    onClick={() => removeFile(file.id)}
                    aria-label={`Remove file ${file.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <Upload className="text-text-tertiary mx-auto h-12 w-12" />
          <p className="text-text-secondary mt-2">
            {courseFilter === "all"
              ? "Select a course to manage its materials."
              : "No materials uploaded yet. Drag and drop files above."}
          </p>
        </div>
      )}
    </div>
  );
}
