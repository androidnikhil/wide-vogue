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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { formatCurrency } from '@/lib/utils';
import { EmailHeader, EmailContactFooter, BRAND_COLORS } from './email-components';

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
  const cleanOrderId = `OD${(order.id || '').replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com';

  return (
    <Html>
      <Head />
      <Preview>
        {isAdminNotification
          ? `⚠️ Return Request for Order #${cleanOrderId} (${reason})`
          : `7-Day Return Request Received for Order #${cleanOrderId}`}
      </Preview>
      <Tailwind>
        <Body style={{ backgroundColor: BRAND_COLORS.cream, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="7-Day Return / Exchange Service" 
            />

            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 8px 0' }}>
                {isAdminNotification ? `⚠️ Return Request Alert` : `Radhe Radhe, ${customerName}! 🙏`}
              </Heading>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: 0 }}>
                {isAdminNotification
                  ? `Customer ${customerName} has requested a return for Order #${cleanOrderId}. Please review and update in the admin dashboard.`
                  : `We have received your 7-day return request for Order #${cleanOrderId}. Our team is reviewing the details with care.`}
              </Text>
            </Section>

            {/* Return Details Box */}
            <Section style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#B45309', fontWeight: 700, margin: '0 0 6px 0' }}>
                Return Request Summary
              </Text>
              <Text style={{ fontSize: '13px', color: '#78350F', margin: '0 0 4px 0' }}>
                Order ID: <strong>{cleanOrderId}</strong>
              </Text>
              <Text style={{ fontSize: '13px', color: '#78350F', margin: '0 0 4px 0' }}>
                Reason: <strong>{reason}</strong>
              </Text>
              {comments && (
                <Text style={{ fontSize: '12px', color: '#92400E', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                  Note / Comments: &ldquo;{comments}&rdquo;
                </Text>
              )}
            </Section>

            {/* Next Steps */}
            <Section style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Text style={{ fontSize: '12px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 6px 0' }}>
                What happens next?
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textMuted, lineHeight: '1.5', margin: 0 }}>
                Our team reviews return requests within 24 business hours. Once approved, reverse courier pickup will be scheduled. Please keep the sacred poshak in its original packing.
              </Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '24px 0 16px 0' }}>
              <Button
                href={isAdminNotification ? `${serverUrl}/admin/orders` : `${serverUrl}/user/orders`}
                style={{
                  backgroundColor: BRAND_COLORS.primary,
                  color: BRAND_COLORS.goldLight,
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                {isAdminNotification ? 'Review in Admin Panel &rarr;' : 'View My Orders &rarr;'}
              </Button>
            </Section>

            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
