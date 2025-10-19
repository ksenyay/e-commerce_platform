"use client";

import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import useRequest from "../../hooks/sendRequest";
import { useRouter } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";
import { Search, ShoppingCart } from "lucide-react";

interface CurrentUser {
  email: string;
  id: string;
  iat: number;
}

const Nav = ({ currentUser }: { currentUser: CurrentUser | null }) => {
  const pathName = usePathname();
  const router = useRouter();

  const { makeRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
  });

  async function signout() {
    try {
      await makeRequest();
      router.refresh();
    } catch (error) {
      console.error("Signout failed:", error);
    }
  }

  return (
    <>
      <div className="hidden md:flex flex-col items-center justify-center gap-2 md:justify-start md:flex-row mt-2 mb-2">
        <Link
          href="/"
          className={clsx(
            "relative font-semibold text-[15px] px-4 py-1.5 rounded-2xl transition-colors duration-200",
            "hover:bg-primary/10 hover:text-primary",

            pathName === "/"
              ? "bg-primary/20 text-primary shadow-sm"
              : "text-foreground"
          )}
        >
          Shop
        </Link>

        <Link
          href="/about"
          className={clsx(
            "relative font-semibold text-[15px] px-4 py-1.5 rounded-2xl transition-colors duration-200",
            "hover:bg-primary/10 hover:text-primary",

            pathName === "/about"
              ? "bg-primary/20 text-primary shadow-sm"
              : "text-foreground"
          )}
        >
          About
        </Link>

        <div className="relative flex flex-row">
          <Input
            type="text"
            className="search-bar border-white/20"
            placeholder="Search sounds..."
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center gap-2 md:justify-start md:flex-row mt-2 mb-2">
        {currentUser !== null ? (
          <div className="flex flex-row gap-3 justify-center items-center">
            <div className=" cursor-pointer bg-white/5 hover:bg-white/10 p-2 rounded-2xl hover:scale-105 transition-all duration-200">
              <Link href="/cart" className="flex flex-row gap-2 items-center">
                <ShoppingCart className="w-4 h-4" />
                <p className="font-bold text-sm">Cart (0)</p>
              </Link>
            </div>
            <ProfileDropdown signout={signout} />
          </div>
        ) : (
          <>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="px-5 font-bold rounded-2xl border-white/20 hover:bg-white/10 transition-all duration-200"
              >
                Login
              </Button>
            </Link>

            <Link href="/auth/signup">
              <Button
                variant="default"
                className="rounded-2xl font-bold bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                Sign up
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Nav;
