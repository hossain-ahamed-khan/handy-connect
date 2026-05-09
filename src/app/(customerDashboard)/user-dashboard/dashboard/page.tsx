// app/(customerDashboard)/user-dashboard/page.tsx
"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { LuHammer, LuPaintbrush } from "react-icons/lu";
import { selectUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import {
  MdOutlineCleaningServices,
  MdOutlineElectricalServices,
  MdOutlineHandyman,
  MdOutlineWaterDrop,
  MdSearch,
} from "react-icons/md";

type Category = {
  id: string;
  name: string;
  icon: IconType;
};

type RecentRequest = {
  id: number;
  title: string;
  date: string;
  status: string;
};

const categories: Category[] = [
  { id: "plumbing", name: "Plumbing", icon: MdOutlineWaterDrop },
  { id: "carpentry", name: "Carpentry", icon: LuHammer },
  { id: "painting", name: "Painting", icon: LuPaintbrush },
  { id: "electrical", name: "Electrical", icon: MdOutlineElectricalServices },
  { id: "cleaning", name: "Cleaning", icon: MdOutlineCleaningServices },
  { id: "general", name: "General", icon: MdOutlineHandyman },
];

const recentRequests: RecentRequest[] = [
  { id: 1, title: "Kitchen Sink Leak", date: "Oct 24", status: "Complete" },
  { id: 2, title: "Kitchen Sink Leak", date: "Oct 24", status: "Complete" },
];

export default function UserDashboard() {

  const user = useAppSelector(selectUser);

  return (
    <div className="bg-[#F8FAFC] dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Hello, {user?.full_name || user?.email} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            What service do you need today?
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Recent Requests
          </h3>
          <Link
            href="/user-dashboard/my-requests"
            className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            See All
          </Link>
        </div>

        <div className="space-y-3">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MdOutlineWaterDrop className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {request.title}
                  </h4>
                  <p className="text-xs text-blue-400 font-medium">
                    {request.date} · {request.status}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-[#64748B] text-[10px] font-bold rounded-lg uppercase tracking-wider">
                In Process
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">
          Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/user-dashboard/dashboard/${category.id}`}
              className="group flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
            >
              <div className="w-14 h-14 bg-[#F1F5F9] dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                <category.icon className="text-gray-600 dark:text-gray-300 text-2xl group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
