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

interface AdminOrderAlertEmailProps {
  order: any;
}

export default function AdminOrderAlertEmail({ order }: AdminOrderAlertEmailProps) {
  const customerName =
    order.user?.name || (order.shippingAddress as any)?.fullName || 'Devotee Customer';
  const customerEmail =
    (order.shippingAddress as any)?.guestEmail ||
    order.user?.email ||
    (order as any).guestEmail ||
    'N/A';
  const customerPhone =
    (order.shippingAddress as any)?.contactNumber ||
    (order.user as any)?.phoneNumber ||
    'N/A';
  const address = order.shippingAddress as any;
  const cleanOrderId = `OD${(order.id || '').replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com';

  return (
    <Html>
      <Head />
      <Preview>🚨 New Order Received #{cleanOrderId} - ₹{Number(order.totalPrice).toFixed(0)} ({order.paymentMethod})</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: '#F3F4F6', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="🚨 Admin New Order Alert" 
            />

            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                New Customer Order Received
              </Heading>
              <Text style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontFamily: 'monospace' }}>
                Order #{cleanOrderId} (Database ID: {order.id})
              </Text>
            </Section>

            {/* Quick Summary Grid */}
            <Section style={{ backgroundColor: BRAND_COLORS.cream, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '12px', padding: '16px 20px', margin: '16px 0' }}>
              <Row style={{ width: '100%' }}>
                <Column style={{ width: '50%' }}>
                  <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6B7280', margin: 0, fontWeight: 700 }}>
                    Payment Mode
                  </Text>
                  <Text style={{ fontSize: '13px', fontWeight: 800, color: '#111827', margin: '2px 0 0 0', textTransform: 'uppercase' }}>
                    {order.paymentMethod} {order.isPaid ? '✅ (PAID)' : '⏳ (COD / PENDING)'}
                  </Text>
                </Column>
                <Column style={{ width: '50%', textAlign: 'right' }}>
                  <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6B7280', margin: 0, fontWeight: 700 }}>
                    Order Total
                  </Text>
                  <Text style={{ fontSize: '18px', fontWeight: 900, color: BRAND_COLORS.primary, margin: '2px 0 0 0' }}>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Customer Details */}
            <Section style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', margin: '16px 0' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6B7280', fontWeight: 700, margin: '0 0 6px 0' }}>
                Customer & Contact Info
              </Text>
              <Text style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 2px 0' }}>
                {customerName}
              </Text>
              <Text style={{ fontSize: '12px', color: '#374151', margin: '0 0 4px 0' }}>
                📞 <strong>+91 {customerPhone}</strong> • ✉️ {customerEmail}
              </Text>
              {address && (
                <Text style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.5', margin: '4px 0 0 0' }}>
                  📍 {address.streetAddress}, {address.city}, {address.state} - {address.postalCode}, {address.country}
                </Text>
              )}
            </Section>

            {/* Items Table */}
            <Section style={{ margin: '20px 0' }}>
              <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6B7280', fontWeight: 700, margin: '0 0 10px 0' }}>
                Ordered Products ({order.orderitems?.length || 0})
              </Text>

              {order.orderitems?.map((item: any, idx: number) => {
                const itemImg = item.image
                  ? (item.image.startsWith('/') ? `${serverUrl}${item.image}` : item.image)
                  : 'https://www.madhavshringaar.com/images/logo.png';

                return (
                  <Section key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <Row style={{ width: '100%' }}>
                      <Column style={{ width: '48px', verticalAlign: 'top' }}>
                        <Img
                          src={itemImg}
                          alt={item.name}
                          width="42"
                          height="42"
                          style={{ borderRadius: '6px', objectFit: 'cover' }}
                        />
                      </Column>
                      <Column style={{ verticalAlign: 'top', paddingLeft: '10px' }}>
                        <Text style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
                          Qty: <strong>{item.qty}</strong> • Rate: {formatCurrency(item.price)}
                        </Text>
                      </Column>
                      <Column style={{ width: '80px', textAlign: 'right', verticalAlign: 'top' }}>
                        <Text style={{ fontSize: '12px', fontWeight: 800, color: BRAND_COLORS.primary, margin: 0 }}>
                          {formatCurrency(Number(item.price) * item.qty)}
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                );
              })}
            </Section>

            {/* Admin CTA Button */}
            <Section style={{ textAlign: 'center', margin: '24px 0 16px 0' }}>
              <Button
                href={`${serverUrl}/admin/orders`}
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
                Open Order in Admin Dashboard &rarr;
              </Button>
            </Section>

            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
