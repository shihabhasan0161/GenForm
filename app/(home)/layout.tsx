"use client";

import { DarkMode } from "@/components/DarkMode";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { use, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <div className="border-b">
        {/* Navbar */}
        <nav className="flex items-center justify-between max-w-7xl mx-auto py-2 px-4">
          <Logo />
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link href={"/dashboard/analytics"}>
              <Button variant={"link"}>Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/sign-in" />
            <DarkMode />
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <Link
              href={"/dashboard/analytics"}
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="px-4 py-2">
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
            <div className="px-4 py-2">
              <DarkMode />
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default layout;