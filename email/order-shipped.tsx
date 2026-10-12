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

interface OrderShippedEmailProps {
  order: any;
  awbNumber?: string;
  trackingUrl?: string;
}

export default function OrderShippedEmail({
  order,
  awbNumber,
  trackingUrl,
}: OrderShippedEmailProps) {
  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    'Beloved Devotee';
  const effectiveAwb = awbNumber || order.awbNumber || 'In Transit';
  const effectiveTrackingUrl =
    trackingUrl ||
    order.trackingUrl ||
    (order.awbNumber
      ? `https://shiprocket.co/tracking/${order.awbNumber}`
      : 'https://www.madhavshringaar.com/track-order');

  return (
    <Html>
      <Head />
      <Preview>🚚 Your Sacred Order #{order.id?.slice(0, 8).toUpperCase()} Has Been Shipped!</Preview>
      <Tailwind>
        <Body className="bg-[#FAF7F0] font-sans py-8">
          <Container className="bg-white border border-[#E6C16A]/40 rounded-2xl max-w-[580px] mx-auto p-8 shadow-sm">
            {/* Header */}
            <Section className="text-center mb-6">
              <Heading className="text-2xl font-bold text-[#003020] m-0">
                Madhav Shringaar
              </Heading>
              <Text className="text-xs text-[#C88A20] tracking-widest uppercase font-semibold mt-1">
                Divine Essentials For Your Beloved Kanha
              </Text>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="my-4">
              <Text className="text-lg font-semibold text-[#003020] mb-2">
                Radhe Radhe, {customerName}! 🙏
              </Text>
              <Text className="text-sm text-neutral-600 leading-relaxed m-0">
                Great news! Your sacred package has been carefully packed with devotion and dispatched via our express courier partner.
              </Text>
            </Section>

            {/* Shipment Tracking Box */}
            <Section className="bg-[#FAF7F0] border border-[#E6C16A] rounded-xl p-5 my-5 text-center">
              <Text className="text-xs uppercase tracking-wider font-bold text-[#003020] m-0">
                Courier Tracking Details
              </Text>
              <Text className="text-xl font-bold font-mono text-[#003020] my-2">
                AWB: {effectiveAwb}
              </Text>
              <Text className="text-xs text-neutral-600 m-0 mb-4">
                Partner: Shiprocket Pan-India Express
              </Text>
              <Button
                className="bg-[#003020] text-[#F3D98F] px-6 py-3 rounded-xl font-bold text-sm no-underline inline-block shadow-sm"
                href={effectiveTrackingUrl}
              >
                Track Live Package Status &rarr;
              </Button>
            </Section>

            {/* Delivery Address */}
            <Section className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-4">
              <Text className="text-xs uppercase tracking-wider font-bold text-neutral-500 m-0 mb-1">
                Shipping To:
              </Text>
              <Text className="text-sm font-semibold text-neutral-800 m-0">
                {(order.shippingAddress as any)?.fullName}
              </Text>
              <Text className="text-xs text-neutral-600 m-0 mt-0.5 leading-relaxed">
                {(order.shippingAddress as any)?.streetAddress},{' '}
                {(order.shippingAddress as any)?.city},{' '}
                {(order.shippingAddress as any)?.postalCode}
              </Text>
            </Section>

            {/* Order Items */}
            <Section className="my-4">
              <Text className="text-xs uppercase tracking-wider font-bold text-neutral-500 m-0 mb-3">
                Items In This Package
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

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="text-center mt-4">
              <Text className="text-xs text-neutral-500 m-0 mb-1">
                Need help with your delivery? We are here for you.
              </Text>
              <Text className="text-xs text-neutral-500 m-0 mb-2">
                Email us at{' '}
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
