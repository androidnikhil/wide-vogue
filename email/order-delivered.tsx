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

interface OrderDeliveredEmailProps {
  order: any;
  isAdminNotification?: boolean;
}

export default function OrderDeliveredEmail({
  order,
  isAdminNotification = false,
}: OrderDeliveredEmailProps) {
  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    'Beloved Devotee';

  return (
    <Html>
      <Head />
      <Preview>
        {isAdminNotification
          ? `✅ Order #${order.id?.slice(0, 8).toUpperCase()} Delivered Successfully`
          : `🌸 Your Sacred Order #${order.id?.slice(0, 8).toUpperCase()} Has Been Delivered!`}
      </Preview>
      <Tailwind>
        <Body className="bg-[#FAF7F0] font-sans py-8">
          <Container className="bg-white border border-[#E6C16A]/40 rounded-2xl max-w-[580px] mx-auto p-8 shadow-sm">
            {/* Header */}
            <Section className="text-center mb-6">
              <Heading className="text-2xl font-bold text-[#003020] m-0">
                Madhav Shringaar
              </Heading>
              <Text className="text-xs text-[#C88A20] tracking-widest uppercase font-semibold mt-1">
                {isAdminNotification ? 'Admin Delivery Notice' : 'Divine Essentials For Your Beloved Kanha'}
              </Text>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="my-4">
              <Text className="text-lg font-semibold text-[#003020] mb-2">
                {isAdminNotification
                  ? `Order #${order.id} Delivered`
                  : `Radhe Radhe, ${customerName}! 🙏`}
              </Text>
              <Text className="text-sm text-neutral-700 leading-relaxed m-0">
                {isAdminNotification
                  ? `Order #${order.id} for ${customerName} has been successfully delivered and marked complete.`
                  : 'Your sacred package has been delivered to your doorstep. May Thakur Ji bless your home with divine grace, joy, and peace!'}
              </Text>
            </Section>

            {/* Delivery Confirmation Card */}
            <Section className="bg-[#FAF7F0] border border-[#E6C16A] rounded-xl p-5 my-5 text-center">
              <Text className="text-3xl m-0 mb-1">🎉</Text>
              <Text className="text-base font-bold text-[#003020] m-0">
                Package Delivered Successfully
              </Text>
              <Text className="text-xs text-neutral-600 mt-2 m-0">
                Delivered on: {new Date(order.deliveredAt || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'full' })}
              </Text>
              {order.awbNumber && (
                <Text className="text-xs font-mono text-neutral-500 mt-1 m-0">
                  AWB: {order.awbNumber}
                </Text>
              )}
            </Section>

            {/* 7-Day Return Guarantee Notice for Customer */}
            {!isAdminNotification && (
              <Section className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-4">
                <Text className="text-xs uppercase tracking-wider font-bold text-emerald-800 m-0 mb-1">
                  ✨ 7-Day Devotional Guarantee
                </Text>
                <Text className="text-xs text-emerald-700 leading-relaxed m-0">
                  We inspect each item with reverence. If an eligible item has any size or defect issue, you can request a return directly from your <strong>My Orders</strong> page within 7 days of delivery.
                </Text>
              </Section>
            )}

            {/* Delivered Items */}
            <Section className="my-4">
              <Text className="text-xs uppercase tracking-wider font-bold text-neutral-500 m-0 mb-3">
                Delivered Items ({order.orderitems?.length || 0})
              </Text>
              {order.orderitems?.map((item: any, idx: number) => (
                <Row key={idx} className="border-b border-neutral-100 py-2">
                  <Column className="w-3/4">
                    <Text className="text-sm font-medium text-neutral-800 m-0">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-neutral-500 m-0">
                      Qty: {item.qty} {item.size ? `• ${item.size}` : ''}
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

            <Section className="text-center my-6">
              <Button
                className="bg-[#003020] text-[#F3D98F] px-6 py-3 rounded-xl font-bold text-sm no-underline inline-block shadow-sm"
                href={`https://www.madhavshringaar.com/order/${order.id}`}
              >
                {isAdminNotification ? 'Open in Admin Panel' : 'View Order Details & Invoice'} &rarr;
              </Button>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="text-center mt-4">
              <Text className="text-xs text-neutral-500 m-0 mb-1">
                Questions or support? We are at your seva.
              </Text>
              <Text className="text-xs text-neutral-500 m-0 mb-2">
                <a
                  href="mailto:info@madhavshringaar.com"
                  className="text-[#C88A20] font-semibold underline"
                >
                  info@madhavshringaar.com
                </a>
              </Text>
              <Text className="text-[11px] text-neutral-400 m-0">
                © {new Date().getFullYear()} Madhav Shringaar. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
