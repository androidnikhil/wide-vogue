import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  Button,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import { formatCurrency } from '@/lib/utils';
import { EmailHeader, EmailContactFooter, BRAND_COLORS } from './email-components';

interface PurchaseReceiptEmailProps {
  order: any;
}

export default function PurchaseReceiptEmail({ order }: PurchaseReceiptEmailProps) {
  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    'Beloved Devotee';
  const cleanOrderId = `OD${(order.id || '').replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const address = order.shippingAddress as any;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com';
  const trackUrl = `${serverUrl}/order/${order.id}`;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <Html>
      <Head />
      <Preview>🌸 Order Confirmation #{cleanOrderId} - Madhav Shringaar</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: BRAND_COLORS.cream, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            {/* Sacred Brand Header with Logo */}
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="Devotional Essentials For Your Beloved Kanha" 
            />

            {/* Greeting */}
            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 8px 0' }}>
                Radhe Radhe, {customerName}! 🙏
              </Heading>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: 0 }}>
                Thank you for your sacred order. We have received your purchase and our artisans in Vrindavan Dham are preparing your divine items with love, devotion, and reverence.
              </Text>
            </Section>

            {/* Order Highlight Box (Flipkart Style) */}
            <Section style={{ backgroundColor: BRAND_COLORS.cream, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Row style={{ width: '100%' }}>
                <Column style={{ width: '33%', textAlign: 'left' }}>
                  <Text style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.textMuted, margin: 0, fontWeight: 700 }}>
                    Order ID
                  </Text>
                  <Text style={{ fontSize: '12px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>
                    {cleanOrderId}
                  </Text>
                </Column>

                <Column style={{ width: '33%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.textMuted, margin: 0, fontWeight: 700 }}>
                    Order Date
                  </Text>
                  <Text style={{ fontSize: '12px', fontWeight: 600, color: BRAND_COLORS.textDark, margin: '4px 0 0 0' }}>
                    {formattedDate}
                  </Text>
                </Column>

                <Column style={{ width: '33%', textAlign: 'right' }}>
                  <Text style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.textMuted, margin: 0, fontWeight: 700 }}>
                    Total Amount
                  </Text>
                  <Text style={{ fontSize: '14px', fontWeight: 800, color: BRAND_COLORS.primary, margin: '4px 0 0 0' }}>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>

              <Row style={{ width: '100%', marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${BRAND_COLORS.borderLight}` }}>
                <Column style={{ width: '50%' }}>
                  <Text style={{ fontSize: '11px', color: BRAND_COLORS.textMuted, margin: 0 }}>
                    Payment: <strong style={{ color: BRAND_COLORS.textDark }}>{order.paymentMethod}</strong>
                  </Text>
                </Column>
                <Column style={{ width: '50%', textAlign: 'right' }}>
                  <Text style={{ fontSize: '11px', color: order.isPaid ? '#047857' : '#B45309', margin: 0, fontWeight: 700 }}>
                    {order.isPaid ? '✓ Payment Received' : '⏳ Payment Pending (COD)'}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Product Items Table */}
            <Section style={{ margin: '24px 0' }}>
              <Text style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.textMuted, fontWeight: 700, margin: '0 0 12px 0' }}>
                Items Ordered ({order.orderitems?.length || 0})
              </Text>

              {order.orderitems?.map((item: any, idx: number) => {
                const itemImg = item.image
                  ? (item.image.startsWith('/') ? `${serverUrl}${item.image}` : item.image)
                  : 'https://www.madhavshringaar.com/images/logo.png';

                return (
                  <Section key={idx} style={{ padding: '12px 0', borderBottom: `1px solid ${BRAND_COLORS.borderLight}` }}>
                    <Row style={{ width: '100%' }}>
                      <Column style={{ width: '64px', verticalAlign: 'top' }}>
                        <Img
                          src={itemImg}
                          alt={item.name}
                          width="56"
                          height="56"
                          style={{
                            borderRadius: '8px',
                            border: `1px solid ${BRAND_COLORS.borderLight}`,
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </Column>
                      <Column style={{ verticalAlign: 'top', paddingLeft: '12px' }}>
                        <Text style={{ fontSize: '13px', fontWeight: 600, color: BRAND_COLORS.textDark, margin: '0 0 4px 0' }}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: '11px', color: BRAND_COLORS.textMuted, margin: 0 }}>
                          Qty: <strong>{item.qty}</strong> • Vrindavan Handcrafted
                        </Text>
                      </Column>
                      <Column style={{ width: '90px', textAlign: 'right', verticalAlign: 'top' }}>
                        <Text style={{ fontSize: '13px', fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
                          {formatCurrency(Number(item.price) * item.qty)}
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                );
              })}

              {/* Price Breakdown */}
              <Section style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#F9FAFB', borderRadius: '10px' }}>
                {[
                  { label: 'Items Subtotal', val: order.itemsPrice },
                  { label: 'Taxes', val: order.taxPrice || 0 },
                  { label: 'Shipping', val: order.shippingPrice === '0' || !order.shippingPrice ? 'FREE' : formatCurrency(order.shippingPrice) },
                ].map((row, rIdx) => (
                  <Row key={rIdx} style={{ width: '100%', marginBottom: '6px' }}>
                    <Column style={{ fontSize: '12px', color: BRAND_COLORS.textMuted }}>{row.label}</Column>
                    <Column style={{ fontSize: '12px', color: BRAND_COLORS.textDark, textAlign: 'right', fontWeight: 500 }}>
                      {typeof row.val === 'string' && (row.val === 'FREE' || row.val.startsWith('₹')) ? row.val : formatCurrency(row.val)}
                    </Column>
                  </Row>
                ))}

                <Row style={{ width: '100%', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E5E7EB' }}>
                  <Column style={{ fontSize: '14px', fontWeight: 800, color: BRAND_COLORS.primary }}>Total Price</Column>
                  <Column style={{ fontSize: '15px', fontWeight: 800, color: BRAND_COLORS.primary, textAlign: 'right' }}>
                    {formatCurrency(order.totalPrice)}
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Delivery Address */}
            {address && (
              <Section style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
                <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: BRAND_COLORS.textMuted, fontWeight: 700, margin: '0 0 6px 0' }}>
                  Delivery Address
                </Text>
                <Text style={{ fontSize: '13px', fontWeight: 700, color: BRAND_COLORS.textDark, margin: '0 0 2px 0' }}>
                  {address.fullName}
                </Text>
                <Text style={{ fontSize: '12px', color: BRAND_COLORS.textMuted, lineHeight: '1.5', margin: '0 0 4px 0' }}>
                  {address.streetAddress}, {address.city}, {address.state} - {address.postalCode}, {address.country}
                </Text>
                <Text style={{ fontSize: '12px', color: BRAND_COLORS.primary, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>
                  📞 +91&nbsp;{address.contactNumber}
                </Text>
              </Section>
            )}

            {/* Track Order Action Button */}
            <Section style={{ textAlign: 'center', margin: '28px 0 16px 0' }}>
              <Button
                href={trackUrl}
                style={{
                  backgroundColor: BRAND_COLORS.primary,
                  color: BRAND_COLORS.goldLight,
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 2px 8px rgba(0,48,32,0.2)',
                }}
              >
                Track Your Sacred Order &rarr;
              </Button>
            </Section>

            {/* Shared Contact Footer */}
            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}