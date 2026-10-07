"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";

const AddToCart = ({ cart, item, sizes }: { cart?: Cart, item: CartItem, sizes?: string[] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedSize, setSelectedSize] = useState(sizes && sizes.length > 0 ? sizes[0] : undefined);

  const handleAddToCart = async () => {
    startTransition(async()=>{
      const itemWithSize = { ...item, size: selectedSize };
      const res = await addItemToCart(itemWithSize);
    if (!res.success) {
      toast.error(res.message, {
        style: { backgroundColor: "#DC2626", color: "white" },
      });
    }
    // Handle Add to cart success
    toast("", {
      description: res.message,
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
    });
    return;
    })
    
  };
  const handleRemoveFromCart = async () => {
    startTransition(async()=>{
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message, {
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      }
      // Handle Remove from cart success
      toast("", {
        description: res.message,
      });
      return;
    })
    
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);
  return existItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='w-4 h-4' />
        )}
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='w-4 h-4' />
        )}
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-3 w-full">
      {sizes && sizes.length > 0 && (
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-semibold text-primary">Select Size</label>
          <select 
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>{size} No.</option>
            ))}
          </select>
        </div>
      )}
      <Button className='w-full' type='button' onClick={handleAddToCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='w-4 h-4' />
        )}{' '}
        Add To Cart
      </Button>
    </div>
  );
};

export default AddToCart;
