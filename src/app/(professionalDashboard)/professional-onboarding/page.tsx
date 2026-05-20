"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useOnboardingMutation } from "@/redux/features/professional/onboarding/onboardingApi";
import { useGetCategoriesQuery } from "@/redux/features/admin/categories/categoriesApi";
import { toast } from "sonner";

// Icons
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);


const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CrownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M2 20h20" />
    <path d="M5 20V10l7-6 7 6v10" />
    <path d="M12 4v6" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface UploadedFile {
  name: string;
  size: number;
  file: File;
  preview?: string;
}

interface CategoryItem {
  id: number;
  name_en: string;
  name_de: string;
  icon: string;
  color: string;
  is_active: boolean;
}

// ─── File Upload Row ──────────────────────────────────────────────────────────
const FileUploadRow = ({
  docKey,
  label,
  sub,
  file,
  onFile,
}: {
  docKey: string;
  label: string;
  sub: string;
  file: UploadedFile | null;
  onFile: (key: string, file: UploadedFile | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onFile(docKey, {
        name: f.name,
        size: f.size,
        file: f,
        preview: f.type.startsWith("image/") ? (ev.target?.result as string) : undefined,
      });
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      {/* Icon / image preview */}
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
        {file?.preview ? (
          <Image src={file.preview} alt="preview" className="w-full h-full object-cover" width={40} height={40} />
        ) : (
          <DocIcon />
        )}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {file ? (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {file.name} · {formatSize(file.size)}
          </p>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        )}
      </div>

      {/* Action */}
      {file ? (
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-green-500 font-bold text-base">✓</span>
          <button
            onClick={() => onFile(docKey, null)}
            className="text-gray-300 hover:text-red-400 transition-colors"
            title="Remove"
          >
            <TrashIcon />
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleChange}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-amber-500 hover:text-amber-600 text-sm font-semibold shrink-0 transition-colors"
          >
            <UploadIcon />
            Choose
          </button>
        </>
      )}
    </div>
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Account", "Identity", "Services", "Review"];
  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="w-full px-8 pt-7 pb-5">
      <div className="relative h-1.5 bg-gray-200 rounded-full mb-6">
        <div
          className="absolute left-0 top-0 h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between">
        {steps.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <div key={step} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${isActive ? "bg-amber-400 text-white shadow-md" : isDone ? "bg-amber-400 text-white" : "bg-gray-200 text-gray-400"}`}
              >
                {isDone ? <CheckIcon /> : step}
              </div>
              <span className={`text-xs ${isActive || isDone ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Step 1 ───────────────────────────────────────────────────────────────────
const Step1 = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col items-center justify-center flex-1 px-8 py-8 text-center">
    <div className="relative flex items-center justify-center mb-8">
      <div className="absolute w-40 h-40 rounded-full bg-amber-50 border border-amber-100" />
      <div className="absolute rounded-full bg-amber-100 border border-amber-200" style={{ width: "7.5rem", height: "7.5rem" }} />
      <div className="relative w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
        <span className="text-white"><CheckIcon /></span>
      </div>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-3">Account Created</h2>
    <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
      Welcome aboard! Let&apos;s complete your profile to start receiving service requests from customers near you.
    </p>
    <button
      onClick={onNext}
      className="mt-10 w-full max-w-md bg-amber-400 hover:bg-amber-500 text-white font-semibold py-4 rounded-2xl transition-colors duration-200 text-sm shadow-sm cursor-pointer"
    >
      Continue Setup
    </button>
  </div>
);

// ─── Step 2 ───────────────────────────────────────────────────────────────────
const Step2 = ({
  onNext,
  onBack,
  businessAddress,
  setBusinessAddress,
  files,
  setFiles,
}: {
  onNext: () => void;
  onBack: () => void;
  businessAddress: string;
  setBusinessAddress: Dispatch<SetStateAction<string>>;
  files: Record<string, UploadedFile | null>;
  setFiles: Dispatch<SetStateAction<Record<string, UploadedFile | null>>>;
}) => {

  const docs = [
    { key: "gov", label: "Government ID", sub: "Driver's license, Passport, or National ID" },
    { key: "cert", label: "Professional Certificate", sub: "Trade licenses or relevant certifications" },
    { key: "photo", label: "Profile Photo", sub: "Clear photo of your face for customers" },
  ];

  const handleFile = (key: string, file: UploadedFile | null) =>
    setFiles((prev) => ({ ...prev, [key]: file }));

  const uploadedCount = Object.values(files).filter(Boolean).length;

  return (
    <div className="flex flex-col flex-1 px-7 py-6 overflow-auto">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <BackIcon />
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900 mb-2">Business Address</h3>
        <input
          type="text"
          placeholder="Enter your business address"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </div>

      <div className="mb-2">
        <h3 className="text-base font-bold text-gray-900 mb-1">Verify Your Identity</h3>
        <p className="text-xs text-gray-400 mb-4">Upload required documents to continue</p>

        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100 bg-white shadow-sm">
          {docs.map((doc) => (
            <FileUploadRow
              key={doc.key}
              docKey={doc.key}
              label={doc.label}
              sub={doc.sub}
              file={files[doc.key]}
              onFile={handleFile}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Documents uploaded</span>
          <span>{uploadedCount} of 3</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedCount / 3) * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-auto w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-4 rounded-2xl transition-colors duration-200 text-sm shadow-sm cursor-pointer"
      >
        Continue Setup
      </button>
    </div>
  );
};

// ─── Step 3 ───────────────────────────────────────────────────────────────────
const Step3 = ({
  onNext,
  onBack,
  selectedServices,
  setSelectedServices,
  radius,
  setRadius,
  lat,
  setLat,
  lng,
  setLng,
  isSubmitting,
  categories,
  isLoading,
}: {
  onNext: () => void;
  onBack: () => void;
  selectedServices: number[];
  setSelectedServices: Dispatch<SetStateAction<number[]>>;
  radius: number;
  setRadius: Dispatch<SetStateAction<number>>;
  lat: string;
  setLat: Dispatch<SetStateAction<string>>;
  lng: string;
  setLng: Dispatch<SetStateAction<string>>;
  isSubmitting: boolean;
  categories: CategoryItem[];
  isLoading: boolean;
}) => {
  const toggle = (id: number) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

  return (
    <div className="flex flex-col flex-1 px-7 py-6 overflow-auto">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <BackIcon />
        </button>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Set Up Your Services</h3>
      <p className="text-xs text-gray-400 mb-6">Tell us what services you offer</p>

      <h4 className="text-sm font-bold text-gray-800 mb-3">Select Categories</h4>
      <div className="grid grid-cols-3 gap-2 mb-7">
        {isLoading && (
          <div className="col-span-3 text-xs text-gray-400">Loading categories...</div>
        )}
        {!isLoading && categories.length === 0 && (
          <div className="col-span-3 text-xs text-gray-400">No categories available.</div>
        )}
        {!isLoading && categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all duration-200 cursor-pointer
              ${selectedServices.includes(cat.id)
                ? "border-amber-400 bg-amber-50"
                : "border-gray-100 bg-white hover:border-gray-200"}`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
            >
              {cat.icon}
            </div>
            <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
              {cat.name_en}
            </span>
          </button>
        ))}
      </div>

      <h4 className="text-sm font-bold text-gray-800 mb-3">Service Area</h4>
      <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm mb-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center shrink-0">
            <PinIcon />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              Radius: <span className="text-amber-500">{radius} Km</span>
            </p>
            <p className="text-xs text-gray-400">Coverage area from your location</p>
          </div>
        </div>
        <input
          type="range"
          min={5}
          max={20}
          step={1}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-amber-400 h-1.5 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>5 km</span>
          <span className="font-semibold text-gray-700">10</span>
          <span>15 km</span>
          <span>20 km</span>
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-400 mb-2">Location coordinates (auto-filled when available)</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={isSubmitting || selectedServices.length === 0}
        className="mt-auto w-full bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-colors duration-200 text-sm shadow-sm cursor-pointer"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
};

// ─── Step 4 ───────────────────────────────────────────────────────────────────
const Step4 = ({ onNext, onBack, reviewMessage }: { onNext: () => void; onBack: () => void; reviewMessage?: string }) => {
  const items = [
    { label: "Account created", done: true },
    { label: "Identity verified", done: true },
    { label: "Services configured", done: true },
    { label: "Admin review", done: false, badge: "In Progress" },
  ];

  return (
    <div className="flex flex-col items-center flex-1 px-8 py-8">
      <div className="w-full mb-4">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <BackIcon />
        </button>
      </div>
      <div className="relative flex items-center justify-center mb-7">
        <div className="absolute w-40 h-40 rounded-full bg-amber-50 border border-amber-100" />
        <div className="absolute rounded-full bg-amber-100 border border-amber-200" style={{ width: "7.5rem", height: "7.5rem" }} />
        <div className="relative w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
          <span className="text-white"><CheckIcon /></span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 my-4">Application Submitted!</h2>
      <p className="text-gray-500 text-sm text-center leading-relaxed mb-7 max-w-sm">
        {reviewMessage || "We&apos;ve received your details and are currently reviewing your application."}
      </p>
      <div className="w-full border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <ClockIcon />
          <div>
            <p className="text-sm font-bold text-gray-800">Pending Approval</p>
            <p className="text-xs text-gray-400">Estimated review time: 24–48 hours</p>
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-t border-gray-100 first:border-t-0">
              <div className="flex items-center gap-3">
                {item.done ? (
                  <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <ClockIcon />
                )}
                <span className={`text-sm ${item.badge ? "text-amber-500 font-medium" : "text-gray-700"}`}>
                  {item.label}
                </span>
              </div>
              {item.badge ? (
                <span className="text-xs bg-amber-50 text-amber-500 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              ) : (
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onNext}
        className="mt-8 w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-4 rounded-2xl transition-colors duration-200 text-sm shadow-sm cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
};

// ─── Step 5 ───────────────────────────────────────────────────────────────────
const Step5 = () => {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");

  const handleStart = () => {
    window.location.href = "/professional-dashboard";
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-700 relative overflow-hidden">
      <div className="mx-4 mt-4 mb-4 bg-white rounded-3xl overflow-hidden flex flex-col">
        {/* Close */}
        <div className="relative px-6 pt-5 pb-0">
          <button
            onClick={handleStart}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="px-8 pt-4 pb-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            Start your 3-day FREE<br />trial to continue.
          </h2>
        </div>

        {/* Timeline */}
        <div className="px-7 pb-2">
          {[
            { icon: <LockIcon />, title: "Today", desc: "Get full access and see your mindset start to change.", dark: false },
            { icon: <BellIcon />, title: "Day 2", desc: "Get a reminder that your trial ends in 24 hours.", dark: false },
            { icon: <CrownIcon />, title: "After day 3", desc: "Your free trial ends and you'll be charged, cancel anytime before.", dark: true },
          ].map((row, i, arr) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ${row.dark ? "bg-gray-800" : "bg-amber-400"}`}>
                  {row.icon}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-0.5 my-1" style={{ height: 36, background: "linear-gradient(to bottom, #fbbf24 0%, #d1d5db 100%)" }} />
                )}
              </div>
              <div className={`pt-1 ${i < arr.length - 1 ? "pb-5" : "pb-2"}`}>
                <p className="text-sm font-bold text-gray-900">{row.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{row.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div className="flex gap-3 px-5 pt-4 pb-2">
          <button
            onClick={() => setPlan("monthly")}
            className={`flex-1 rounded-2xl border-2 p-4 text-left transition-all duration-200 relative cursor-pointer
              ${plan === "monthly" ? "border-gray-300" : "border-gray-100 bg-gray-50"}`}
          >
            <p className="text-sm font-bold text-gray-900 mb-1">Monthly</p>
            <p className="text-sm text-gray-400">1.99 €/mo</p>
            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
              ${plan === "monthly" ? "border-gray-400" : "border-gray-200"}`}>
              {plan === "monthly" && <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />}
            </div>
          </button>

          <button
            onClick={() => setPlan("yearly")}
            className={`flex-1 rounded-2xl border-2 p-4 text-left transition-all duration-200 relative pt-5 cursor-pointer
              ${plan === "yearly" ? "border-amber-400" : "border-gray-100 bg-gray-50"}`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-semibold px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm">
              3 days Free
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Yearly</p>
            <p className="text-sm text-gray-400">0.99 €/mo</p>
            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
              ${plan === "yearly" ? "border-amber-400 bg-amber-400" : "border-gray-200"}`}>
              {plan === "yearly" && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* No Payment */}
        <div className="flex items-center justify-center gap-2 py-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm font-medium text-gray-700">No Payment Due Now</span>
        </div>

        {/* CTA */}
        <div className="px-5 pb-2">
          <button
            onClick={handleStart}
            className="w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors duration-200 text-sm shadow-sm cursor-pointer"
          >
            Start 3-day free trial
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center py-3 pb-5">
          3 days free then 11.88 € a year
        </p>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ onReset }: { onReset: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400">Welcome back,</p>
        <h1 className="text-lg font-bold text-gray-900">Professional Dashboard</h1>
      </div>
      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-sm">
        Pro
      </div>
    </div>

    <div className="mx-4 mt-4 bg-amber-400 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div>
        <p className="text-white font-bold text-sm">3-Day Free Trial Active</p>
        <p className="text-white/80 text-xs">Full access until your trial ends</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
      {[
        { label: "Active Jobs", value: "0", color: "text-amber-500" },
        { label: "Pending Requests", value: "0", color: "text-blue-500" },
        { label: "Completed", value: "0", color: "text-green-500" },
        { label: "Rating", value: "—", color: "text-purple-500" },
      ].map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>

    <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-gray-800 mb-3">Recent Activity</h3>
      <div className="flex flex-col items-center py-6 gap-2">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">No activity yet</p>
        <p className="text-xs text-gray-300">Service requests will appear here</p>
      </div>
    </div>

    <div className="mx-4 mt-6 mb-6">
      <button
        onClick={onReset}
        className="w-full border border-gray-200 text-gray-500 text-sm font-medium py-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
      >
        ← Restart Onboarding (Demo)
      </button>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [showDashboard, setShowDashboard] = useState(false);
  const [businessAddress, setBusinessAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [files, setFiles] = useState<Record<string, UploadedFile | null>>({
    gov: null,
    cert: null,
    photo: null,
  });
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [radius, setRadius] = useState(10);
  const [reviewMessage, setReviewMessage] = useState<string | undefined>(undefined);
  const [onboarding, { isLoading }] = useOnboardingMutation();
  const { data: categoriesData = [], isLoading: categoriesLoading } = useGetCategoriesQuery({}) as {
    data?: CategoryItem[];
    isLoading: boolean;
  };

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!lat) setLat(String(pos.coords.latitude));
        if (!lng) setLng(String(pos.coords.longitude));
      },
      (error) => {
        console.warn("Geolocation unavailable", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [lat, lng]);

  const handleSubmit = async () => {
    if (selectedServices.length === 0) return;
    const formData = new FormData();
    formData.append("business_address", businessAddress);
    formData.append("service_radius", String(radius));
    formData.append("services", JSON.stringify(selectedServices));
    if (files.gov?.file) formData.append("government_id", files.gov.file);
    if (files.cert?.file) formData.append("professional_certificate", files.cert.file);
    if (files.photo?.file) formData.append("profile_photo", files.photo.file);
    formData.append("onboarding_status", "UNDER_REVIEW");
    if (lat && lng) {
      formData.append("lat", lat);
      formData.append("lng", lng);
    }

    try {
      const res = await onboarding(formData).unwrap();
      setReviewMessage(res?.message);
      toast.success(res?.message || "Application submitted successfully.");
      setStep(4);
    } catch (error) {
      console.error("Onboarding submit failed", error);
    }
  };

  if (showDashboard) {
    return (
      <Dashboard
        onReset={() => {
          setStep(1);
          setShowDashboard(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-170">
        {step !== 5 && <StepIndicator currentStep={step} />}
        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && (
          <Step2
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
            businessAddress={businessAddress}
            setBusinessAddress={setBusinessAddress}
            files={files}
            setFiles={setFiles}
          />
        )}
        {step === 3 && (
          <Step3
            onNext={handleSubmit}
            onBack={() => setStep(2)}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            radius={radius}
            setRadius={setRadius}
            lat={lat}
            setLat={setLat}
            lng={lng}
            setLng={setLng}
            isSubmitting={isLoading}
            categories={categoriesData.filter((cat) => cat.is_active)}
            isLoading={categoriesLoading}
          />
        )}
        {step === 4 && <Step4 onNext={() => setStep(5)} onBack={() => setStep(3)} reviewMessage={reviewMessage} />}
        {step === 5 && <Step5 />}
      </div>
    </div>
  );
}