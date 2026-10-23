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
  Img,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import { BRAND_COLORS, EmailContactFooter } from './email-components';

interface EmailOtpProps {
  otp: string;
  email: string;
}

export default function EmailOtpTemplate({ otp = '123456', email = '' }: EmailOtpProps) {
  const cleanOtp = (otp || '123456').toString().replace(/\s+/g, '');

  return (
    <Html>
      <Head />
      <Preview>Your Madhav Shringaar Verification Code: {cleanOtp}</Preview>
      <Tailwind>
        <Body
          style={{
            backgroundColor: BRAND_COLORS.cream,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            margin: 0,
            padding: '24px 0',
          }}
        >
          <Container
            style={{
              backgroundColor: BRAND_COLORS.white,
              border: `1px solid ${BRAND_COLORS.border}`,
              borderRadius: '16px',
              maxWidth: '560px',
              margin: '0 auto',
              padding: '32px 24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            {/* Logo Header */}
            <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', margin: '0 auto 8px auto' }}>
                <Img
                  src="cid:madhav_logo"
                  alt="Madhav Shringaar"
                  width="180"
                  height="60"
                  style={{
                    margin: '0 auto',
                    display: 'block',
                    height: '52px',
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <Text
                style={{
                  color: BRAND_COLORS.secondary,
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  margin: '4px 0 0 0',
                }}
              >
                Account Security &amp; Verification
              </Text>
              <Hr style={{ borderColor: BRAND_COLORS.borderLight, margin: '16px 0 0 0', borderWidth: '1px' }} />
            </Section>

            {/* Verification Content */}
            <Section style={{ margin: '16px 0 20px 0', textAlign: 'center' }}>
              <Heading
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: BRAND_COLORS.primary,
                  margin: '0 0 8px 0',
                }}
              >
                Verify Your Email Address
              </Heading>
              <Text
                style={{
                  fontSize: '13px',
                  color: BRAND_COLORS.textMuted,
                  lineHeight: '1.6',
                  margin: '0 auto 18px auto',
                  maxWidth: '460px',
                }}
              >
                Thank you for joining <strong>Madhav Shringaar</strong>. Please enter the 6-digit One-Time Password (OTP) below to verify your email address{' '}
                {email ? <strong style={{ color: BRAND_COLORS.textDark, wordBreak: 'break-all' }}>({email})</strong> : ''}.
              </Text>

              {/* OTP Display Card - Guaranteed 1-Line Container */}
              <div
                style={{
                  backgroundColor: BRAND_COLORS.primary,
                  borderRadius: '12px',
                  padding: '20px 24px',
                  margin: '20px auto',
                  maxWidth: '340px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 48, 32, 0.15)',
                }}
              >
                <Text
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: BRAND_COLORS.goldLight,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    margin: '0 0 8px 0',
                  }}
                >
                  Your Verification Code
                </Text>
                <table role="presentation" border={0} cellPadding={0} cellSpacing={0} style={{ margin: '0 auto', textAlign: 'center' }}>
                  <tr>
                    <td
                      align="center"
                      style={{
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: '30px',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        letterSpacing: '6px',
                        lineHeight: '1.2',
                        whiteSpace: 'nowrap',
                        wordBreak: 'keep-all',
                        padding: '4px 12px',
                        textAlign: 'center',
                      }}
                    >
                      {cleanOtp}
                    </td>
                  </tr>
                </table>
                <Text
                  style={{
                    fontSize: '10.5px',
                    color: BRAND_COLORS.goldLight,
                    margin: '8px 0 0 0',
                  }}
                >
                  Valid for 5 minutes only
                </Text>
              </div>

              {/* Security Advisory */}
              <div
                style={{
                  backgroundColor: BRAND_COLORS.cream,
                  border: `1px solid ${BRAND_COLORS.borderLight}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  margin: '20px auto 0 auto',
                  maxWidth: '460px',
                  textAlign: 'left',
                }}
              >
                <Text
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: BRAND_COLORS.secondary,
                    margin: '0 0 4px 0',
                  }}
                >
                  🔒 Security Guidelines:
                </Text>
                <Text
                  style={{
                    fontSize: '11px',
                    color: BRAND_COLORS.textMuted,
                    lineHeight: '1.5',
                    margin: 0,
                  }}
                >
                  • Never share this OTP with anyone, including representatives of Madhav Shringaar.<br />
                  • If you did not request this verification, you can safely ignore this email.
                </Text>
              </div>
            </Section>

            <EmailContactFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
