import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-4 py-16 text-center", className)}
    >
      <div className="bg-bg-tertiary mb-4 flex h-24 w-24 items-center justify-center rounded-full">
        <Icon className="text-text-tertiary h-12 w-12" />
      </div>

      <h3 className="font-display text-text-primary mb-2 text-xl font-medium">{title}</h3>

      <p className="text-text-secondary mb-6 max-w-sm">{description}</p>

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
