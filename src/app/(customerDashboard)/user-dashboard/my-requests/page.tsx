"use client";

import { useState } from "react";
import { MdBolt, MdClose, MdMessage, MdOutlinePalette, MdOutlineWaterDrop } from "react-icons/md";

import { useGetMyRequestListQuery } from "@/redux/features/customer/myRequestList/myRequestListApi";
import { useGetServiceStatusQuery } from "@/redux/features/customer/serviceStatus/serviceStatusApi";
import Message from "@/app/(customerDashboard)/user-dashboard/message/page";

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

type ServiceStatusResponse = {
  id: number;
  status?: string | null;
  status_display?: string | null;
  service_name?: string | null;
  service_icon?: string | null;
  provider_name?: string | null;
  provider_photo?: string | null;
  address?: string | null;
  timeline?: {
    request_received?: string | null;
    on_the_way?: string | null;
    in_progress?: string | null;
    completed?: string | null;
  };
};

export default function MyRequest() {
  const { data, isLoading, isError } = useGetMyRequestListQuery(undefined);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageContext, setMessageContext] = useState<{
    name?: string | null;
    role?: string | null;
  } | null>(null);
  const { data: serviceStatusData, isFetching: isStatusLoading } =
    useGetServiceStatusQuery(expandedRequestId ?? 0, {
      skip: expandedRequestId === null,
    });

  const statusOrder = ["PENDING", "DIAGNOSING", "COMPLETE"] as const;

  const getStatusIndex = (status?: string) => {
    if (!status) {
      return -1;
    }
    return statusOrder.indexOf(status as (typeof statusOrder)[number]);
  };

  const formatTime = (timestamp?: string | null) => {
    if (!timestamp) {
      return null;
    }
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp?: string | null) => {
    if (!timestamp) {
      return null;
    }
    return new Date(timestamp).toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
            const isExpanded = expandedRequestId === request.id;
            const currentStatusIndex = getStatusIndex(request.status);
            const statusData = isExpanded && serviceStatusData?.id === request.id
              ? (serviceStatusData as ServiceStatusResponse)
              : undefined;
            const timeline = statusData?.timeline;
            const timelineSteps = [
              {
                id: 1,
                key: "request_received",
                label: "Request Received",
                time: timeline?.request_received,
              },
              {
                id: 2,
                key: "on_the_way",
                label: "On The Way",
                time: timeline?.on_the_way,
              },
              {
                id: 3,
                key: "in_progress",
                label: "In Progress",
                time: timeline?.in_progress,
              },
              {
                id: 4,
                key: "completed",
                label: "Completed",
                time: timeline?.completed,
              },
            ];
            const lastActiveIndex = timelineSteps.reduce((acc, step, index) => {
              if (step.time) {
                return index;
              }
              return acc;
            }, -1);
            const steps = timeline ? timelineSteps : [
              { id: 1, label: "Request Received", active: currentStatusIndex >= 0 },
              { id: 2, label: "Diagnosing", active: currentStatusIndex >= 1 },
              { id: 3, label: "Completed", active: currentStatusIndex >= 2 },
            ];

            return (
              <div key={request.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between">
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                    <button
                      onClick={() => setExpandedRequestId(isExpanded ? null : request.id)}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                    >
                      {isExpanded ? "Collapse" : "Expand"}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-xs text-slate-500 dark:text-slate-200">
                      <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full">
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-200">Map View</span>
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-100/80 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                          {statusData?.status_display || statusLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {statusData?.provider_name || "Assigned professional"}
                          </p>
                          {/* <p className="text-xs text-slate-500 dark:text-slate-300">
                            {request.professional_rating ? `${request.professional_rating} rating` : "Rating pending"}
                          </p> */}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setMessageContext({
                            name: statusData?.provider_name || "Assigned professional",
                            role: statusData?.service_name || request.service_name || "Professional",
                          });
                          setIsMessageOpen(true);
                        }}
                        className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center"
                      >
                        <MdMessage className="text-base" />
                      </button>
                    </div>

                    <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Status Timeline</p>
                      {isStatusLoading && !statusData ? (
                        <p className="text-xs text-slate-500">Loading status timeline...</p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {steps.map((step, index) => {
                            const isTimelineStep = "time" in step;
                            const isActive = isTimelineStep ? Boolean(step.time) : step.active;
                            const timeLabel = isTimelineStep ? formatTime(step.time) : null;
                            const dateLabel = isTimelineStep ? formatDate(step.time) : null;
                            const showActiveNow = isTimelineStep
                              ? index === lastActiveIndex && isActive
                              : isActive;

                            return (
                              <div key={step.id} className="flex items-center gap-3 relative">
                                {index < steps.length - 1 && (
                                  <div
                                    className={`absolute left-4 top-8 w-0.5 h-4 ${isActive ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
                                    style={{ transform: "translateX(-50%)" }}
                                  />
                                )}
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${isActive
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400"}`}
                                >
                                  {step.id}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`text-sm font-medium ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                                  >
                                    {step.label}
                                  </p>
                                  {showActiveNow && (
                                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                      Active now
                                    </p>
                                  )}
                                </div>
                                {timeLabel && (
                                  <span className="text-sm text-slate-400 dark:text-slate-300">
                                    {dateLabel ? `${dateLabel} · ${timeLabel}` : timeLabel}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button className="w-full rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {isMessageOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            onClick={() => setIsMessageOpen(false)}
            className="absolute inset-0 bg-black/40 z-0"
            aria-label="Close message view"
          />
          <div className="relative z-10 ml-auto h-full w-full max-w-3xl bg-white dark:bg-gray-900 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsMessageOpen(false)}
              className="absolute right-4 top-4 z-10 h-9 w-9 rounded-full bg-white/90 text-gray-600 shadow flex items-center justify-center hover:bg-white"
              aria-label="Close message view"
            >
              <MdClose className="text-lg" />
            </button>
            <div className="h-full overflow-hidden">
              <Message
                participantName={messageContext?.name}
                participantRole={messageContext?.role}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
