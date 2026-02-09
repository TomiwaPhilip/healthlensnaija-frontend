import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export interface CreatedStory {
  id?: string;
  _id?: string;
  title: string;
  status?: string;
  preview_text?: string;
}

interface CreateStoryDialogProps {
  onSuccess?: (story: CreatedStory) => void;
  trigger: React.ReactElement;
  description?: string;
}

export const CreateStoryDialog: React.FC<CreateStoryDialogProps> = ({
  onSuccess,
  trigger,
  description = "Give your story workspace a descriptive name so you can find it later.",
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setTitle("");
    setError(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("A title is required to create a story.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be signed in to create a story.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`${API_URL}/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to create story");
      }

      onSuccess?.(payload);
      setOpen(false);
      resetState();
    } catch (creationError) {
      console.error("Failed to create story", creationError);
      setError(
        creationError instanceof Error ? creationError.message : "Failed to create story"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          resetState();
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Story</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="story-title">Story Title</Label>
            <Input
              id="story-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Maternal Health Outcomes in Lagos"
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Story"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryDialog;
