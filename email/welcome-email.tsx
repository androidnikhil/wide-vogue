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
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const displayName = name && name !== 'NO_NAME' ? name : 'Beloved Devotee';

  return (
    <Html>
      <Head />
      <Preview>Welcome to Madhav Shringaar - Discover Divine Essentials</Preview>
      <Tailwind>
        <Body className="bg-[#fcfaf7] font-sans py-8">
          <Container className="bg-white border border-[#e8dfd8] rounded-2xl max-w-[560px] mx-auto p-8 shadow-sm">
            {/* Header */}
            <Section className="text-center mb-6">
              <Heading className="text-2xl font-bold text-[#1b3b22] m-0">
                Madhav Shringaar
              </Heading>
              <Text className="text-xs text-[#a07855] tracking-widest uppercase mt-1">
                Divine Essentials For Your Beloved Kanha
              </Text>
            </Section>

            <Hr className="border-[#f0eae1] my-4" />

            {/* Content */}
            <Section className="my-6">
              <Text className="text-lg font-semibold text-[#2c2b29] mb-3">
                Radhe Radhe, {displayName}! 🙏
              </Text>
              <Text className="text-sm text-[#5a5752] leading-relaxed mb-4">
                Thank you for joining the <strong>Madhav Shringaar</strong> family. We are blessed to have you with us on this sacred journey of devotion.
              </Text>
              <Text className="text-sm text-[#5a5752] leading-relaxed mb-6">
                Explore our handpicked collection of Laddu Gopal dresses, shringaar jewellery, mukuts, bansuris, and authentic temple accessories crafted with utmost love and reverence.
              </Text>

              {/* Benefits Box */}
              <Section className="bg-[#fdf8f3] border border-[#f3e6d8] rounded-xl p-4 mb-6">
                <Text className="text-sm font-semibold text-[#8b5a2b] m-0 mb-2">
                  ✨ Member Privileges:
                </Text>
                <Text className="text-xs text-[#6b625b] m-0 mb-1">
                  • <strong>Bhakti Points:</strong> Earn points on every order to redeem for future divine items.
                </Text>
                <Text className="text-xs text-[#6b625b] m-0 mb-1">
                  • <strong>Fast Express Shipping:</strong> Dedicated tracking with Shiprocket straight to your doorstep.
                </Text>
                <Text className="text-xs text-[#6b625b] m-0">
                  • <strong>Handcrafted Quality:</strong> Sanctified items made with pure devotion.
                </Text>
              </Section>

              {/* Call to Action */}
              <Section className="text-center my-6">
                <Button
                  className="bg-[#1b3b22] text-white px-6 py-3 rounded-xl font-medium text-sm no-underline inline-block shadow"
                  href="https://www.madhavshringaar.com"
                >
                  Explore Collection
                </Button>
              </Section>
            </Section>

            <Hr className="border-[#f0eae1] my-4" />

            {/* Footer */}
            <Section className="text-center mt-4">
              <Text className="text-xs text-[#8c8881] m-0 mb-1">
                Need assistance? We are always here for you.
              </Text>
              <Text className="text-xs text-[#8c8881] m-0 mb-2">
                Email us at <a href="mailto:info@madhavshringaar.com" className="text-[#8b5a2b] underline">info@madhavshringaar.com</a>
              </Text>
              <Text className="text-[11px] text-[#aba69f] m-0">
                © {new Date().getFullYear()} Madhav Shringaar. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
