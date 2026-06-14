import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default:  "Greenfield High School",
    template: "%s | Greenfield High School",
  },
  description:
    "Greenfield High School — Excellence in Learning, Character in Life. A leading institution providing quality secondary education.",
  keywords: ["high school", "secondary education", "Greenfield", "admissions", "academics"],
  openGraph: {
    type:    "website",
    locale:  "en_KE",
    siteName: "Greenfield High School",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
