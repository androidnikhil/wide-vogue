'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader, Smartphone, CreditCard, Landmark, Banknote, CheckCircle2 } from 'lucide-react';
import { DEFAULT_PAYMENT_METHOD } from '@/lib/constants';
import { toast } from 'sonner';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Payment options matching our constants
const PAYMENT_OPTIONS = [
  {
    id: 'UPI',
    title: 'UPI Apps',
    description: 'Google Pay, PhonePe, Paytm',
    icon: Smartphone,
  },
  {
    id: 'Card',
    title: 'Credit / Debit / ATM Card',
    description: 'Visa, MasterCard, RuPay',
    icon: CreditCard,
  },
  {
    id: 'NetBanking',
    title: 'Net Banking',
    description: 'All major Indian banks',
    icon: Landmark,
  },
  {
    id: 'CashOnDelivery',
    title: 'Cash on Delivery',
    description: 'Pay safely at your doorstep',
    icon: Banknote,
  },
];

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/place-order');
    });
  };

  return (
    <div className='max-w-2xl mx-auto py-8 px-4'>
      <Card className="shadow-lg border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-lowest">
        <CardHeader className="bg-gradient-to-r from-secondary-container/50 to-transparent border-b border-outline-variant/20 pb-6">
          <CardTitle className="h3-bold text-primary">Payment Method</CardTitle>
          <CardDescription className="text-on-surface-variant font-body-md mt-1">
            How would you like to pay for your divine items?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              method='post'
              className='space-y-6'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='w-full space-y-4'>
                    {PAYMENT_OPTIONS.map((option) => {
                      const isSelected = field.value === option.id;
                      const Icon = option.icon;

                      return (
                        <div
                          key={option.id}
                          onClick={() => field.onChange(option.id)}
                          className={`
                            relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${
                              isSelected
                                ? 'border-secondary bg-secondary-container/10 shadow-md transform scale-[1.01]'
                                : 'border-outline-variant/50 hover:border-secondary/50 hover:bg-surface-container-low'
                            }
                          `}
                        >
                          {/* Icon Container */}
                          <div className={`
                            flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4
                            ${isSelected ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-secondary'}
                          `}>
                            <Icon className="w-6 h-6" />
                          </div>

                          {/* Text Content */}
                          <div className="flex-grow">
                            <h4 className={`font-semibold text-lg ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                              {option.title}
                            </h4>
                            <p className="text-on-surface-variant text-sm mt-0.5">
                              {option.description}
                            </p>
                          </div>

                          {/* Selection Checkmark */}
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${isSelected ? 'border-secondary bg-secondary text-on-secondary' : 'border-outline-variant/50'}
                          `}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </div>
                      );
                    })}
                    <FormMessage className="text-error font-body-sm" />
                  </FormItem>
                )}
              />

              <div className='pt-6'>
                <Button 
                  type='submit' 
                  disabled={isPending}
                  className="w-full h-14 rounded-xl gold-gradient-btn text-primary-container font-label-lg font-bold shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isPending ? (
                    <Loader className='w-6 h-6 mr-2 animate-spin' />
                  ) : (
                    <ArrowRight className='w-6 h-6 mr-2' />
                  )}{' '}
                  Continue to Place Order
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodForm;