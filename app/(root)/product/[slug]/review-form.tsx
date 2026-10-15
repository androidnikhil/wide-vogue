"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon, Camera, X, Loader2, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  createUpdateReview,
  getReviewByProductId,
} from "@/lib/actions/review.actions";
import { convertFilesToWebP } from "@/lib/utils/image-converter";
import Image from "next/image";

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  const currentImages = form.watch("images") || [];

  // Open Form Handler
  const handleOpenForm = async () => {
    form.setValue("productId", productId);
    form.setValue("userId", userId);

    const review = await getReviewByProductId({ productId });

    if (review) {
      form.setValue("title", review.title);
      form.setValue("description", review.description);
      form.setValue("rating", review.rating);
      form.setValue("images", (review as any).images || []);
    } else {
      form.reset({
        ...reviewFormDefaultValues,
        productId,
        userId,
      });
    }

    setOpen(true);
  };

  // Image upload handler with client-side WebP conversion
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 3 - currentImages.length;
    if (availableSlots <= 0) {
      toast.error("You can upload a maximum of 3 photos.");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    setIsUploadingImages(true);
    const toastId = toast.loading("Converting & optimizing photos to WebP...");

    try {
      // Convert all images to WebP
      const webpFiles = await convertFilesToWebP(filesToUpload);

      const uploadedUrls: string[] = [];

      for (const file of webpFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          toast.error(data.message || `Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        form.setValue("images", [...currentImages, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} photo(s) converted to WebP and added!`, { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } catch (err: any) {
      console.error("Review image upload error:", err);
      toast.error("An error occurred during photo optimization", { id: toastId });
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
    form.setValue("images", updated);
  };

  // Submit Form Handler
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values
  ) => {
    const res = await createUpdateReview({ ...values, productId });

    if (!res.success) {
      return toast.error(res.message, {
        style: {
          backgroundColor: "#DC2626",
          color: "#fff",
        },
      });
    }

    setOpen(false);
    onReviewSubmitted();
    toast.success(res.message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        onClick={handleOpenForm} 
        variant="default"
        className="gold-gradient-btn text-primary-container font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>Write a Review & Share Darshan</span>
      </Button>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                <span>Devotee Review & Rating</span>
              </DialogTitle>
              <DialogDescription>
                Share your devotional experience and upload Thakur Ji's darshan photos.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary">Review Headline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Divine embroidery and perfect fit for Laddu Gopal Ji" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-semibold text-primary">Detailed Experience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the fabric softness, zari work quality, packing, and overall darshan..." 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-semibold text-primary">Devotional Rating</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() || "5"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select star rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <SelectItem key={stars} value={stars.toString()}>
                              <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                                <span>{stars}</span>
                                <div className="flex">
                                  {Array.from({ length: stars }).map((_, i) => (
                                    <StarIcon key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                  ))}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Photo Upload Section */}
              <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-semibold text-primary flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-secondary" />
                    <span>Thakur Ji Photos ({currentImages.length}/3)</span>
                  </FormLabel>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    Auto-saved as WebP
                  </span>
                </div>

                {/* Previews */}
                {currentImages.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 my-2">
                    {currentImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/60 shadow-xs group">
                        <Image
                          src={imgUrl}
                          alt={`Review photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {currentImages.length < 3 && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImages}
                      className="w-full h-11 border-dashed border-2 border-[#E6C16A] hover:bg-[#FAF7F0] text-[#003020] font-semibold text-xs flex items-center justify-center gap-2 rounded-xl transition-all"
                    >
                      {isUploadingImages ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#0F6F74]" />
                          <span>Converting to WebP & Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 text-[#C88A20]" />
                          <span>Add Photos of Thakur Ji (JPG, PNG auto-converted to WebP)</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full gold-gradient-btn text-primary-container font-bold rounded-xl"
                disabled={form.formState.isSubmitting || isUploadingImages}
              >
                {form.formState.isSubmitting ? "Submitting Review..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
