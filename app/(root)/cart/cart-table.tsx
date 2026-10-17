"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { Cart } from "@/types";
import { ArrowRight, Loader, Minus, Plus, ShoppingBag, Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import CouponForm from "@/components/shared/cart/coupon-form";
import GiftWrapToggle from "@/components/shared/cart/gift-wrap-toggle";
import GiftCardForm from "@/components/shared/cart/gift-card-form";
import BhaktiPointsForm from "@/components/shared/cart/bhakti-points-form";
import { LOYALTY_CONFIG } from "@/lib/loyalty.config";
import { calculateShiprocketRatesForPincode } from "@/lib/actions/shiprocket.actions";
import CopyButton from "@/components/shared/copy-button";

const CartTable = ({ cart, availablePoints = 0 }: { cart?: Cart; availablePoints?: number }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDiscounts, setShowDiscounts] = useState(false);

  // Pincode live delivery calculation state
  const [pincode, setPincode] = useState<string>(((cart as any)?.shippingAddress)?.postalCode || "");
  const [shippingQuote, setShippingQuote] = useState<{
    courierName: string;
    rate: number;
    days: string;
    isFree: boolean;
    destinationCity?: string;
    pickupCity?: string;
  } | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  const handleCheckPincodeRate = async () => {
    const cleanPincode = pincode.trim();
    if (!cleanPincode || cleanPincode.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsCheckingPincode(true);
    try {
      const res = await calculateShiprocketRatesForPincode(cleanPincode, Number(cart?.itemsPrice || 0));
      if (res.success && res.data) {
        setShippingQuote({
          courierName: res.data.courierName,
          rate: res.data.actualCourierRate,
          days: res.data.estimatedDays,
          isFree: res.data.isFree,
          destinationCity: res.data.destinationCity,
          pickupCity: res.data.pickupCity,
        });
        const cityLabel = res.data.destinationCity ? `${res.data.destinationCity} (${cleanPincode})` : cleanPincode;
        toast.success(`Delivery available to ${cityLabel} • Est. ${res.data.estimatedDays}`);
      } else {
        toast.error(res.message || "Failed to check delivery for this PIN code.");
      }
    } catch {
      toast.error("Unable to verify delivery time right now. Standard delivery applies.");
    } finally {
      setIsCheckingPincode(false);
    }
  };

  return (
    <div className="wrapper py-10">
      <h1 className="h1-bold mb-8 text-primary">Your Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 bg-surface rounded-xl shadow-sm border border-secondary/10">
          <ShoppingBag className="w-16 h-16 text-secondary/50 mb-2" />
          <p className="text-xl text-on-surface-variant font-medium">Your cart is feeling a bit empty</p>
          <Link href="/">
            <Button className="gold-gradient-btn text-white mt-2 px-8">
              Explore Our Collection
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface rounded-xl shadow-sm border border-secondary/10 overflow-hidden">
            <div className="overflow-x-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-secondary/20">
                    <TableHead className="font-title-md text-primary">Product</TableHead>
                    <TableHead className="text-center font-title-md text-primary">Quantity</TableHead>
                    <TableHead className="text-right font-title-md text-primary">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.productId + (item.size || '')} className="border-b border-secondary/10 hover:bg-surface-container/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-4 py-2">
                          <Link href={`/product/${item.slug}`} className="shrink-0 relative w-20 h-20 rounded-md overflow-hidden border border-secondary/20">
                            <Image
                              src={item.image}
                              fill
                              sizes="100px"
                              className="object-cover"
                              alt={item.name}
                            />
                          </Link>
                          <div className="flex flex-col">
                            <Link
                              href={`/product/${item.slug}`}
                              className="font-title-lg text-primary hover:text-secondary transition-colors"
                            >
                              {item.name}
                            </Link>
                            <div className="flex flex-col gap-1 mt-1 text-sm text-on-surface-variant">
                              <span>Price: {formatCurrency(item.price)}</span>
                              {item.size && (
                                <span className="inline-flex bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold w-fit">
                                  Size: {item.size}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center justify-center gap-3 bg-surface-container rounded-full py-1 px-3 w-fit mx-auto border border-secondary/20">
                          <Button
                            disabled={isPending}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-white hover:text-error transition-colors"
                            onClick={() =>
                              startTransition(async () => {
                                const res = await removeItemFromCart(item.productId, item.size);
                                if (!res.success) {
                                  toast.error(res.message);
                                }
                                return;
                              })
                            }
                          >
                            {isPending ? (
                              <Loader className="w-4 h-4 animate-spin text-primary" />
                            ) : (
                              <Minus className="w-4 h-4 text-primary" />
                            )}
                          </Button>
                          <span className="font-semibold text-primary w-4 text-center">{item.qty}</span>
                          <Button
                            disabled={isPending}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-white hover:text-secondary transition-colors"
                            onClick={() =>
                              startTransition(async () => {
                                const res = await addItemToCart(item);
                                if (!res.success) {
                                  toast.error(res.message);
                                }
                                return;
                              })
                            }
                          >
                            {isPending ? (
                              <Loader className="w-4 h-4 animate-spin text-primary" />
                            ) : (
                              <Plus className="w-4 h-4 text-primary" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right font-bold text-lg text-primary">
                        {formatCurrency(Number(item.price) * item.qty)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-surface border-secondary/10 shadow-md sticky top-24 overflow-hidden rounded-xl">
              <div className="bg-primary-container text-surface p-4 border-b border-secondary/20">
                <h2 className="font-title-lg">Order Summary</h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-on-surface-variant font-body-md">
                    <span>Items ({cart.items.reduce((a, c) => a + c.qty, 0)}):</span>
                    <span>{formatCurrency(cart.itemsPrice)}</span>
                  </div>

                  {/* Delivery Charges with Free Delivery above 999 */}
                  <div className="flex justify-between text-on-surface-variant font-body-md py-1">
                    <span>Delivery Charges:</span>
                    {Number(cart.itemsPrice) >= 999 ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <span className="line-through text-xs text-neutral-400 font-normal">
                          ₹50
                        </span>
                        <span>FREE</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-neutral-800">{formatCurrency(50)}</span>
                    )}
                  </div>

                  {/* Pincode Delivery Estimator */}
                  <div className="p-3 rounded-xl bg-surface-container/40 border border-secondary/15 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-primary">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-secondary" />
                        Check Delivery
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">Enter PIN code</span>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter 6-digit PIN code"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="h-8 text-xs bg-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isCheckingPincode || pincode.trim().length !== 6}
                        onClick={handleCheckPincodeRate}
                        className="h-8 px-3 text-xs font-semibold shrink-0"
                      >
                        {isCheckingPincode ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
                      </Button>
                    </div>

                    {shippingQuote && (
                      <div className="pt-2 text-[11px] text-neutral-700 space-y-1 border-t border-secondary/15 mt-2">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Delivery Available to {shippingQuote.destinationCity || pincode}
                          </span>
                          {shippingQuote.isFree ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[10px]">
                              FREE
                            </span>
                          ) : (
                            <span className="text-neutral-600 text-[10px] font-medium">
                              Standard Delivery
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-600">
                          Estimated Delivery: <strong>{shippingQuote.days}</strong> ({shippingQuote.pickupCity || 'Noida'} to {shippingQuote.destinationCity || pincode})
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Free Shipping Progress / Status Banner */}
                  {Number(cart.itemsPrice) < 999 ? (
                    <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1">
                          <span>🚚</span>
                          <span>Add <strong>{formatCurrency(999 - Number(cart.itemsPrice))}</strong> more for <strong>FREE Delivery</strong></span>
                        </span>
                        <span className="text-[11px] text-amber-700 font-bold">{Math.round((Number(cart.itemsPrice) / 999) * 100)}%</span>
                      </div>
                      <div className="w-full bg-amber-200/50 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-amber-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round((Number(cart.itemsPrice) / 999) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                      <span>🎉</span>
                      <span>Congratulations! You have unlocked <strong>FREE Delivery</strong></span>
                    </div>
                  )}

                  {cart.isGiftWrapped && (
                    <div className="flex justify-between text-on-surface-variant font-body-md py-1">
                      <span>Gift Wrapping:</span>
                      <span>{formatCurrency(50)}</span>
                    </div>
                  )}

                  {Number(cart.discountPrice) > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-body-md py-1 font-medium">
                      <span className="flex items-center gap-1.5">
                        Discount (Code: {cart.couponCode})
                        <CopyButton text={cart.couponCode || ''} title="Copy Promo Code" size="xs" />
                      </span>
                      <span>-{formatCurrency(cart.discountPrice || "0")}</span>
                    </div>
                  )}

                  {Number(cart.giftCardAmount) > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-body-md py-1 font-medium">
                      <span className="flex items-center gap-1.5">
                        Gift Card ({cart.giftCardCode})
                        <CopyButton text={cart.giftCardCode || ''} title="Copy Gift Card Code" size="xs" />
                      </span>
                      <span>-{formatCurrency(cart.giftCardAmount || "0")}</span>
                    </div>
                  )}

                  {Number(cart.pointsToRedeem) > 0 && (
                    <div className="flex justify-between text-orange-600 font-body-md py-1 font-medium">
                      <span>Bhakti Points ({cart.pointsToRedeem}):</span>
                      <span>-{formatCurrency(LOYALTY_CONFIG.calculateDiscountForPoints(cart.pointsToRedeem || 0).toString())}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg text-primary pt-3 pb-2 border-t border-secondary/20">
                    <span>Order Total:</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(
                      Math.max(0, (
                        Number(cart.itemsPrice) + 
                        (Number(cart.itemsPrice) >= 999 ? 0 : (shippingQuote ? shippingQuote.rate : 50)) +
                        (cart.isGiftWrapped ? 50 : 0) - 
                        Number(cart.discountPrice || 0) - 
                        Number(cart.giftCardAmount || 0) - 
                        LOYALTY_CONFIG.calculateDiscountForPoints(Number(cart.pointsToRedeem || 0))
                      )).toString()
                    )}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pb-2">Inclusive of all taxes &amp; delivery charges</p>

                  <div className="pb-4 border-b border-secondary/20">
                    <GiftWrapToggle isGiftWrapped={cart.isGiftWrapped || false} />
                  </div>

                  <div className="border border-secondary/20 rounded-lg overflow-hidden bg-surface-container/30">
                    <button 
                      className="w-full p-4 flex items-center justify-between font-medium text-primary hover:bg-surface-container/50 transition-colors"
                      onClick={() => setShowDiscounts(!showDiscounts)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">sell</span>
                        Apply Discounts or Gift Card
                      </span>
                      <span className={`material-symbols-outlined transition-transform duration-200 ${showDiscounts || cart.couponCode || cart.giftCardCode || Number(cart.pointsToRedeem) > 0 ? 'rotate-180' : ''}`}>
                        keyboard_arrow_down
                      </span>
                    </button>
                    {(showDiscounts || cart.couponCode || cart.giftCardCode || Number(cart.pointsToRedeem) > 0) && (
                      <div className="p-4 bg-white border-t border-secondary/10 space-y-6">
                        <BhaktiPointsForm 
                          availablePoints={availablePoints} 
                          appliedPoints={Number(cart.pointsToRedeem || 0)} 
                        />
                        <div className="h-px bg-secondary/10" />
                        <CouponForm initialCode={cart.couponCode} />
                        <div className="h-px bg-secondary/10" />
                        <GiftCardForm initialCode={cart.giftCardCode} />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    className="w-full gold-gradient-btn text-white h-12 text-base shadow-md hover:shadow-lg transition-all"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => router.push("/shipping-address"))
                    }
                  >
                    {isPending ? (
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 mr-2" />
                    )} 
                    Proceed to Checkout
                  </Button>
                  
                  <div className="mt-4 pt-4 border-t border-secondary/10">
                    <p className="text-xs text-center text-on-surface-variant flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-green-600">lock</span>
                      Secure Checkout with Razorpay
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTable;
