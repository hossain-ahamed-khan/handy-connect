"use client";

const stats = [
  {
    label: "Total Users",
    value: "12,458",
    delta: "+12%",
    deltaLabel: "this month",
    tone: "text-emerald-600",
    badge: "bg-blue-50 text-blue-600",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.5v-1.25a3.25 3.25 0 00-3.25-3.25h-1.5A3.25 3.25 0 007 18.25v1.25"
        />
        <circle cx="11" cy="8" r="3" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11.5a2.5 2.5 0 11-5 0"
        />
      </svg>
    ),
  },
  {
    label: "Active Jobs",
    value: "234",
    delta: "+8%",
    deltaLabel: "this month",
    tone: "text-emerald-600",
    badge: "bg-amber-50 text-amber-600",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h7.5M8.25 10.5h7.5M8.25 14.25h3.75"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 4.5h9a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18V6A1.5 1.5 0 016 4.5z"
        />
      </svg>
    ),
  },
  {
    label: "Total Revenue",
    value: "₪1.2M",
    delta: "+23%",
    deltaLabel: "this month",
    tone: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.75v16.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 7.5c0-1.657-2.015-3-4.5-3s-4.5 1.343-4.5 3 2.015 3 4.5 3 4.5 1.343 4.5 3-2.015 3-4.5 3-4.5-1.343-4.5-3"
        />
      </svg>
    ),
  },
  {
    label: "Success Rate",
    value: "94.2%",
    delta: "+2%",
    deltaLabel: "this month",
    tone: "text-emerald-600",
    badge: "bg-fuchsia-50 text-fuchsia-600",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 16.5l4-4 3 3 5-6"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 7.5h-3.5"
        />
      </svg>
    ),
  },
];

const activities = [
  {
    title: "New professional verification request",
    name: "David Cohen",
    time: "5 min ago",
    badge: "bg-blue-50 text-blue-600",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5l6.5 2.5v5.25c0 4.5-3.5 6.75-6.5 7.5-3-0.75-6.5-3-6.5-7.5V7l6.5-2.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 12.25l1.5 1.5 3-3"
        />
      </svg>
    ),
  },
  {
    title: "Job #JOB-1234 completed",
    name: "Sarah Levi",
    time: "12 min ago",
    badge: "bg-emerald-50 text-emerald-600",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="12" cy="12" r="8" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.5 12.5l2.25 2.25 4.75-5"
        />
      </svg>
    ),
  },
  {
    title: "Dispute opened for job #JOB-1198",
    name: "Michael Ben",
    time: "25 min ago",
    badge: "bg-rose-50 text-rose-600",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="12" cy="12" r="8" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8.5v4.5"
        />
        <circle cx="12" cy="16.5" r="0.8" />
      </svg>
    ),
  },
  {
    title: "Payout processed",
    name: "Yossi Cohen",
    time: "1 hour ago",
    badge: "bg-amber-50 text-amber-600",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.5 8c0-1.4-1.6-2.5-3.5-2.5S8.5 6.6 8.5 8s1.6 2.5 3.5 2.5 3.5 1.1 3.5 2.5-1.6 2.5-3.5 2.5S8.5 15.4 8.5 14"
        />
      </svg>
    ),
  },
  {
    title: "Professional verified",
    name: "Rachel Green",
    time: "2 hours ago",
    badge: "bg-indigo-50 text-indigo-600",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5l6.5 2.5v5.25c0 4.5-3.5 6.75-6.5 7.5-3-0.75-6.5-3-6.5-7.5V7l6.5-2.5z"
        />
      </svg>
    ),
  },
];

const tasks = [
  { label: "Pending Verifications", count: 8, badge: "bg-rose-100 text-rose-500" },
  { label: "Open Disputes", count: 3, badge: "bg-rose-100 text-rose-500" },
  { label: "Pending Payouts", count: 12, badge: "bg-amber-100 text-amber-600" },
  { label: "Flagged Reviews", count: 5, badge: "bg-amber-100 text-amber-600" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="text-xs mt-2">
                    <span className={`${stat.tone} font-medium`}> {stat.delta}</span>
                    <span className="text-gray-400"> {stat.deltaLabel}</span>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.badge}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${activity.badge}`}
                    >
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Pending Tasks
              </h2>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.label}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm text-gray-700">{task.label}</span>
                  <span
                    className={`text-xs font-semibold rounded-full px-2.5 py-1 ${task.badge}`}
                  >
                    {task.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
