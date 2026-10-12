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

interface ReturnStatusUpdateEmailProps {
  order: any;
  action: 'APPROVED' | 'REJECTED';
  note?: string;
}

export default function ReturnStatusUpdateEmail({
  order,
  action,
  note,
}: ReturnStatusUpdateEmailProps) {
  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    'Beloved Devotee';
  const isApproved = action === 'APPROVED';

  return (
    <Html>
      <Head />
      <Preview>
        {isApproved
          ? `✅ Return Approved for Order #${order.id?.slice(0, 8).toUpperCase()}`
          : `Update on Return Request for Order #${order.id?.slice(0, 8).toUpperCase()}`}
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
                Return Request Status Update
              </Text>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="my-4">
              <Text className="text-lg font-semibold text-[#003020] mb-2">
                Radhe Radhe, {customerName}! 🙏
              </Text>
              <Text className="text-sm text-neutral-700 leading-relaxed m-0">
                This is an update regarding your return request for Order <strong>#{order.id}</strong>.
              </Text>
            </Section>

            {/* Decision Status Card */}
            <Section
              className={`rounded-xl p-5 my-5 text-center border ${
                isApproved
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-amber-50 border-amber-300'
              }`}
            >
              <Text className="text-3xl m-0 mb-1">{isApproved ? '✅' : 'ℹ️'}</Text>
              <Text
                className={`text-base font-bold m-0 ${
                  isApproved ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {isApproved ? 'Return Request Approved' : 'Return Request Closed / Rejected'}
              </Text>
              <Text className="text-xs text-neutral-700 mt-2 m-0 leading-relaxed">
                {isApproved
                  ? 'Our courier partner will contact you shortly to schedule a reverse pickup from your registered address. Please keep the items packed in their original box.'
                  : 'After careful inspection, your return request could not be processed.'}
              </Text>
              {note && (
                <Section className="mt-3 pt-3 border-t border-neutral-200/80">
                  <Text className="text-xs text-neutral-500 m-0">Admin Note:</Text>
                  <Text className="text-xs text-neutral-800 m-0 mt-1 italic">
                    &ldquo;{note}&rdquo;
                  </Text>
                </Section>
              )}
            </Section>

            {isApproved && (
              <Section className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-4">
                <Text className="text-xs uppercase tracking-wider font-bold text-neutral-600 m-0 mb-2">
                  🔄 Refund Instructions:
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed m-0">
                  Once the returned package reaches our Vrindavan Dham fulfillment center and passes inspection, your refund will be processed back to your original payment method (or bank account / store credit) within 3-5 business days.
                </Text>
              </Section>
            )}

            <Section className="text-center my-6">
              <Button
                className="bg-[#003020] text-[#F3D98F] px-6 py-3 rounded-xl font-bold text-sm no-underline inline-block shadow-sm"
                href={`https://www.madhavshringaar.com/order/${order.id}`}
              >
                View Order Details &rarr;
              </Button>
            </Section>

            <Hr className="border-[#F0EAE1] my-4" />

            <Section className="text-center mt-4">
              <Text className="text-xs text-neutral-500 m-0 mb-1">
                Have questions? Reach out to us anytime:
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
