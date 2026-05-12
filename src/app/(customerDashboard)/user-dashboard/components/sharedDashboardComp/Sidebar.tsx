"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";
import {
  MdAccessTime,
  MdAttachMoney,
  MdCategory,
  MdChat,
  MdClose,
  MdDashboard,
  MdDescription,
  MdHistory,
  MdLocationCity,
  MdNotifications,
  MdPeople,
  MdPerson,
  MdSettings,
  MdSmartToy,
  MdStar,
  MdTimeline,
  MdVerifiedUser,
  MdWork,
} from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "sonner";
import main_logo from "../../../../../assets/main_logo.svg";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

type UserRole = "user" | "professional" | "admin";

const userNavigation = [
  {
    section: "Core",
    items: [
      { name: "Dashboard", icon: MdDashboard, href: "/user-dashboard" },
      {
        name: "My Requests",
        icon: MdDescription,
        href: "/user-dashboard/my-requests",
      },
      {
        name: "Professionals",
        icon: MdPeople,
        href: "/user-dashboard/professionals",
      },
      {
        name: "Notifications",
        icon: MdNotifications,
        href: "/user-dashboard/notifications",
      },
      { name: "Message", icon: MdPerson, href: "/user-dashboard/message" },
      { name: "Profile", icon: MdPerson, href: "/user-dashboard/profile" },
    ],
  },
];

const professionalNavigation = [
  {
    section: "Core",
    items: [
      { name: "Dashboard", icon: MdDashboard, href: "/professional-dashboard" },
      {
        name: "Job Requests",
        icon: MdWork,

        href: "/professional-dashboard/job-request",
      },
      {
        name: "Active Jobs",
        icon: MdAccessTime,

        href: "/professional-dashboard/active-job",
      },
      {
        name: "Earnings",
        icon: MdAttachMoney,

        href: "/professional-dashboard/earning",
      },
      {
        name: "Reviews",
        icon: MdStar,
        href: "/professional-dashboard/review",
      },
      {
        name: "Settings",
        icon: MdSettings,
        href: "/professional-dashboard/setting",
      },
    ],
  },
];

const adminNavigation = [
  {
    section: "Admin",
    items: [
      { name: "Dashboard", icon: MdDashboard, href: "/admin-dashboard" },
      {
        name: "Lead History",
        icon: MdHistory,
        href: "/admin-dashboard/lead-history",
      },
      {
        name: "Lead Monitor",
        icon: MdTimeline,
        href: "/admin-dashboard/lead-monitor",
      },
      {
        name: "Notifications",
        icon: MdNotifications,
        href: "/admin-dashboard/notifications",
      },
      {
        name: "Chat View",
        icon: MdChat,
        href: "/admin-dashboard/chat-view",
      },
      { name: "Users", icon: MdPeople, href: "/admin-dashboard/users" },
      {
        name: "Verification",
        icon: MdVerifiedUser,
        href: "/admin-dashboard/verification",
      },
      { name: "Jobs", icon: MdWork, href: "/admin-dashboard/jobs" },
      {
        name: "Categories",
        icon: MdCategory,
        href: "/admin-dashboard/categories",
      },
      {
        name: "Financial",
        icon: MdAttachMoney,
        href: "/admin-dashboard/financial",
      },
      {
        name: "AI Control",
        icon: MdSmartToy,
        href: "/admin-dashboard/ai-control",
      },
      {
        name: "City Management",
        icon: MdLocationCity,
        href: "/admin-dashboard/city-management",
      },
    ],
  },
];

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  role: UserRole;
}

export default function Sidebar({ isOpen, toggleSidebar, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const navigation: NavSection[] =
    role === "professional"
      ? professionalNavigation
      : role === "admin"
        ? adminNavigation
        : userNavigation;

  // useEffect(() => {
  //   if (isOpen) {
  //     toggleSidebar();
  //   }
  // }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        toast.success("Logout successful!");
        router.push("/login");
      }
    });
  };

  return (
    <>
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-30
          w-64 bg-white text-black
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo & Close Button */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <Link href="/" className="flex flex-col flex-1">
            <Image
              width={1000}
              height={1000}
              src={main_logo}
              alt="profile_image"
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar min-h-0">
          {navigation?.map((section) => (
            <div key={section.section} className="mb-6">
              {navigation.length > 1 && (
                <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${isActive
                          ? "bg-primary/10 border-l-4 border-primary text-primary"
                          : "text-black hover:bg-primary/20 hover:text-primary"
                          }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium truncate flex-1">
                          {item.name}
                        </span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto min-w-5 h-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold px-1">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-500 cursor-pointer hover:text-red-700"
          >
            <IoIosLogOut size={24} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
