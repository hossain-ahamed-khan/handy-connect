"use client";
import { useState } from "react";

import berlinImage from "@/assets/berline-img.png";
import Image from "next/image";

const cities = [
    "Berlin, Germany",
    "Munich, Germany",
    "Hamburg, Germany",
    "Frankfurt, Germany",
    "Cologne, Germany",
];

const whyChoosePoints = [
    "Over 500 verified professionals in the Berlin metropolitan area",
    "Average arrival time of under 45 minutes for emergencies",
    "All services backed by our €10,000 Handy Connect Guarantee",
    "English and German speaking professionals available",
];

const services = [
    {
        icon: "🔧",
        name: "Plumbing",
        description: "Pipe repairs, installations, and emergency leaks.",
        price: "€80 – €150",
    },
    {
        icon: "⚡",
        name: "Electrical",
        description: "Wiring, lighting, and electrical panel upgrades.",
        price: "€90 – €180",
    },
    {
        icon: "🌡️",
        name: "Heating & HVAC",
        description: "Boiler repair, AC installation, and maintenance.",
        price: "€100 – €250",
    },
    {
        icon: "🎨",
        name: "Painting",
        description: "Interior and exterior painting services.",
        price: "€200 – €800",
    },
];

const neighborhoods = [
    "Mitte",
    "Kreuzberg",
    "Prenzlauer Berg",
    "Friedrichshain",
    "Charlottenburg",
    "Neukölln",
    "Schöneberg",
];

export default function CityServices() {
    const [selectedCity, setSelectedCity] = useState("Berlin, Germany");

    const cityName = selectedCity.split(",")[0];

    return (
        <div className="font-sans text-gray-800">
            {/* ── Navbar ── */}
            <nav className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 container mx-auto mt-12">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-amber-500">📍</span>
                    <span>Select your city:</span>
                </div>
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                    {cities.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </nav>

            {/* ── Hero ── */}
            <section className="bg-black text-white px-8 pt-20 pb-24 relative overflow-hidden w-full">
                <div className="container mx-auto">
                    <span className="inline-flex items-center gap-1.5 text-xs border border-gray-600 rounded-full px-3 py-1 mb-6 text-gray-300">
                        <span className="text-amber-400">📍</span> Available in {cityName}
                    </span>

                    <h1 className="text-5xl font-bold leading-tight mb-5">
                        Top-Rated Home Services
                        <br />
                        in&nbsp;
                        <span className="text-white">{cityName}</span>
                    </h1>

                    <p className="text-gray-400 max-w-lg mb-10 leading-relaxed">
                        Find top-rated, verified home service professionals across {cityName}.
                        From quick plumbing fixes in Mitte to full electrical installations in
                        Kreuzberg, our local experts are ready to help.
                    </p>

                    <button className="bg-[#F59E0B] hover:bg-[#E5980B] transition-colors text-white font-semibold px-8 py-3.5 rounded-lg text-sm cursor-pointer">
                        Find a Pro in {cityName}
                    </button>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="bg-white border-b border-gray-100 w-full">
                <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                    <div className="flex flex-col items-center py-8 px-4 text-center">
                        <span className="mb-2 text-orange-500">
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M7 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
                                <path d="M17 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
                                <path d="M3 20c0-3 2.5-5 5.5-5h1" />
                                <path d="M14.5 15c3 0 6.5 2 6.5 5" />
                            </svg>
                        </span>
                        <span className="text-2xl font-bold text-orange-500">542</span>
                        <span className="text-xs text-slate-500 mt-1">Active Pros</span>
                    </div>
                    <div className="flex flex-col items-center py-8 px-4 text-center">
                        <span className="mb-2 text-emerald-500">
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="7" width="18" height="12" rx="2" />
                                <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                <path d="M3 12h18" />
                            </svg>
                        </span>
                        <span className="text-2xl font-bold text-emerald-500">12,450</span>
                        <span className="text-xs text-slate-500 mt-1">Jobs Completed</span>
                    </div>
                    <div className="flex flex-col items-center py-8 px-4 text-center">
                        <span className="mb-2 text-orange-500">
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 7v5l3 2" />
                            </svg>
                        </span>
                        <span className="text-2xl font-bold text-orange-500">15 mins</span>
                        <span className="text-xs text-slate-500 mt-1">Avg Response</span>
                    </div>
                    <div className="flex flex-col items-center py-8 px-4 text-center">
                        <span className="mb-2 text-amber-500">
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 9.4l6-.9Z" />
                            </svg>
                        </span>
                        <span className="text-2xl font-bold text-amber-500">4.9/5</span>
                        <span className="text-xs text-slate-500 mt-1">Satisfaction</span>
                    </div>
                </div>
            </section>

            {/* ── Why Choose ── */}
            <section className="bg-gray-50 py-24 px-8 w-full">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-16">
                    {/* Left */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-8">
                            Why choose Handy Connect in {cityName}?
                        </h2>
                        <ul className="space-y-5">
                            {whyChoosePoints.map((point) => (
                                <li key={point} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 border-teal-500 flex items-center justify-center">
                                        <svg
                                            className="w-3 h-3 text-teal-500"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polyline points="2,6 5,9 10,3" />
                                        </svg>
                                    </span>
                                    <span className="text-sm text-gray-600 leading-relaxed">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right – city image */}
                    <div className="flex-1 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={berlinImage}
                            alt={`${cityName} skyline`}
                            className="w-full h-full object-cover"
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </section>

            {/* ── Popular Services ── */}
            <section className="bg-gray-50 py-20 px-8 w-full">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-2">
                        Popular Services in {cityName}
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-10">
                        Transparent pricing and top-rated professionals for your specific
                        needs.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {services.map(({ icon, name, description, price }) => (
                            <div
                                key={name}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-4"
                            >
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl">
                                    {icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1">{name}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">Est. Price</span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {price}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Neighborhoods ── */}
            <section className="bg-gray-50 pb-20 px-8 w-full">
                <div className="container mx-auto">
                    <div className="bg-white rounded-2xl py-12 px-8 text-center border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6">
                            Neighborhoods we serve in {cityName}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3 mb-5">
                            {neighborhoods.map((n) => (
                                <span
                                    key={n}
                                    className="border border-gray-200 rounded-full px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    {n}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">
                            Don&apos;t see your neighborhood? We likely cover it!
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}