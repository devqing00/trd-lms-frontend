"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  /** Current avatar URL */
  currentUrl?: string | null;
  /** Initials fallback */
  initials?: string;
  /** Callback when a new file is selected */
  onUpload: (file: File) => void;
  /** Callback to remove current photo */
  onRemove?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  sm: {
    container: "h-16 w-16",
    icon: "h-6 w-6",
    camera: "h-6 w-6 -bottom-1 -right-1",
    cameraIcon: "h-3 w-3",
  },
  md: {
    container: "h-24 w-24",
    icon: "h-10 w-10",
    camera: "h-8 w-8 -bottom-1 -right-1",
    cameraIcon: "h-4 w-4",
  },
  lg: {
    container: "h-32 w-32",
    icon: "h-14 w-14",
    camera: "h-10 w-10 -bottom-1 -right-1",
    cameraIcon: "h-5 w-5",
  },
};

function AvatarUpload({
  currentUrl,
  initials,
  onUpload,
  onRemove,
  size = "md",
  className,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const config = sizeConfig[size];

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5MB");
        return;
      }

      // Create preview
      const url = URL.createObjectURL(file);
      setPreview(url);
      onUpload(file);

      // Reset input
      e.target.value = "";
    },
    [onUpload]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError(null);
    onRemove?.();
  }, [onRemove]);

  const displayUrl = preview ?? currentUrl;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Avatar circle */}
      <div className="relative">
        <div
          className={cn(
            "border-border-default bg-bg-tertiary flex items-center justify-center overflow-hidden rounded-full border-2",
            config.container
          )}
        >
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayUrl} alt="Profile photo" className="h-full w-full object-cover" />
          ) : initials ? (
            <span className="font-display text-text-secondary text-lg font-bold">{initials}</span>
          ) : (
            <User className={cn("text-text-tertiary", config.icon)} />
          )}
        </div>

        {/* Camera button overlay */}
        <button
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-bg-secondary bg-accent-blue shadow-hard-sm absolute flex items-center justify-center rounded-full border-2 text-white transition-transform hover:scale-110",
            config.camera
          )}
          aria-label="Upload photo"
        >
          <Camera className={config.cameraIcon} />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Actions */}
      {displayUrl && onRemove && (
        <Button variant="ghost" size="sm" onClick={handleRemove} className="text-xs">
          <X className="h-3 w-3" />
          Remove Photo
        </Button>
      )}

      {/* Error */}
      {error && <p className="text-accent-red text-xs">{error}</p>}
    </div>
  );
}

export { AvatarUpload };
