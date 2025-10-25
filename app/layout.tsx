import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavHeader } from "@/components/nav-header";
import { NavigationLoading } from "@/components/navigation-loading";
import { getCurrentUserAndRole } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Blog",
  description: "A personal blog with fixes, thoughts, and general posts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role } = await getCurrentUserAndRole();
  const isOwner = role === "owner";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <NavigationLoading />
          <NavHeader showAdminButton={isOwner} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}