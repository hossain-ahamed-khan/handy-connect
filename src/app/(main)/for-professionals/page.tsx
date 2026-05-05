"use client";
import { useState } from "react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-teal-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-10 h-10 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "High-Quality Leads",
    desc: "Get matched with homeowners who need your specific skills right now. No more tire-kickers.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Keep What You Earn",
    desc: "Transparent pricing with low commission rates. Get paid fast and securely through the platform.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 4.5h3" />
      </svg>
    ),
    title: "Manage Everything",
    desc: "Our pro app lets you chat with clients, send quotes, and manage your schedule on the go.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Built-in Trust",
    desc: "Leverage our brand trust. Verified pros get higher conversion rates and better-paying jobs.",
  },
];

const whyItems = [
  "Zero upfront costs or subscription fees",
  "AI-pre-screened job requests",
  "Guaranteed payment protection",
  "Dedicated pro support team",
  "Flexible schedule - work when you want",
];

export default function ForProfessionals() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="font-sans w-full">
      {/* Hero Section */}
      <section className="relative w-full flex items-center overflow-hidden bg-gray-950">
        {/* Dark overlay texture */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900/90 via-gray-900/70 to-gray-800/60 z-10" />
        {/* Background image simulation with gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,#1a1a2e_0%,#0f0f0f_100%)]" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-20 w-[80%] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left */}
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Grow your service<br />business with<br />
              <span className="text-[#F59E0B]">Handy Connect</span>
            </h1>
            <p className="text-gray-300 text-base mb-8 max-w-md">
              Join thousands of top-rated professionals getting consistent, high-quality jobs without the marketing hassle.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button className="px-7 py-3 bg-[#F59E0B] hover:bg-[#E5970A] text-gray-900 font-bold rounded-lg transition-all duration-200 shadow-lg shadow-[#F59E0B]/30 hover:shadow-[#F59E0B]/50 hover:-translate-y-0.5 active:translate-y-0">
                Apply Now
              </button>
              <button className="px-7 py-3 border border-white/30 hover:border-white/60 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-white/5">
                Learn More
              </button>
            </div>
          </div>

          {/* Right — Why Pros Love Us Card */}
          <div className="flex-1 max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-6">Why Pros Love Us</h3>
            <ul className="space-y-4">
              {whyItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-gray-200 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 lg:py-20 w-full">
        <div className="w-[85%] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
              Everything you need to succeed
            </h2>
            <p className="text-gray-500 text-base">
              We provide the tools and the customers. You provide the expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative bg-white border rounded-2xl p-7 cursor-default transition-all duration-300 ${
                  hovered === i
                    ? "border-[#F59E0B]/40 shadow-lg shadow-yellow-100 -translate-y-1"
                    : "border-gray-100 shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                  hovered === i ? "bg-yellow-200" : "bg-yellow-50"
                }`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial + CTA Section */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="w-container mx-auto px-6 lg:px-12 text-center">
          {/* Trending icon */}
          <div className="flex justify-center mb-6">
            <TrendingUpIcon />
          </div>

          <blockquote className="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-8 max-w-3xl mx-auto">
            &quot;Since joining Handy Connect, my plumbing business has grown by 40%. I spend less time looking for work and more time actually working.&quot;
          </blockquote>

          <div className="flex items-center justify-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 font-bold text-sm flex-shrink-0">
              MJ
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Mike Johnson</p>
              <p className="text-gray-500 text-xs">Master Plumber, Partner since 2022</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-3xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              Ready to boost your earnings?
            </h2>
            <p className="text-gray-500 text-sm mb-7">
              It takes less than 5 minutes to apply. Start receiving job requests in your area today.
            </p>
            <button className="px-8 py-3.5 bg-[#F59E0B] hover:bg-[#f59f0bda] text-gray-900 font-bold rounded-xl cursor-pointer">
              Start Your Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}