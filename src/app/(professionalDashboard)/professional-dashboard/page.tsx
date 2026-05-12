"use client";
import { useState } from "react";
import { useGetProfessionalHomePageDataQuery } from "@/redux/features/professional/homePage/homePage";
import Image from "next/image";

type ActiveJob = {
  id: number;
  customer_name?: string | null;
  address?: string | null;
  status_display?: string | null;
};

const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const formatRating = (value?: number) => {
  if (typeof value !== "number") {
    return "0.0";
  }

  return value.toFixed(1);
};

const getInitials = (name?: string) => {
  if (!name) {
    return "--";
  }

  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return `${first}${last}`.toUpperCase();
};

const formatPriceRange = (cost?: { min?: number; max?: number; currency?: string }) => {
  if (!cost || (cost.min == null && cost.max == null)) {
    return "Quote needed";
  }

  const symbol = cost.currency === "EUR" ? "€" : cost.currency ? `${cost.currency} ` : "";
  const min = cost.min != null ? Math.round(cost.min) : null;
  const max = cost.max != null ? Math.round(cost.max) : null;

  if (min != null && max != null) {
    return `${symbol}${min} - ${symbol}${max}`;
  }

  const value = min ?? max ?? 0;
  return `${symbol}${value}`;
};

export default function ProfessionalDashboard() {
  const [jobDeclined, setJobDeclined] = useState(false);
  const [jobAccepted, setJobAccepted] = useState(false);
  const { data, isLoading } = useGetProfessionalHomePageDataQuery(undefined);

  const profile = data?.profile;
  const stats = data?.stats;
  const activeJobs = data?.active_jobs ?? [];
  const emergencyRequests = data?.emergency_requests ?? [];
  const newRequests = data?.new_requests ?? [];
  const requestsToShow = emergencyRequests.length ? emergencyRequests : newRequests;
  const requestCount = requestsToShow.length;
  const currentRequest = requestsToShow[0];
  const isOnline = Boolean(data?.is_online && profile?.is_available);
  const displayName = profile?.full_name ?? "Professional";
  const avatarInitials = getInitials(displayName);
  const ratingValue = typeof stats?.rating === "number" ? stats.rating : profile?.rating;

  return (
    <>
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden">
              {profile?.photo ? (
                <Image
                  src={profile.photo}
                  alt={displayName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                avatarInitials
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome, {displayName}
                </h1>
                {profile?.is_verified ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 border border-green-200 bg-green-50 rounded-full px-2 py-0.5">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-gray-500">
                {profile?.email ?? ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm">
            <span
              className={`w-2 h-2 rounded-full inline-block ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
            ></span>
            {isOnline ? "Online & Accepting Jobs" : "Offline"}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.active_jobs_count ?? activeJobs.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Total jobs: {profile?.jobs_count ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {formatRating(ratingValue)}
              </p>
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Certificates: {profile?.certificates ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Emergency Requests</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.emergency_count ?? profile?.emergency_count ?? 0}
            </p>
            <p className="text-xs text-green-500 mt-1">
              {emergencyRequests.length ? "Priority queue" : "All caught up"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="col-span-2 space-y-4">
            {/* Active Jobs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">Active Jobs</h2>
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-white text-xs flex items-center justify-center font-semibold">
                  {activeJobs.length}
                </span>
              </div>
              {activeJobs.length === 0 ? (
                <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-400">
                  {isLoading ? "Loading active jobs..." : "No active jobs yet."}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeJobs.map((job: ActiveJob) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {job.customer_name ?? "Customer"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {job.address ?? "Address pending"}
                        </p>
                        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                          {job.status_display ?? "Active"}
                        </span>
                      </div>
                      <button className="text-gray-300 hover:text-gray-500 mt-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New Job Requests */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">
                  New Job Requests
                </h2>
                <span className="text-xs bg-blue-500 text-white rounded-full px-3 py-1">
                  {requestCount} New
                </span>
              </div>

              {requestCount === 0 ? (
                <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-400">
                  {isLoading ? "Loading requests..." : "No new requests right now."}
                </div>
              ) : !jobDeclined && !jobAccepted && currentRequest ? (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          {currentRequest.description || "Service request"}
                        </span>
                        {(emergencyRequests.length > 0 || currentRequest.mark_as_priority) && (
                          <span className="text-xs bg-red-100 text-red-500 rounded-full px-2 py-0.5">
                            Emergency
                          </span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-500 rounded-full px-2 py-0.5">
                          {currentRequest.service_details?.name_en || "Service"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {currentRequest.customer_name ?? "Customer"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-500">
                        {formatPriceRange(currentRequest.ai_cost)}
                      </p>
                      <p className="text-xs text-gray-400">Estimated</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 text-sm text-gray-600 italic">
                    {currentRequest.description || "No additional details."}
                  </div>

                  <div className="flex items-center gap-5 text-sm text-gray-500 mb-5">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                      {currentRequest.address || "Address pending"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {currentRequest.formatted_date || "New"}
                    </span>
                    {currentRequest.no_call_just_chat ? (
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 9.75h.008v.008h-.008V9.75zM12 9.75h.008v.008H12V9.75zM15.375 9.75h.008v.008h-.008V9.75z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12c0 4.418-4.03 8-9 8a9.956 9.956 0 01-3.576-.655L3 20l1.6-3.2A7.958 7.958 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Chat only
                      </span>
                    ) : null}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setJobAccepted(true)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      Accept Job
                    </button>
                    <button
                      onClick={() => setJobDeclined(true)}
                      className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Decline
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-center h-24 text-sm text-gray-400">
                  {jobAccepted ? "✅ Job accepted!" : "❌ Job declined."}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Recent Reviews */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Recent Reviews</h2>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-400">
                Reviews will appear here once customers leave feedback.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
