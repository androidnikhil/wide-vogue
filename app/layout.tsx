import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const barlow = Barlow({
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: {
    template: `%s | Wide Vogue`,
    default: APP_NAME
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${barlow.className}`}>
        <ThemeProvider
        attribute='class'
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        >
        {children}
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
