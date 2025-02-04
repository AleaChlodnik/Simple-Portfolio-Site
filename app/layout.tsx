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
              <NavbarItem isActive={pathname === "/"} className="">
                <Link href="/" className={`text-2xl self-center ${pathname === "/" ? "underline" : ""}`}>Home</Link>
              </NavbarItem>
              <NavbarItem isActive={pathname === "/myportfolio"} className="">
                <Link href="/myportfolio" className={`text-2xl self-center ${pathname === "/myportfolio" ? "underline" : ""}`}>My Portfolio</Link>
              </NavbarItem>
              <NavbarItem isActive={pathname === "/docs"} className="">
                <Link href="/docs" className={`text-2xl self-center ${pathname === "/docs" ? "underline" : ""}`}>Docs</Link>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
