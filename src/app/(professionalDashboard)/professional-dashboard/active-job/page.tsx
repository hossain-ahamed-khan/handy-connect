"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useGetActiveJobsQuery } from "@/redux/features/professional/activeJobs/activeJobsApi";
import {
  useJobCompleteMutation,
  useJobInProgressMutation,
  useJobOnTheWayMutation,
} from "@/redux/features/professional/jobProgress/jobProgressApi";

type AiCost = {
  min?: number | string;
  max?: number | string;
  currency?: string;
};

type ActiveJob = {
  id: number;
  customer_name?: string | null;
  address?: string | null;
  description?: string | null;
  status?: string | null;
  status_display?: string | null;
  ai_cost?: AiCost | null;
};

type ActiveJobsResponse = {
  active_and_completed?: ActiveJob[];
  new_leads?: ActiveJob[];
};

type JobProgressResponse = {
  id?: number;
  status?: string | null;
  status_display?: string | null;
};

type CompletionFiles = {
  billImage?: File | null;
  beforePhoto?: File | null;
  afterPhoto?: File | null;
};

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8L6.5 11.5L13 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ThumbsDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M10 2H11.5C12.33 2 13 2.67 13 3.5V8.5C13 9.33 12.33 10 11.5 10H10M6 10L7 14H8C8.55 14 9 13.55 9 13V10M6 10H3.5C2.67 10 2 9.33 2 8.5V3.5C2 2.67 2.67 2 3.5 2H9L10 2V10H6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1C5.79 1 4 2.79 4 5C4 8.25 8 14 8 14C8 14 12 8.25 12 5C12 2.79 10.21 1 8 1ZM8 6.5C7.17 6.5 6.5 5.83 6.5 5C6.5 4.17 7.17 3.5 8 3.5C8.83 3.5 9.5 4.17 9.5 5C9.5 5.83 8.83 6.5 8 6.5Z"
      fill="#9CA3AF"
    />
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CircleCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
    <path
      d="M7 12L10.5 15.5L17 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function JobDetailsCard() {
  const [priceRating, setPriceRating] = useState<"good" | "bad">("good");
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [jobOverrides, setJobOverrides] = useState<
    Record<number, Partial<ActiveJob>>
  >({});
  const [completionFiles, setCompletionFiles] = useState<
    Record<number, CompletionFiles>
  >({});
  const [completionErrors, setCompletionErrors] = useState<
    Record<number, string>
  >({});

  const [jobOnTheWay, { isLoading: isOnTheWayLoading }] =
    useJobOnTheWayMutation();
  const [jobInProgress, { isLoading: isInProgressLoading }] =
    useJobInProgressMutation();
  const [jobComplete, { isLoading: isCompleteLoading }] =
    useJobCompleteMutation();

  const { data, isLoading, isError } = useGetActiveJobsQuery(undefined) as {
    data?: ActiveJobsResponse;
    isLoading: boolean;
    isError: boolean;
  };
  const statusOrder = ["ACCEPTED", "ON_THE_WAY", "IN_PROGRESS", "COMPLETED"] as const;
  const activeAndCompleted = data?.active_and_completed ?? [];
  const newLeads = data?.new_leads ?? [];
  const allJobs = [
    ...activeAndCompleted.map((job) => ({ ...job, source: "active" as const })),
    ...newLeads.map((job) => ({ ...job, source: "lead" as const })),
  ].filter((job) => job.status !== "PENDING");

  const getStatusIndex = (status?: ActiveJob["status"]) => {
    if (!status) {
      return -1;
    }
    return statusOrder.indexOf(status as (typeof statusOrder)[number]);
  };

  const updateJobOverride = (jobId: number, update: Partial<ActiveJob>) => {
    setJobOverrides((prev) => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        ...update,
      },
    }));
  };

  const updateCompletionFile = (
    jobId: number,
    key: keyof CompletionFiles,
    file: File | null
  ) => {
    setCompletionFiles((prev) => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        [key]: file,
      },
    }));
  };

  const clearCompletionError = (jobId: number) => {
    setCompletionErrors((prev) => {
      if (!prev[jobId]) {
        return prev;
      }
      const { [jobId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleAdvanceStatus = async (
    jobId: number,
    nextStatus: "ON_THE_WAY" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    try {
      let response: JobProgressResponse | { message?: string; status?: string };

      if (nextStatus === "ON_THE_WAY") {
        response = await jobOnTheWay({ status: "ON_THE_WAY", jobId }).unwrap();
      } else if (nextStatus === "IN_PROGRESS") {
        response = await jobInProgress({ status: "IN_PROGRESS", jobId }).unwrap();
      } else {
        const files = completionFiles[jobId];
        if (!files?.billImage || !files?.beforePhoto || !files?.afterPhoto) {
          setCompletionErrors((prev) => ({
            ...prev,
            [jobId]: "Please add all completion files before finishing.",
          }));
          return;
        }

        const formData = new FormData();
        formData.append("bill_image", files.billImage);
        formData.append("before_photo", files.beforePhoto);
        formData.append("after_photo", files.afterPhoto);
        response = await jobComplete({ formData, jobId }).unwrap();
      }

      const newStatus = response?.status || nextStatus;
      const statusDisplay =
        "status_display" in response ? response.status_display : undefined;

      updateJobOverride(jobId, {
        status: newStatus,
        status_display: statusDisplay ?? jobOverrides[jobId]?.status_display,
      });
      clearCompletionError(jobId);

      const successMessage =
        nextStatus === "ON_THE_WAY"
          ? "Marked as on the way."
          : nextStatus === "IN_PROGRESS"
            ? "Job started successfully."
            : "Job completed successfully.";
      toast.success(successMessage);
    } catch (error) {
      const err = error as {
        status?: number;
        data?: unknown;
        error?: string;
        message?: string;
      };
      const errorMessage =
        err?.message || err?.error || "Failed to update job status.";
      toast.error(errorMessage);
      console.error("Failed to advance job status", {
        status: err?.status,
        data: err?.data,
        error: err?.error,
        message: err?.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Loading active job...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || allJobs.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">No active job found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-4/5 mx-auto flex flex-col gap-3">
        {allJobs.map((job) => {
          const mergedJob = { ...job, ...jobOverrides[job.id] };
          const currentStatusIndex = getStatusIndex(mergedJob.status);
          const steps = [
            { id: 1, label: "Accepted", active: currentStatusIndex >= 0 },
            { id: 2, label: "On The Way", active: currentStatusIndex >= 1 },
            { id: 3, label: "In Progress", active: currentStatusIndex >= 2 },
            { id: 4, label: "Completed", active: currentStatusIndex >= 3 },
          ];
          const priceMin = mergedJob.ai_cost?.min ?? "-";
          const priceMax = mergedJob.ai_cost?.max ?? "-";
          const priceCurrency = mergedJob.ai_cost?.currency ?? "";
          const priceLabel =
            priceMin !== "-" && priceMax !== "-"
              ? `${priceCurrency} ${priceMin} - ${priceCurrency} ${priceMax}`
              : "Price unavailable";
          const isExpanded = expandedJobId === job.id;
          const nextStatus =
            currentStatusIndex < 1
              ? "ON_THE_WAY"
              : currentStatusIndex < 2
                ? "IN_PROGRESS"
                : currentStatusIndex < 3
                  ? "COMPLETED"
                  : null;
          const actionLabel =
            nextStatus === "ON_THE_WAY"
              ? "I'm on The Way"
              : nextStatus === "IN_PROGRESS"
                ? "Start Job"
                : nextStatus === "COMPLETED"
                  ? "Complete Job"
                  : "Completed";
          const isActionLoading =
            isOnTheWayLoading || isInProgressLoading || isCompleteLoading;
          const files = completionFiles[job.id];
          const isCompletionReady =
            !!files?.billImage && !!files?.beforePhoto && !!files?.afterPhoto;
          const isActionDisabled =
            !nextStatus || isActionLoading ||
            (nextStatus === "COMPLETED" && !isCompletionReady);

          return (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        {mergedJob.customer_name || "Customer"}
                      </p>
                      <span className="text-[11px] text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
                        {mergedJob.source === "active" ? "Active" : "Lead"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPinIcon />
                      <span className="text-xs text-gray-400">
                        {mergedJob.address || "Address not provided"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </button>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-xl p-3 flex items-start justify-between mb-3 border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Detected Issue
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {mergedJob.description || "No issue description"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 border border-gray-300 rounded-md px-2 py-0.5 whitespace-nowrap ml-2 mt-0.5">
                      {mergedJob.status_display || "Pending"}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl px-4 py-3 inline-block mb-4 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Est. Price</p>
                    <p className="text-base font-bold text-amber-500">
                      {priceLabel}
                    </p>
                  </div>

                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Is this price fair?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPriceRating("good")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${priceRating === "good"
                        ? "bg-amber-400 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                      <CheckIcon />
                      Good estimation
                    </button>
                    <button
                      onClick={() => setPriceRating("bad")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${priceRating === "bad"
                        ? "bg-amber-400 text-white"
                        : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <ThumbsDownIcon />
                      Bad Estimation
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-4">
                      Progress
                    </p>
                    <div className="flex flex-col gap-4">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3 relative">
                          {index < steps.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 w-0.5 h-4 ${step.active ? "bg-green-500" : "bg-gray-200"
                                }`}
                              style={{ transform: "translateX(-50%)" }}
                            />
                          )}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${step.active
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            {step.id}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${step.active ? "text-gray-900" : "text-gray-400"
                                }`}
                            >
                              {step.label}
                            </p>
                            {step.active && (
                              <p className="text-xs text-green-500 flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                Active now
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 shadow-sm mt-4">
                    {nextStatus === "COMPLETED" && (
                      <div className="mb-4 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                          <p className="text-sm font-semibold text-gray-700">
                            Before/After Photos
                          </p>
                          <div className="mt-3 grid gap-4 sm:grid-cols-2">
                            <label className="text-xs text-gray-600">
                              Before
                              <div className="mt-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 flex items-center justify-center">
                                <input
                                  type="file"
                                  accept="*/*"
                                  className="w-full text-xs text-gray-500"
                                  onChange={(event) =>
                                    updateCompletionFile(
                                      job.id,
                                      "beforePhoto",
                                      event.target.files?.[0] ?? null
                                    )
                                  }
                                />
                              </div>
                              {files?.beforePhoto && (
                                <p className="mt-2 text-[11px] text-gray-500">
                                  Selected: {files.beforePhoto.name}
                                </p>
                              )}
                            </label>
                            <label className="text-xs text-gray-600">
                              After
                              <div className="mt-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 flex items-center justify-center">
                                <input
                                  type="file"
                                  accept="*/*"
                                  className="w-full text-xs text-gray-500"
                                  onChange={(event) =>
                                    updateCompletionFile(
                                      job.id,
                                      "afterPhoto",
                                      event.target.files?.[0] ?? null
                                    )
                                  }
                                />
                              </div>
                              {files?.afterPhoto && (
                                <p className="mt-2 text-[11px] text-gray-500">
                                  Selected: {files.afterPhoto.name}
                                </p>
                              )}
                            </label>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                          <p className="text-sm font-semibold text-gray-700">
                            Upload Bill
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Required for safety and insurance records
                          </p>
                          <label className="mt-3 block">
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                              <p className="text-xs text-gray-500">Tap to upload bill</p>
                              <input
                                type="file"
                                accept="*/*"
                                className="mt-3 w-full text-xs text-gray-500"
                                onChange={(event) =>
                                  updateCompletionFile(
                                    job.id,
                                    "billImage",
                                    event.target.files?.[0] ?? null
                                  )
                                }
                              />
                            </div>
                          </label>
                          {files?.billImage && (
                            <p className="mt-2 text-[11px] text-gray-500">
                              Selected: {files.billImage.name}
                            </p>
                          )}
                        </div>

                        {completionErrors[job.id] && (
                          <p className="text-xs text-red-500">
                            {completionErrors[job.id]}
                          </p>
                        )}
                      </div>
                    )}
                    <button
                      disabled={isActionDisabled}
                      onClick={() =>
                        nextStatus && handleAdvanceStatus(job.id, nextStatus)
                      }
                      className={`w-full font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm ${isActionDisabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-amber-400 hover:bg-amber-500 text-white"
                        }`}
                    >
                      <CircleCheckIcon />
                      {isActionLoading ? "Updating..." : actionLabel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
