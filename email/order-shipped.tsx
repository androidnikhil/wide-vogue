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
  Img,
} from '@react-email/components';
import * as React from 'react';
import { formatCurrency } from '@/lib/utils';
import { EmailHeader, EmailContactFooter, BRAND_COLORS } from './email-components';

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
  const cleanOrderId = `OD${(order.id || '').replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const effectiveAwb = awbNumber || order.awbNumber || 'In Transit';
  const effectiveTrackingUrl =
    trackingUrl ||
    order.trackingUrl ||
    (order.awbNumber
      ? `https://shiprocket.co/tracking/${order.awbNumber}`
      : `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com'}/track-order?awb=${order.awbNumber || ''}`);

  return (
    <Html>
      <Head />
      <Preview>🚚 Sacred Order #{cleanOrderId} Has Shipped! - Madhav Shringaar</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: BRAND_COLORS.cream, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="Sacred Shipment Dispatched" 
            />

            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 8px 0' }}>
                Radhe Radhe, {customerName}! 🙏
              </Heading>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: 0 }}>
                Wonderful news! Your sacred package for Order <strong style={{ color: BRAND_COLORS.primary, fontFamily: 'monospace' }}>#{cleanOrderId}</strong> has been carefully packed with devotion and handed over to our express courier partner.
              </Text>
            </Section>

            {/* Courier Tracking Box (Flipkart Style) */}
            <Section style={{ backgroundColor: BRAND_COLORS.cream, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '12px', padding: '20px', margin: '20px 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.secondary, fontWeight: 700, margin: 0 }}>
                Shiprocket Courier Tracking Details
              </Text>
              <Text style={{ fontSize: '20px', fontWeight: 800, color: BRAND_COLORS.primary, margin: '8px 0 4px 0', fontFamily: 'monospace' }}>
                AWB: {effectiveAwb}
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textMuted, margin: '0 0 16px 0' }}>
                Courier: Delhivery / Shiprocket Pan-India Express
              </Text>

              <Button
                href={effectiveTrackingUrl}
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
                Track Live Package Status &rarr;
              </Button>
            </Section>

            {/* Delivery Address */}
            <Section style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.textMuted, fontWeight: 700, margin: '0 0 4px 0' }}>
                Shipping Destination:
              </Text>
              <Text style={{ fontSize: '13px', fontWeight: 700, color: BRAND_COLORS.textDark, margin: '0 0 2px 0' }}>
                {(order.shippingAddress as any)?.fullName}
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textMuted, lineHeight: '1.5', margin: '0 0 4px 0' }}>
                {(order.shippingAddress as any)?.streetAddress}, {(order.shippingAddress as any)?.city} - {(order.shippingAddress as any)?.postalCode}
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.primary, fontWeight: 600, margin: 0 }}>
                📞 +91 {(order.shippingAddress as any)?.contactNumber}
              </Text>
            </Section>

            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
