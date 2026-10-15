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

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const displayName = name && name !== 'NO_NAME' ? name : 'Beloved Devotee';
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.madhavshringaar.com';

  return (
    <Html>
      <Head />
      <Preview>Welcome to Madhav Shringaar - Divine Essentials For Your Beloved Kanha</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: BRAND_COLORS.cream, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: '24px 0' }}>
          <Container style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '16px', maxWidth: '600px', margin: '0 auto', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            
            <EmailHeader 
              title="Madhav Shringaar" 
              subtitle="Welcome To Our Devotional Family" 
            />

            <Section style={{ margin: '16px 0 20px 0' }}>
              <Heading style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.primary, margin: '0 0 8px 0' }}>
                Radhe Radhe, {displayName}! 🙏
              </Heading>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: '0 0 12px 0' }}>
                We are blessed to welcome you to the <strong>Madhav Shringaar</strong> family. Thank you for joining us on this sacred path of seva and devotion to Shri Radha Krishna.
              </Text>
              <Text style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, lineHeight: '1.6', margin: 0 }}>
                Explore our handpicked collection of Laddu Gopal poshak, designer mukuts, bansuris, singhasan, and authentic temple seva accessories crafted with love by traditional Vrindavan artisans.
              </Text>
            </Section>

            {/* Member Benefits Box */}
            <Section style={{ backgroundColor: BRAND_COLORS.cream, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
              <Text style={{ fontSize: '12px', fontWeight: 700, color: BRAND_COLORS.secondary, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>
                ✨ Your Devotee Privileges:
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textDark, margin: '0 0 6px 0' }}>
                • <strong>Bhakti Loyalty Points:</strong> Earn points on every divine purchase to redeem for future seva items.
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textDark, margin: '0 0 6px 0' }}>
                • <strong>Pan-India Express Delivery:</strong> Real-time shipment tracking with Shiprocket straight to your doorstep.
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textDark, margin: '0 0 6px 0' }}>
                • <strong>7-Day Devotional Return Policy:</strong> 100% peace of mind with our flexible size exchange guarantee.
              </Text>
              <Text style={{ fontSize: '12px', color: BRAND_COLORS.textDark, margin: 0 }}>
                • <strong>Authentic Vrindavan Sanctity:</strong> Pure handcrafted devotion in every single thread.
              </Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '24px 0 16px 0' }}>
              <Button
                href={serverUrl}
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
                Explore Sacred Collections &rarr;
              </Button>
            </Section>

            <EmailContactFooter />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
