"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Dropdown } from "antd";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import default_img from "../../assets/user_img_default.png";
// import ThemeToggle from "./ThemeToggle";

import main_logo from "../../assets/main_logo.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();

  const user = false; // Not logged in

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDrawer = () => setIsOpen(!isOpen);

  // Drawer colors based on theme
  const isDark = mounted && theme === "dark";
  const drawerBg = isDark ? "#0f172a" : "#ffffff";
  const drawerText = isDark ? "#f1f5f9" : "#000000";
  const drawerBorder = isDark ? "#374151" : "#e5e7eb";

  // Profile menu items for Ant Design v5
  const profileMenuItems = [
    {
      key: "1",
      label: (
        <Link className="font-bold text-primary" href="/user-dashboard">
          User Dashboard
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link className="font-bold text-primary" href="/professional-dashboard">
          Professional Dashboard
        </Link>
      ),
    },
    // {
    //   key: "3",
    //   label: (
    //     <div className="font-bold text-red-600" onClick={handleLogout}>
    //       Logout
    //     </div>
    //   ),
    // },
  ];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/city-services", label: "City Services" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About Us" },
    { href: "/for-professionals", label: "For Professionals" },
  ];

  const isActiveRoute = (href: string) =>
    (href === "/" && pathname === "/") || (href !== "/" && pathname === href);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        {/* Left - Logo */}
        <Link href="/" className="flex flex-col">
          <Image
            width={1000}
            height={1000}
            src={main_logo}
            alt="main_logo"
            className="w-40 md:w-60 h-auto"
          />
        </Link>

        {/* Center - Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-primary ${isActiveRoute(item.href) ? "text-primary" : "text-slate-700"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right - Theme Toggle & Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* <ThemeToggle /> */}

          {user ? (
            // When user is logged in - show profile dropdown
            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="flex justify-start items-center gap-2 cursor-pointer">
                <Image
                  width={1000}
                  height={1000}
                  className="w-12 h-12 rounded-full border-4 border-primary"
                  src={default_img}
                  alt="profile_image"
                />
                <TiArrowSortedDown />
              </div>
            </Dropdown>
          ) : (
            // When user is NOT logged in - show Login button
            <>
              <Link href="/login">
                <button className="px-6 py-1.5 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer">
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile - Theme Toggle & Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {/* <ThemeToggle /> */}
          <button onClick={toggleDrawer}>
            <MenuOutlined className="text-2xl text-gray-900 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        open={isOpen}
        onClose={toggleDrawer}
        closable={false}
        styles={{
          wrapper: { width: "70%", height: "100%" },
          body: {
            padding: 0,
            backgroundColor: drawerBg,
            color: drawerText,
          },
          header: {
            padding: 0,
            backgroundColor: drawerBg,
            borderBottom: `1px solid ${drawerBorder}`,
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          },
        }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{
            backgroundColor: drawerBg,
            borderBottomColor: drawerBorder,
          }}
        >
          <Link href="/" onClick={toggleDrawer} className="flex flex-col">
            <Image
              width={1000}
              height={1000}
              src={main_logo}
              alt="main_logo"
              className="w-32 h-auto"
            />
          </Link>
          <button
            onClick={toggleDrawer}
            className="text-primary hover:opacity-70 focus:outline-none w-8 h-8 flex items-center justify-center transition-opacity"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div
          className="flex flex-col p-4 space-y-2 h-full"
          style={{ backgroundColor: drawerBg }}
        >
          {/* Drawer Links */}
          <div className="flex flex-col gap-4 mt-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleDrawer}
                className={`font-semibold text-base hover:text-primary transition-colors ${isActiveRoute(item.href) ? "text-primary" : ""
                  }`}
                style={{ color: isDark ? "#f1f5f9" : "#111827" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Drawer Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            {user ? (
              // When user is logged in - show profile dropdown (same as desktop)
              <Dropdown
                menu={{ items: profileMenuItems }}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <div className="flex items-center gap-2 cursor-pointer w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <Image
                    width={1000}
                    height={1000}
                    className="w-10 h-10 rounded-full border-2 border-primary"
                    src={default_img}
                    alt="profile_image"
                  />
                  <span
                    className="font-semibold"
                    style={{ color: isDark ? "#f1f5f9" : "#111827" }}
                  >
                    My Account
                  </span>
                  <TiArrowSortedDown
                    style={{ color: isDark ? "#f1f5f9" : "#111827" }}
                  />
                </div>
              </Dropdown>
            ) : (
              // When user is NOT logged in - show Login button
              <>
                <Link href="/login">
                  <button className="px-6 py-1.5 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer">
                    Log in
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  );
}
