import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/landing/navbar";
import ConditionalFooter from "@/components/layout/conditional-footer";

export const metadata: Metadata = {
  title: "CreateCrew — Build Your Content Squad",
  description:
    "The Gen-Z creator-first freelance marketplace. Find video editors, thumbnail designers, scriptwriters, and more for your content team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}


