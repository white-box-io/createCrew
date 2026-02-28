"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/landing/footer";

const HIDE_FOOTER_PATHS = ["/onboarding", "/signup", "/signin"];

export default function ConditionalFooter() {
  const pathname = usePathname();
  const hide = HIDE_FOOTER_PATHS.some((p) => pathname.startsWith(p));
  if (hide) return null;
  return <Footer />;
}
