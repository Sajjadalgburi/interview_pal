import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { getCurrentUser, logout } from "@/lib/actions/auth.action";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="top-3 z-50 block w-full px-4 sm:fixed">
      <nav className="bg-primary-foreground mx-auto flex max-w-6xl items-center justify-between rounded-xl px-4 py-3 shadow-lg sm:px-6 sm:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Interview Pal Logo"
            width={38}
            height={32}
            className="h-8 w-auto"
          />
          <span className="text-primary hidden text-lg font-semibold sm:inline-block">
            Interview Pal
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Button onClick={logout} variant="default">
              Logout
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex"
              >
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
