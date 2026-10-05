import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.action';
import { getUserById } from '@/lib/actions/user.actions';
import { ShippingAddress } from '@/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import PlaceOrderForm from './place-order-form';

export const metadata: Metadata = {
  title: 'Place Order',
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();
  const userId = session?.user?.id;

  let userAddress = cart.shippingAddress as ShippingAddress | null;
  let paymentMethod = cart.paymentMethod;

  if (userId) {
    const user = await getUserById(userId);
    if (user.address) userAddress = user.address as ShippingAddress;
    if (user.paymentMethod) paymentMethod = user.paymentMethod;
  }

  if (!userAddress) redirect('/shipping-address');
  if (!paymentMethod) redirect('/payment-method');

  return (
    <>
      <CheckoutSteps current={3} />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className='h2-bold text-primary mb-6'>Review Your Order</h1>
        
        <div className='grid md:grid-cols-3 gap-6 lg:gap-8'>
          {/* Main Content Column */}
          <div className='md:col-span-2 space-y-6'>
            
            {/* Shipping Address Card */}
            <Card className="shadow-sm border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-lowest">
              <CardContent className='p-6'>
                <div className="flex justify-between items-start mb-4">
                  <h2 className='text-xl font-semibold text-primary'>Shipping Address</h2>
                  <Link href='/shipping-address'>
                    <Button variant='outline' size="sm" className="rounded-full text-secondary border-secondary/50 hover:bg-secondary/10">
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="text-on-surface-variant leading-relaxed">
                  <p className="font-medium text-on-surface mb-1">{userAddress.fullName}</p>
                  <p>{userAddress.streetAddress}</p>
                  <p>{userAddress.city}, {userAddress.state} {userAddress.postalCode}</p>
                  <p className="mb-2">{userAddress.country}</p>
                  <p className="flex items-center text-secondary font-medium">
                    <span className="w-4 h-4 mr-1 inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                    +91 {userAddress.contactNumber}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card className="shadow-sm border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-lowest">
              <CardContent className='p-6'>
                <div className="flex justify-between items-start mb-4">
                  <h2 className='text-xl font-semibold text-primary'>Payment Method</h2>
                  <Link href='/payment-method'>
                    <Button variant='outline' size="sm" className="rounded-full text-secondary border-secondary/50 hover:bg-secondary/10">
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="text-on-surface-variant">
                  <p className="font-medium text-on-surface">{paymentMethod}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card className="shadow-sm border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-lowest">
              <CardContent className='p-6'>
                <h2 className='text-xl font-semibold text-primary mb-4'>Order Items</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-surface-container/50">
                      <TableRow>
                        <TableHead className="font-semibold">Item</TableHead>
                        <TableHead className="font-semibold text-center">Quantity</TableHead>
                        <TableHead className="font-semibold text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => (
                        <TableRow key={item.slug} className="hover:bg-surface-container-lowest border-b border-outline-variant/20">
                          <TableCell>
                            <Link
                              href={`/product/${item.slug}`}
                              className='flex items-center group'
                            >
                              <div className="relative overflow-hidden rounded-md border border-outline-variant/30">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={56}
                                  height={56}
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <span className='px-4 font-medium text-on-surface group-hover:text-secondary transition-colors line-clamp-2'>{item.name}</span>
                            </Link>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {item.qty}
                          </TableCell>
                          <TableCell className='text-right font-semibold text-primary'>
                            {formatCurrency(item.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="shadow-lg border-secondary/20 rounded-2xl overflow-hidden bg-surface-container-lowest sticky top-24">
              <div className="h-2 w-full gold-gradient-btn"></div>
              <CardContent className='p-6 space-y-6'>
                <h2 className="text-xl font-bold text-primary mb-2">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className='flex justify-between items-center text-on-surface-variant'>
                    <span>Items Total</span>
                    <span className="font-medium text-on-surface">{formatCurrency(cart.itemsPrice)}</span>
                  </div>
                  {cart.isGiftWrapped && (
                    <div className='flex justify-between items-center text-on-surface-variant'>
                      <span>Gift Wrapping</span>
                      <span className="font-medium text-on-surface">{formatCurrency(50)}</span>
                    </div>
                  )}
                  {Number(cart.discountPrice) > 0 && (
                    <div className='flex justify-between items-center text-emerald-600 font-medium'>
                      <span>Discount (Code: {cart.couponCode})</span>
                      <span>-{formatCurrency(cart.discountPrice || "0")}</span>
                    </div>
                  )}
                  <div className='flex justify-between items-center text-on-surface-variant'>
                    <span>Taxes (Inclusive)</span>
                    <span className="font-medium text-on-surface">{formatCurrency(cart.taxPrice)}</span>
                  </div>
                  <div className='flex justify-between items-center text-on-surface-variant'>
                    <span>Shipping</span>
                    <span className="font-medium text-on-surface">{formatCurrency(cart.shippingPrice)}</span>
                  </div>
                </div>
                
                <div className="h-px w-full bg-outline-variant/40 my-4"></div>
                
                <div className='flex justify-between items-end mb-6'>
                  <span className="text-lg font-semibold text-on-surface">Order Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(cart.totalPrice)}</span>
                </div>
                
                <PlaceOrderForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;