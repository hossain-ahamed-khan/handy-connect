"use client";

import Link from "next/link";
import { MdChevronRight, MdOutlineWaterDrop, MdVerified } from "react-icons/md";
import { useGetProfessionalsListQuery } from "@/redux/features/customer/professionals/professionalsListApi";
import Image from "next/image";

export default function Professionals() {
  const { data: professionals, isLoading, isError } = useGetProfessionalsListQuery(undefined);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
          >
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
              <div className="h-4 w-40 bg-gray-200 rounded-full" />
              <div className="h-5 w-24 bg-gray-200 rounded-full" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded-full" />
                    <div className="h-3 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-gray-200 rounded-full" />
                  <div className="h-5 w-12 bg-gray-200 rounded-full" />
                </div>
                <div className="h-12 w-36 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        Failed to load professionals. Please try again later.
      </div>
    );
  }

  if (!professionals || professionals.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 font-semibold">
        No professionals found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="w-full mx-auto space-y-4">
        {professionals.map((pro: {
          id: number;
          full_name: string;
          category_name: string;
          profile_photo: string | null;
          zip_code: string | null;
          is_verified: boolean;
          rating: string;
        }) => (
          <div
            key={pro.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Header: Verified Status & Trust Badge */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                <MdVerified className="text-xl" />
                <span>{pro.is_verified ? "Verified Professional" : "Unverified Professional"}</span>
              </div>
              <div className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight">
                {parseFloat(pro.rating) === 0 ? "New" : `${pro.rating} Rating`}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {/* Profile Photo with Status Dot */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {pro.profile_photo ? (
                        <Image
                          src={pro.profile_photo}
                          alt={pro.full_name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E2E8F0]" />
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {pro.full_name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <MdOutlineWaterDrop className="text-blue-400" />
                      <span>{pro.category_name}</span>
                    </div>
                  </div>
                </div>

                {/* Right Arrow Link */}
                <Link
                  href={`/user-dashboard/professionals/${pro.id}`}
                  className="p-2 text-amber-500 hover:bg-amber-50 rounded-full transition-colors"
                >
                  <MdChevronRight size={32} />
                </Link>
              </div>

              {/* Footer Section: Zip Code & Send Request */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Zip Code
                  </p>
                  <p className="text-lg font-bold text-amber-500">
                    {pro.zip_code ?? "N/A"}
                  </p>
                </div>

                <Link
                  href={`/user-dashboard/professionals/request`}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-center"
                >
                  Send Request
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}