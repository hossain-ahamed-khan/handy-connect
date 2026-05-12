"use client";

import { MdBolt, MdOutlinePalette, MdOutlineWaterDrop } from "react-icons/md";

import { useGetMyRequestListQuery } from "@/redux/features/customer/myRequestList/myRequestListApi";

const iconMap = {
  water_drop: MdOutlineWaterDrop,
  palette: MdOutlinePalette,
  bolt: MdBolt,
} as const;

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  DIAGNOSING: "Diagnosing",
  COMPLETE: "Complete",
};

const statusBadgeClasses: Record<string, string> = {
  PENDING: "bg-cyan-50 text-[#64748B] dark:bg-cyan-900/20",
  DIAGNOSING: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  COMPLETE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
};

export default function MyRequest() {
  const { data, isLoading, isError } = useGetMyRequestListQuery(undefined);

  return (
    <div>
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading requests...</div>
      ) : isError ? (
        <div className="text-sm text-red-500">Failed to load requests.</div>
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((request) => {
            const Icon = iconMap[request.service_icon as keyof typeof iconMap] ?? MdOutlineWaterDrop;
            const statusLabel = statusLabels[request.status] ?? request.status;
            const statusClass = statusBadgeClasses[request.status] ?? "bg-cyan-50 text-[#64748B] dark:bg-cyan-900/20";

            return (
              <div
                key={request.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Icon className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {request.service_name || "Service request"}
                    </h4>
                    <p className="text-xs text-blue-400 font-medium">
                      {request.display_text}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${statusClass}`}
                >
                  {statusLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
