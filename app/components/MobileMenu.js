"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".mobile-menu-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden fixed top-0 right-0 z-50 mobile-menu-container">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 hover:bg-gray-100 transition-colors rounded-lg m-2"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full right-0 w-64 bg-white shadow-lg rounded-lg border mt-2 mr-2"
          >
            <nav className="py-2">
              <div className="flex flex-col">
                <Link
                  href="/"
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 ${
                    pathname === "/"
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Home className="h-5 w-5" />
                  Нүүр
                </Link>
                <Link
                  href="/guide"
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 ${
                    pathname === "/guide"
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700"
                  }`}
                  onClick={handleLinkClick}
                >
                  <BookOpen className="h-5 w-5" />
                  Заавар
                </Link>
                <Link
                  href="/about"
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 ${
                    pathname === "/about"
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Info className="h-5 w-5" />
                  Тухай
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
