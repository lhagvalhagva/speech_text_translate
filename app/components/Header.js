"use client";

import React, { useState } from "react";
import {
  Mic,
  LogOut,
  LogIn,
  Home,
  BookOpen,
  Info,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const pathname = usePathname();
  const { user, signOut, signIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center space-x-2">
          <Mic className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Speech to Text
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive("/")
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-600"
            }`}
          >
            <Home className="h-4 w-4" />
            Нүүр
          </Link>
          <Link
            href="/guide"
            className={`text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive("/guide")
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-600"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Заавар
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive("/about")
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-600"
            }`}
          >
            <Info className="h-4 w-4" />
            Тухай
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button
                onClick={signOut}
                variant="outline"
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Гарах
              </Button>
            </div>
          ) : (
            <Button
              onClick={signIn}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              Нэвтрэх
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-white"
          >
            <div className="container mx-auto px-4 py-3 space-y-3">
              <Link
                href="/"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/")
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                Нүүр
              </Link>
              <Link
                href="/guide"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/guide")
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                Заавар
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/about")
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="h-5 w-5" />
                Тухай
              </Link>

              {/* Mobile Auth */}
              <div className="pt-2 border-t">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-3 text-sm text-gray-600">
                      {user.email}
                    </div>
                    <Button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Гарах
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      signIn();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    <LogIn className="w-4 h-4" />
                    Нэвтрэх
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
