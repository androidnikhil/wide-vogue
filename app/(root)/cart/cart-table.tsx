"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { Cart } from "@/types";
import { ArrowRight, Loader, Minus, Plus, ShoppingBag } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import CouponForm from "@/components/shared/cart/coupon-form";
import GiftWrapToggle from "@/components/shared/cart/gift-wrap-toggle";
import GiftCardForm from "@/components/shared/cart/gift-card-form";
import BhaktiPointsForm from "@/components/shared/cart/bhakti-points-form";
import { LOYALTY_CONFIG } from "@/lib/loyalty.config";

const CartTable = ({ cart, availablePoints = 0 }: { cart?: Cart; availablePoints?: number }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDiscounts, setShowDiscounts] = useState(false);

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
                  <div className="flex justify-between text-on-surface-variant font-body-md pb-4 border-b border-secondary/20">
                    <span>Shipping calculated at checkout. Taxes included.</span>
                  </div>

                  {cart.isGiftWrapped && (
                    <div className="flex justify-between text-on-surface-variant font-body-md py-2">
                      <span>Gift Wrapping:</span>
                      <span>{formatCurrency(50)}</span>
                    </div>
                  )}

                  {Number(cart.discountPrice) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-body-md py-2 font-medium">
                      <span>Discount (Code: {cart.couponCode}):</span>
                      <span>-{formatCurrency(cart.discountPrice || "0")}</span>
                    </div>
                  )}

                  {Number(cart.giftCardAmount) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-body-md py-2 font-medium">
                      <span>Gift Card ({cart.giftCardCode}):</span>
                      <span>-{formatCurrency(cart.giftCardAmount || "0")}</span>
                    </div>
                  )}

                  {Number(cart.pointsToRedeem) > 0 && (
                    <div className="flex justify-between text-orange-600 font-body-md py-2 font-medium">
                      <span>Bhakti Points ({cart.pointsToRedeem}):</span>
                      <span>-{formatCurrency(LOYALTY_CONFIG.calculateDiscountForPoints(cart.pointsToRedeem || 0).toString())}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg text-primary pt-2 pb-6 border-t border-secondary/20">
                    <span>Subtotal:</span>
                    <span className="font-bold">{formatCurrency(
                      (
                        Number(cart.itemsPrice) + 
                        (cart.isGiftWrapped ? 50 : 0) - 
                        Number(cart.discountPrice || 0) - 
                        Number(cart.giftCardAmount || 0) - 
                        LOYALTY_CONFIG.calculateDiscountForPoints(Number(cart.pointsToRedeem || 0))
                      ).toString()
                    )}</span>
                  </div>

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
