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

interface ReturnRequestAlertEmailProps {
  order: any;
  reason: string;
  comments?: string;
  isAdminNotification?: boolean;
}

export default function ReturnRequestAlertEmail({
  order,
  reason,
  comments,
  isAdminNotification = false,
}: ReturnRequestAlertEmailProps) {
  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    'Devotee Customer';

  return (
    <Html>
      <Head />
      <Preview>
        {isAdminNotification
          ? `⚠️ Return Request for Order #${order.id?.slice(0, 8).toUpperCase()}`
          : `Return Request Received for Order #${order.id?.slice(0, 8).toUpperCase()}`}
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
                7-Day Return Request
              </Text>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="my-4">
              <Text className="text-lg font-semibold text-[#003020] mb-2">
                {isAdminNotification
                  ? `Return Request for Order #${order.id}`
                  : `Radhe Radhe, ${customerName}! 🙏`}
              </Text>
              <Text className="text-sm text-neutral-700 leading-relaxed m-0">
                {isAdminNotification
                  ? `Customer ${customerName} has submitted a 7-day return request for Order #${order.id}. Please review in the Admin panel.`
                  : `We have received your return request for Order #${order.id}. Our team is reviewing the details and will update you within 24 hours.`}
              </Text>
            </Section>

            {/* Return Details Box */}
            <Section className="bg-[#FAF7F0] border border-[#E6C16A] rounded-xl p-5 my-5">
              <Row>
                <Column className="w-1/2">
                  <Text className="text-xs text-neutral-500 m-0">Return Reason</Text>
                  <Text className="text-sm font-bold text-neutral-800 m-0 mt-1">
                    {reason}
                  </Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text className="text-xs text-neutral-500 m-0">Order Total</Text>
                  <Text className="text-sm font-bold text-[#003020] m-0 mt-1">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
              {comments && (
                <Section className="mt-3 pt-3 border-t border-[#E6C16A]/40">
                  <Text className="text-xs text-neutral-500 m-0">Customer Comments:</Text>
                  <Text className="text-xs text-neutral-800 m-0 mt-1 italic">
                    &ldquo;{comments}&rdquo;
                  </Text>
                </Section>
              )}
            </Section>

            {/* Items */}
            <Section className="my-4">
              <Text className="text-xs uppercase tracking-wider font-bold text-neutral-500 m-0 mb-3">
                Order Items ({order.orderitems?.length || 0})
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
                {isAdminNotification ? 'Review & Approve / Reject in Admin Panel' : 'View Order Details'} &rarr;
              </Button>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="text-center mt-4">
              <Text className="text-xs text-neutral-500 m-0 mb-1">
                Support email:{' '}
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
