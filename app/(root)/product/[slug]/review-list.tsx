'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/types';
import Link from 'next/link';
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, User, CheckCircle2, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Rating from '@/components/shared/product/rating';
import Image from 'next/image';

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  // Reload reviews after created or updated
  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  };

  return (
    <div className='space-y-6'>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#FAF7F0] rounded-2xl border border-[#E6C16A]/40 shadow-xs">
        <div>
          <h3 className="font-bold text-lg text-primary">Devotee Experiences & Darshan</h3>
          <p className="text-xs text-neutral-600">
            {reviews.length > 0 
              ? `${reviews.length} devotee reviews shared with genuine love and photos.` 
              : 'Be the first devotee to share divine darshan of Thakur Ji wearing this shringaar.'}
          </p>
        </div>

        {userId ? (
          <ReviewForm
            userId={userId}
            productId={productId}
            onReviewSubmitted={reload}
          />
        ) : (
          <div className="text-xs font-medium text-neutral-600">
            Please{' '}
            <Link
              className='text-[#0F6F74] font-bold hover:underline'
              href={`/sign-in?callbackUrl=/product/${productSlug}`}
            >
              Sign In
            </Link>{' '}
            to share your review and photos.
          </div>
        )}
      </div>

      <div className='flex flex-col gap-4'>
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant text-sm">
            No devotee reviews yet. Share your experience with us!
          </div>
        ) : (
          reviews.map((review) => {
            const rawImages = (review as any).images;
            const reviewImages: string[] = Array.isArray(rawImages)
              ? rawImages
              : (typeof rawImages === 'string'
                  ? (() => { try { return JSON.parse(rawImages); } catch { return []; } })()
                  : []);

            return (
              <Card key={review.id} className="border border-outline-variant/30 shadow-2xs overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-bold text-primary">{review.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Rating value={review.rating} />
                        {review.isVerifiedPurchase && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Devotee
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-neutral-700 text-sm mt-2 leading-relaxed font-normal">
                    {review.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Customer Darshan Photos */}
                  {reviewImages.length > 0 && (
                    <div className="my-3">
                      <div className="flex flex-wrap gap-2.5">
                        {reviewImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedImage(img)}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-amber-200/80 hover:border-[#C88A20] shadow-2xs hover:scale-105 transition-all group"
                          >
                            <Image
                              src={img}
                              alt="Devotee darshan photo"
                              fill
                              className="object-cover group-hover:brightness-95"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-outline-variant/20'>
                    <div className='flex items-center font-medium text-primary'>
                      <User className='mr-1.5 h-3.5 w-3.5 text-secondary' />
                      {review.user ? review.user.name : 'Devotee'}
                    </div>
                    <div className='flex items-center'>
                      <Calendar className='mr-1.5 h-3.5 w-3.5 text-neutral-400' />
                      {formatDateTime(review.createdAt).dateTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              title="Close image"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-[85vw] max-w-[600px] h-[70vh] max-h-[600px]">
              <Image
                src={selectedImage}
                alt="Enlarged Darshan Photo"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-2 text-center text-xs font-semibold text-[#003020]">
              Thakur Ji Sacred Darshan • Customer Review
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;