import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in · mu8ic",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
