"use client";

import "./globals.css";
import Link from "next/link";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <header>
          <Navbar className="fixed top-0 left-0 right-0 z-50 text-white pt-2 pb-1 shadow-lg w-full">
            <NavbarContent className="w-full !justify-evenly items-center">
              <NavbarItem isActive={pathname === "/"}>
                <Link href="/" className={`text-2xl self-center ${pathname === "/" ? "underline" : ""}`}>Profile</Link>
              </NavbarItem>
              <NavbarItem isActive={pathname === "/myportfolio"}>
                <Link href="/myportfolio" className={`text-2xl self-center ${pathname === "/myportfolio" ? "underline" : ""}`}>Portfolio</Link>
              </NavbarItem>
              <NavbarItem isActive={pathname === "/aboutme"}>
                <Link href="/aboutme" className={`text-2xl self-center ${pathname === "/aboutme" ? "underline" : ""}`}>About me</Link>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
