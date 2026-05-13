"use client";
import { useState } from "react";

const transactions = [
  { id: "JOB-001", date: "Dec 9", amount: 288 },
  { id: "JOB-002", date: "Dec 8", amount: 162 },
  { id: "JOB-003", date: "Dec 7", amount: 405 },
  { id: "JOB-004", date: "Dec 6", amount: 135 },
  { id: "JOB-005", date: "Dec 5", amount: 252 },
];

const payouts = [
  { amount: "3,500", date: "Dec 3", status: "Completed" },
  { amount: "2,600", date: "Nov 28", status: "Completed" },
  { amount: "4,200", date: "Dec 3", status: "Completed" },
];

export default function EarningsDashboard() {
  const [filter, setFilter] = useState("All");
  console.log(setFilter);

  return (
    <div className="flex items-center justify-center">
      <div className="w-4/5 mx-auto bg-gray-100 rounded-2xl overflow-hidden space-y-3">
        {/* Total Earnings Card */}
        <div className="bg-amber-400 rounded-2xl p-5">
          <p className="text-amber-700 text-xs font-medium mb-1">
            Total Earnings
          </p>
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold text-gray-900">₪12,450</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-green-700 text-xs">
              🚀 +12% from last month
            </span>
          </div>
        </div>

        {/* Filter Button */}
        <div className="bg-amber-400 rounded-xl px-4 py-2 flex items-center justify-center gap-2 cursor-pointer">
          <span className="text-gray-900 font-medium text-sm">{filter}</span>
          <span className="text-gray-900 text-xs">▼</span>
        </div>

        {/* This Week + Pending */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-1">This Week</p>
            <p className="text-gray-900 font-bold text-lg">₪2850</p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-1">Pending</p>
            <p className="text-gray-900 font-bold text-lg">₪650</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-gray-500 text-xs font-medium mb-3">
            Recent Transactions
          </p>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 text-sm font-medium">{tx.id}</p>
                  <p className="text-gray-400 text-xs">{tx.date}</p>
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  +₪{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 text-sm font-medium">Bank Account</p>
              <p className="text-gray-400 text-xs">Bank Hapoalim •••• 4521</p>
            </div>
          </div>
          <span className="text-gray-400 text-lg">›</span>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-gray-500 text-xs font-medium mb-3">
            Payout History
          </p>
          <div className="space-y-4">
            {payouts.map((payout, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 text-sm font-medium">
                    ₪ {payout.amount}
                  </p>
                  <p className="text-gray-400 text-xs">{payout.date}</p>
                </div>
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                  {payout.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
