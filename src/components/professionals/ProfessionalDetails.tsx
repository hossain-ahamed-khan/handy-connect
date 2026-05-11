"use client";

import { Rate, Tabs } from "antd";
import React from "react";
import { FaStar } from "react-icons/fa";
import {
  MdOutlineBadge,
  MdOutlineCardMembership,
  MdOutlineCheckCircle,
  MdOutlineTrendingUp,
  MdVerified,
} from "react-icons/md";
import { useGetProfessionalsDetailsQuery } from "@/redux/features/customer/professionals/professionalsListApi"; // update this import path
import Image from "next/image";

type ProfessionalService = {
  id: number;
  name_en: string;
  name_de: string;
  icon: string | null;
  color: string | null;
  min_price: string;
  max_price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ProfessionalReview = {
  id: number;
  reviewer: number;
  reviewer_name: string;
  reviewer_initial: string;
  rating: number;
  comment: string;
  created_at: string;
};

type VerificationStatus = {
  government_id: boolean;
  professional_certificate: boolean;
  profile_photo: boolean;
  is_verified: boolean;
  trust_score: number;
};

type ProfessionalDetailsResponse = {
  id: number;
  full_name: string;
  email: string;
  bio: string | null;
  profile_photo: string | null;
  zip_code: string | null;
  is_verified: boolean;
  radius_km: number;
  jobs_count: number;
  average_rating: number;
  services: ProfessionalService[];
  recent_reviews: ProfessionalReview[];
  verification_status: VerificationStatus | null;
};

export default function ProfessionalDetails({ id }: { id: number }) {
  const { data, isLoading, isError } = useGetProfessionalsDetailsQuery(id) as {
    data?: ProfessionalDetailsResponse;
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center py-20 text-red-400 text-sm">
        Failed to load professional details.
      </div>
    );
  }

  const trustScore = data.verification_status?.trust_score ?? 0;

  // Tabs configuration for Ant Design
  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <MdOutlineBadge /> Government ID
        </span>
      ),
      children: (
        <GovernmentIDTab
          verified={data.verification_status?.government_id ?? false}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <MdOutlineCardMembership /> Certificates
        </span>
      ),
      children: (
        <CertificatesTab
          services={data.services ?? []}
          verified={data.verification_status?.professional_certificate ?? false}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="w-full mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="relative">
            {data.profile_photo ? (
              <Image
                src={data.profile_photo}
                alt={data.full_name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-[#E2E8F0] rounded-full" />
            )}
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{data.full_name}</h2>
            <p className="text-sm text-gray-400">{data.email}</p>
          </div>
        </div>

        {/* Stats Grid (Radius, Jobs, Review) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<MdOutlineTrendingUp className="text-blue-500" />}
            value={`${data.radius_km}km`}
            label="Radius"
          />
          <StatCard
            icon={<MdOutlineCheckCircle className="text-green-500" />}
            value={String(data.jobs_count)}
            label="Jobs"
          />
          <StatCard
            icon={<FaStar className="text-amber-500" />}
            value={String(data.average_rating)}
            label="Review"
          />
        </div>

        {/* Verifications Section with Ant Design Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <MdVerified className="text-green-600 text-xl" />
              <span>Verifications</span>
            </div>
            <div className="text-green-600 bg-green-50 text-[10px] font-bold px-3 py-1 rounded-full border border-green-100 uppercase">
              {trustScore}% Trusted
            </div>
          </div>

          <div className="p-6">
            <Tabs
              defaultActiveKey="1"
              items={tabItems}
              centered
              className="custom-tabs"
            />
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Reviews</h3>
            <button className="text-xs text-gray-500 hover:text-blue-600">
              View All
            </button>
          </div>

          {data.recent_reviews?.length > 0 ? (
            data.recent_reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.reviewer_name}
                initial={review.reviewer_initial}
                color={getAvatarColor(review.reviewer_initial)}
                rating={review.rating}
                text={review.comment}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Deterministic color from an initial letter */
function getAvatarColor(initial: string): string {
  const colors = [
    "bg-cyan-500",
    "bg-red-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-blue-500",
  ];
  const index = (initial?.charCodeAt(0) ?? 0) % colors.length;
  return colors[index];
}

// --- Sub-Components ---

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

function GovernmentIDTab({ verified }: { verified: boolean }) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
        <MdVerified className="text-green-500 text-lg" /> Verified Identity
      </div>
      <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-sm">
            <MdOutlineBadge />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">National ID (NID)</h4>
            <p className="text-xs text-gray-400">
              Government Database Verified
            </p>
            <p className="text-[10px] text-gray-300 mt-1">
              Issued: January 2020
            </p>
          </div>
        </div>
        {verified && (
          <div className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-md flex items-center gap-1">
            <MdOutlineCheckCircle /> Verified
          </div>
        )}
      </div>
    </div>
  );
}

function CertificatesTab({
  services,
  verified,
}: {
  services: ProfessionalService[];
  verified: boolean;
}) {
  return (
    <div className="space-y-4 pt-4">
      {services.map((service) => (
        <CertificateItem
          key={service.id}
          title={service.name_en}
          issuer={`$${service.min_price} – $${service.max_price}`}
          year={new Date(service.created_at).getFullYear().toString()}
        />
      ))}
      {services.length === 0 && (
        <p className="text-sm text-gray-400">No certificates available.</p>
      )}
      <div className="flex justify-between items-center mt-6">
        <p className="text-[10px] text-gray-400 font-medium">
          All certificates manually verified
        </p>
        {verified && (
          <div className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-md flex items-center gap-1">
            <MdOutlineCheckCircle /> Verified
          </div>
        )}
      </div>
    </div>
  );
}

function CertificateItem({
  title,
  issuer,
  year,
}: {
  title: string;
  issuer: string;
  year: string;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:border-amber-200 transition-colors">
      <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xl">
        <MdOutlineCardMembership />
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <p className="text-[11px] text-gray-400">
          {issuer} • {year}
        </p>
      </div>
    </div>
  );
}

function ReviewCard({
  name,
  initial,
  color,
  rating,
  text,
}: {
  name: string;
  initial: string;
  color: string;
  rating: number;
  text: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}
        >
          {initial}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">{name}</h4>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}