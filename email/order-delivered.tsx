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
  const cleanOrderId = `OD${(order.id || '').replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com';

  const deliveredDate = order.deliveredAt
    ? new Date(order.deliveredAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Recently';

  if (isAdminNotification) {
    return (
      <Html>
        <Head />
        <Preview>✅ Order #{cleanOrderId} Delivered Successfully</Preview>
        <Tailwind>
          <Body style={{ backgroundColor: '#F3F4F6', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
            <Container style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
              <EmailHeader title="Madhav Shringaar" subtitle="Admin Logistics Notice" />
              <Section style={{ textAlign: 'center', margin: '16px 0' }}>
                <Heading style={{ fontSize: '20px', fontWeight: 800, color: '#065F46', margin: '0 0 8px 0' }}>
                  ✅ Order #{cleanOrderId} Delivered
                </Heading>
                <Text style={{ fontSize: '13px', color: '#4B5563', margin: 0 }}>
                  Customer: <strong>{customerName}</strong> • Delivered on {deliveredDate}
                </Text>
              </Section>
              <EmailContactFooter />
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }

  return (
    <Html>
      <Head />
      <Preview>🌸 Your Sacred Order #{cleanOrderId} Has Been Delivered! - Madhav Shringaar</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: BRAND_COLORS.cream, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="Sacred Package Delivered" 
            />

            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 8px 0' }}>
                Radhe Radhe, {customerName}! 🙏
              </Heading>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: 0 }}>
                We are overjoyed to let you know that your sacred order <strong style={{ color: BRAND_COLORS.primary, fontFamily: 'monospace' }}>#{cleanOrderId}</strong> has been safely handed over at your doorstep!
              </Text>
            </Section>

            {/* Delivered Success Card */}
            <Section style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '20px', margin: '20px 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '28px', margin: '0 0 4px 0' }}>
                🌸
              </Text>
              <Text style={{ fontSize: '16px', fontWeight: 800, color: '#065F46', margin: '0 0 4px 0' }}>
                Delivered Successfully on {deliveredDate}
              </Text>
              <Text style={{ fontSize: '12px', color: '#047857', margin: '0 0 16px 0' }}>
                May these sacred poshak and shringaar bring divine blessings to your temple seva!
              </Text>

              <Button
                href={`${serverUrl}/user/orders`}
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
                View Order & Download Invoice &rarr;
              </Button>
            </Section>

            {/* 7-Day Return & Exchange Promise */}
            <Section style={{ backgroundColor: BRAND_COLORS.cream, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Text style={{ fontSize: '12px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 6px 0' }}>
                🔄 7-Day Hassle-Free Devotional Return / Exchange
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textMuted, lineHeight: '1.5', margin: 0 }}>
                If you need a different size for your Laddu Gopal or if anything isn&apos;t completely perfect with your items, you can easily request a return or size exchange within 7 days directly from your <strong>My Orders</strong> portal.
              </Text>
            </Section>

            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
