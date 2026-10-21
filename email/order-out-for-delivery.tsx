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
import { EmailHeader, EmailContactFooter, BRAND_COLORS } from './email-components';

interface OrderOutForDeliveryEmailProps {
  order: any;
}

export default function OrderOutForDeliveryEmail({ order }: OrderOutForDeliveryEmailProps) {
  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    'Beloved Devotee';
  const cleanOrderId = `OD${(order.id || '').replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const effectiveAwb = order.awbNumber || '';
  const effectiveTrackingUrl =
    order.trackingUrl ||
    (order.awbNumber
      ? `https://shiprocket.co/tracking/${order.awbNumber}`
      : `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com'}/track-order?awb=${order.awbNumber || ''}`);

  return (
    <Html>
      <Head />
      <Preview>🛵 Out For Delivery: Order #{cleanOrderId} Arrives Today! - Madhav Shringaar</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: BRAND_COLORS.cream, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="Package Out For Delivery Today" 
            />

            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 8px 0' }}>
                Radhe Radhe, {customerName}! 🙏
              </Heading>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: 0 }}>
                Exciting news! Your sacred order <strong style={{ color: BRAND_COLORS.primary, fontFamily: 'monospace' }}>#{cleanOrderId}</strong> is <strong>out for delivery</strong> and our courier partner will reach your doorstep today!
              </Text>
            </Section>

            {/* Out for Delivery Card (Flipkart Style) */}
            <Section style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '20px', margin: '20px 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#047857', fontWeight: 700, margin: 0 }}>
                🛵 Delivery Associate is on the Way
              </Text>
              <Text style={{ fontSize: '16px', fontWeight: 800, color: '#065F46', margin: '8px 0' }}>
                Estimated Delivery: Today by 9:00 PM
              </Text>
              {effectiveAwb && (
                <Text style={{ fontSize: '12px', color: '#047857', margin: '0 0 16px 0', fontFamily: 'monospace' }}>
                  Shipment Tracking AWB: {effectiveAwb}
                </Text>
              )}

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
                Track Live Courier Location &rarr;
              </Button>
            </Section>

            {/* Doorstep Instructions (Flipkart Standard) */}
            <Section style={{ backgroundColor: BRAND_COLORS.cream, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.secondary, fontWeight: 700, margin: '0 0 8px 0' }}>
                Keep in mind at doorstep:
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textDark, margin: '0 0 6px 0' }}>
                • <strong>Delivery Requires OTP:</strong> Share OTP with the delivery executive only after physical handover of the sacred box.
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textDark, margin: 0 }}>
                • <strong>Open Box Inspection:</strong> Feel free to verify the poshak and jewellery before confirming.
              </Text>
            </Section>

            {/* Delivery Address */}
            <Section style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.textMuted, fontWeight: 700, margin: '0 0 4px 0' }}>
                Delivering To:
              </Text>
              <Text style={{ fontSize: '13px', fontWeight: 700, color: BRAND_COLORS.textDark, margin: '0 0 2px 0' }}>
                {(order.shippingAddress as any)?.fullName}
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textMuted, lineHeight: '1.5', margin: '0 0 4px 0' }}>
                {(order.shippingAddress as any)?.streetAddress}, {(order.shippingAddress as any)?.city} - {(order.shippingAddress as any)?.postalCode}
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.primary, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>
                📞 +91&nbsp;{(order.shippingAddress as any)?.contactNumber}
              </Text>
            </Section>

            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
