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
} from '@react-email/components';
import * as React from 'react';
import { EmailHeader, EmailContactFooter, BRAND_COLORS } from './email-components';

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
  const cleanOrderId = `OD${(order.id || '').replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const isApproved = action === 'APPROVED';
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com';

  return (
    <Html>
      <Head />
      <Preview>
        {isApproved
          ? `✅ Return Request Approved - Order #${cleanOrderId}`
          : `Update on Return Request - Order #${cleanOrderId}`}
      </Preview>
      <Tailwind>
        <Body style={{ backgroundColor: BRAND_COLORS.cream, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="Return / Exchange Update" 
            />

            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 8px 0' }}>
                Radhe Radhe, {customerName}! 🙏
              </Heading>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: 0 }}>
                This is an official update regarding your 7-day return request for Order <strong style={{ color: BRAND_COLORS.primary, fontFamily: 'monospace' }}>#{cleanOrderId}</strong>.
              </Text>
            </Section>

            {/* Status Highlight Card */}
            <Section
              style={{
                backgroundColor: isApproved ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${isApproved ? '#A7F3D0' : '#FECACA'}`,
                borderRadius: '12px',
                padding: '20px',
                margin: '20px 0',
                textAlign: 'center',
              }}
            >
              <Text style={{ fontSize: '24px', margin: '0 0 4px 0' }}>
                {isApproved ? '✅' : 'ℹ️'}
              </Text>
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: isApproved ? '#065F46' : '#991B1B',
                  margin: '0 0 6px 0',
                }}
              >
                {isApproved ? 'Return Request Approved' : 'Return Request Closed'}
              </Text>
              <Text
                style={{
                  fontSize: '13px',
                  color: isApproved ? '#047857' : '#B91C1C',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                {isApproved
                  ? 'Our courier partner will arrange reverse pickup within 2-3 business days. Please keep the sacred poshak safely packed.'
                  : (note || 'Your request could not be processed under the current 7-day policy guidelines.')}
              </Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '24px 0 16px 0' }}>
              <Button
                href={`${serverUrl}/order/${order.id}`}
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
                View Order Details &rarr;
              </Button>
            </Section>

            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
