'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { generateGiftCard } from '@/lib/actions/giftcard.actions';
import { insertGiftCardSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-form-hooks'; // Wait, standard hook form
import { useForm as useReactHookForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GiftCardGenerator() {
  const form = useReactHookForm<z.infer<typeof insertGiftCardSchema>>({
    resolver: zodResolver(insertGiftCardSchema),
    defaultValues: {
      initialValue: '500',
    },
  });

  const onSubmit = async (values: z.infer<typeof insertGiftCardSchema>) => {
    const res = await generateGiftCard(values);

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(`Gift card ${res.data?.code} generated successfully.`);
      form.reset();
    }
  };

  return (
    <Card className='shadow-sm border-secondary/10 rounded-2xl'>
      <CardHeader>
        <CardTitle>Generate New Gift Card</CardTitle>
        <CardDescription>
          Create a new digital gift card code with a specific balance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 max-w-sm'
          >
            <FormField
              control={form.control}
              name='initialValue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (₹)</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter amount e.g. 1000' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              size='lg'
              className='w-full'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Generating...' : 'Generate Gift Card'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
