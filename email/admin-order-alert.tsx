import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Button,
  Hr,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { formatCurrency } from '@/lib/utils';

interface AdminOrderAlertEmailProps {
  order: any;
}

export default function AdminOrderAlertEmail({ order }: AdminOrderAlertEmailProps) {
  const customerName = order.user?.name || (order.shippingAddress as any)?.fullName || 'Devotee Customer';
  const customerEmail = (order.shippingAddress as any)?.guestEmail || order.user?.email || (order as any).guestEmail || 'N/A';
  const customerPhone = (order.shippingAddress as any)?.contactNumber || (order.user as any)?.phoneNumber || 'N/A';
  const address = order.shippingAddress as any;

  return (
    <Html>
      <Head />
      <Preview>🚨 New Order Received #{order.id?.slice(0, 8).toUpperCase()} - ₹{Number(order.totalPrice).toFixed(0)}</Preview>
      <Tailwind>
        <Body className="bg-[#f5f5f5] font-sans py-8">
          <Container className="bg-white border border-[#e5e5e5] rounded-2xl max-w-[600px] mx-auto p-8 shadow-sm">
            {/* Header */}
            <Section className="text-center mb-6">
              <Heading className="text-2xl font-bold text-[#003020] m-0">
                Madhav Shringaar — Admin Alert
              </Heading>
              <Text className="text-xs text-[#C88A20] tracking-widest uppercase font-semibold mt-1">
                New Order Received
              </Text>
            </Section>

            <Hr className="border-[#e5e5e5] my-4" />

            <Section className="my-4">
              <Text className="text-base font-semibold text-[#111827]">
                Order #{order.id}
              </Text>
              <Text className="text-xs text-[#6b7280] m-0">
                Placed on: {new Date(order.createdAt || Date.now()).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </Text>
            </Section>

            {/* Quick Summary Grid */}
            <Section className="bg-[#FAF7F0] border border-[#E6C16A]/40 rounded-xl p-4 my-4">
              <Row>
                <Column className="w-1/2">
                  <Text className="text-xs text-neutral-500 m-0">Payment Method</Text>
                  <Text className="text-sm font-bold text-neutral-800 m-0 mt-1 uppercase">
                    {order.paymentMethod} {order.isPaid ? '✅ (PAID)' : '⚠️ (PENDING/COD)'}
                  </Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text className="text-xs text-neutral-500 m-0">Total Amount</Text>
                  <Text className="text-lg font-bold text-[#003020] m-0 mt-1">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Customer & Shipping Details */}
            <Section className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-4">
              <Text className="text-xs uppercase tracking-wider font-bold text-neutral-500 m-0 mb-2">
                Customer & Delivery Address
              </Text>
              <Text className="text-sm font-bold text-neutral-900 m-0">
                {customerName}
              </Text>
              <Text className="text-xs text-neutral-600 m-0 mt-0.5">
                📞 +91 {customerPhone} • ✉️ {customerEmail}
              </Text>
              {address && (
                <Text className="text-xs text-neutral-600 m-0 mt-1 leading-relaxed">
                  {address.streetAddress}, {address.city}, {address.state} - {address.postalCode}, {address.country}
                </Text>
              )}
            </Section>

            {/* Order Items Table */}
            <Section className="my-6">
              <Text className="text-xs uppercase tracking-wider font-bold text-neutral-500 m-0 mb-3">
                Items Ordered ({order.orderitems?.length || 0})
              </Text>
              {order.orderitems?.map((item: any, idx: number) => (
                <Row key={idx} className="border-b border-neutral-100 py-2">
                  <Column className="w-3/4">
                    <Text className="text-sm font-semibold text-neutral-800 m-0">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-neutral-500 m-0">
                      Qty: {item.qty} {item.size ? `• Size: ${item.size}` : ''}
                    </Text>
                  </Column>
                  <Column className="w-1/4 text-right">
                    <Text className="text-sm font-bold text-neutral-800 m-0">
                      {formatCurrency(Number(item.price) * item.qty)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Admin Action Button */}
            <Section className="text-center my-6">
              <Button
                className="bg-[#003020] text-[#F3D98F] px-6 py-3 rounded-xl font-bold text-sm no-underline inline-block shadow-md"
                href={`https://www.madhavshringaar.com/order/${order.id}`}
              >
                View & Fulfill Order in Admin Panel &rarr;
              </Button>
            </Section>

            <Hr className="border-[#e5e5e5] my-4" />

            <Section className="text-center">
              <Text className="text-[11px] text-neutral-400 m-0">
                Automated admin dispatch notification sent to nikhil.pandey@madhavshringaar.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
