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
} from '@react-email/components';
import * as React from 'react';

interface OrderOutForDeliveryEmailProps {
  order: any;
}

export default function OrderOutForDeliveryEmail({ order }: OrderOutForDeliveryEmailProps) {
  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    'Beloved Devotee';
  const effectiveAwb = order.awbNumber || '';
  const effectiveTrackingUrl =
    order.trackingUrl ||
    (order.awbNumber
      ? `https://shiprocket.co/tracking/${order.awbNumber}`
      : 'https://www.madhavshringaar.com/track-order');

  return (
    <Html>
      <Head />
      <Preview>🛵 Out for Delivery: Your Sacred Order #{order.id?.slice(0, 8).toUpperCase()} Arrives Today!</Preview>
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
              <Text className="text-sm text-neutral-700 leading-relaxed m-0">
                Your sacred order <strong>#{order.id?.slice(0, 8).toUpperCase()}</strong> is <strong>out for delivery</strong> and will reach your doorstep today!
              </Text>
            </Section>

            {/* Notification Card */}
            <Section className="bg-[#FAF7F0] border border-[#E6C16A] rounded-xl p-5 my-5 text-center">
              <Text className="text-2xl m-0 mb-1">🛵</Text>
              <Text className="text-base font-bold text-[#003020] m-0">
                Delivery Executive Is On The Way
              </Text>
              <Text className="text-xs text-neutral-600 mt-2 mb-4 leading-relaxed">
                Please ensure someone is available at the delivery address to receive your holy package.
                {order.paymentMethod === 'CashOnDelivery' && !order.isPaid ? (
                  <span className="block font-bold text-[#003020] mt-1">
                    Please keep exact cash ready for COD payment: ₹{Number(order.totalPrice).toFixed(0)}
                  </span>
                ) : null}
              </Text>

              {effectiveAwb && (
                <Button
                  className="bg-[#003020] text-[#F3D98F] px-6 py-3 rounded-xl font-bold text-sm no-underline inline-block shadow-sm"
                  href={effectiveTrackingUrl}
                >
                  Track Courier in Real Time &rarr;
                </Button>
              )}
            </Section>

            {/* Address */}
            <Section className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-4">
              <Text className="text-xs uppercase tracking-wider font-bold text-neutral-500 m-0 mb-1">
                Delivery Address:
              </Text>
              <Text className="text-sm font-semibold text-neutral-800 m-0">
                {(order.shippingAddress as any)?.fullName} (📞 +91 {(order.shippingAddress as any)?.contactNumber})
              </Text>
              <Text className="text-xs text-neutral-600 m-0 mt-0.5">
                {(order.shippingAddress as any)?.streetAddress}, {(order.shippingAddress as any)?.city} - {(order.shippingAddress as any)?.postalCode}
              </Text>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="text-center mt-4">
              <Text className="text-xs text-neutral-500 m-0 mb-1">
                Any delivery issues? Contact us at{' '}
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
