import * as React from 'react';
import {
  Section,
  Heading,
  Text,
  Img,
  Hr,
  Row,
  Column,
  Button,
} from '@react-email/components';

export const BRAND_COLORS = {
  primary: '#003020',
  secondary: '#C88A20',
  gold: '#D4AF37',
  goldLight: '#F3D98F',
  cream: '#FAF7F0',
  textDark: '#111827',
  textMuted: '#4B5563',
  border: '#E6C16A',
  borderLight: '#F0EAE1',
  white: '#FFFFFF',
};

export const LOGO_FALLBACK_URL = 'https://www.madhavshringaar.com/images/logo.png';

interface EmailHeaderProps {
  title?: string;
  subtitle?: string;
}

export function EmailHeader({
  title = 'Madhav Shringaar',
  subtitle = 'Divine Essentials For Your Beloved Kanha',
}: EmailHeaderProps) {
  return (
    <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
      {/* Devotional Salutation */}
      <Text
        style={{
          color: BRAND_COLORS.secondary,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          margin: '0 0 10px 0',
        }}
      >
        ॥ Radhe Radhe ॥
      </Text>

      {/* Brand Logo */}
      <div style={{ textAlign: 'center', margin: '0 auto 8px auto' }}>
        <Img
          src="cid:madhav_logo"
          alt="Madhav Shringaar"
          width="180"
          height="60"
          style={{
            margin: '0 auto',
            display: 'block',
            height: '56px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Subtitle */}
      <Text
        style={{
          color: BRAND_COLORS.secondary,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          margin: '4px 0 0 0',
        }}
      >
        {subtitle}
      </Text>

      <Hr
        style={{
          borderColor: BRAND_COLORS.borderLight,
          margin: '18px 0 0 0',
          borderWidth: '1px',
        }}
      />
    </Section>
  );
}

export function EmailContactFooter() {
  return (
    <Section style={{ marginTop: '28px', borderTop: `1px solid ${BRAND_COLORS.borderLight}`, paddingTop: '20px' }}>
      {/* Contact & Support Box */}
      <Section
        style={{
          backgroundColor: BRAND_COLORS.cream,
          border: `1px solid ${BRAND_COLORS.border}`,
          borderRadius: '12px',
          padding: '16px 20px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <Text
          style={{
            color: BRAND_COLORS.primary,
            fontSize: '13px',
            fontWeight: 700,
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          🙏 Need Help With Your Seva Order?
        </Text>
        <Text
          style={{
            color: BRAND_COLORS.textMuted,
            fontSize: '12px',
            lineHeight: '1.6',
            margin: '0 0 10px 0',
          }}
        >
          Our dedicated devotee support team is always delighted to assist you.
        </Text>

        <div style={{ margin: '14px auto 6px auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: BRAND_COLORS.white,
              border: `1px solid ${BRAND_COLORS.border}`,
              borderRadius: '8px',
              padding: '8px 14px',
              margin: '4px 6px',
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: BRAND_COLORS.textDark, whiteSpace: 'nowrap' }}>
              📞 Call / WhatsApp:&nbsp;
            </span>
            <a
              href="tel:+917982160480"
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: BRAND_COLORS.primary,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                wordBreak: 'keep-all',
              }}
            >
              +91&#8209;79821&#8209;60480
            </a>
          </div>

          <div
            style={{
              display: 'inline-block',
              backgroundColor: BRAND_COLORS.white,
              border: `1px solid ${BRAND_COLORS.borderLight}`,
              borderRadius: '8px',
              padding: '8px 14px',
              margin: '4px 6px',
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: BRAND_COLORS.textDark, whiteSpace: 'nowrap' }}>
              ✉️ Email:&nbsp;
            </span>
            <a
              href="mailto:info@madhavshringaar.com"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: BRAND_COLORS.primary,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                wordBreak: 'keep-all',
              }}
            >
              info@madhavshringaar.com
            </a>
          </div>
        </div>

        <Text
          style={{
            fontSize: '11px',
            color: BRAND_COLORS.secondary,
            fontWeight: 600,
            margin: '10px 0 0 0',
          }}
        >
          Operating with devotion from Agra & Noida Hubs • Pan-India Express Delivery
        </Text>
      </Section>

      {/* Return Policy Notice & Blessings */}
      <Text
        style={{
          fontSize: '11px',
          color: BRAND_COLORS.textMuted,
          textAlign: 'center',
          lineHeight: '1.5',
          margin: '0 0 6px 0',
        }}
      >
        ✨ <strong>7-Day Devotional Return Guarantee:</strong> Items eligible for return/exchange within 7 days of delivery.
      </Text>

      <Text
        style={{
          fontSize: '11px',
          color: BRAND_COLORS.secondary,
          textAlign: 'center',
          fontStyle: 'italic',
          margin: '0 0 12px 0',
        }}
      >
        May Shri Radha Krishna bless your home with eternal joy, peace, and divine grace.
      </Text>

      {/* Copyright */}
      <Text
        style={{
          fontSize: '10px',
          color: '#9CA3AF',
          textAlign: 'center',
          margin: '0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        © {new Date().getFullYear()} Madhav Shringaar. All Rights Reserved. • www.madhavshringaar.com
      </Text>
    </Section>
  );
}
