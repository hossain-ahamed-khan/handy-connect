"use client";
import React from "react";

import aboutImage from "@/assets/about-image.png";
import Image from "next/image";

const stats = [
    { value: "10,000+", label: "Professionals" },
    { value: "50,000+", label: "Happy Customers" },
    { value: "120+", label: "Cities Covered" },
    { value: "250,000+", label: "Jobs Completed" },
];

const values = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        title: "Community First",
        description:
            "We build bridges between local professionals and homeowners, strengthening local economies.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: "Trust & Safety",
        description:
            "Every professional is vetted, and every job is backed by our satisfaction guarantee.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        title: "Quality Service",
        description:
            "We hold our platform to the highest standards, ensuring exceptional results every time.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
        title: "Sustainability",
        description:
            "Promoting repair over replacement to build a more sustainable future for our homes.",
    },
];

const AboutUs: React.FC = () => {
    return (
        <div className="container mx-auto bg-white text-gray-800 font-sans">
            {/* Hero Section */}
            <section className="py-20 px-6 text-center max-full">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    Empowering Local Communities
                    <br />
                    Through Trusted Service
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                    Handy Connect was founded with a simple mission: to make finding reliable home service
                    <br />
                    professionals as easy as pressing a button, while helping skilled tradespeople grow their
                    businesses.
                </p>
            </section>

            {/* Stats Section */}
            <section className="py-10 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl md:text-4xl font-bold text-amber-500">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 px-6">
                <div className="w-full flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            It started with a leaking pipe. Our founder spent hours calling plumbers, leaving
                            voicemails, and waiting for callbacks that never came. When someone finally arrived,
                            the price was double the phone estimate.
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            We realized the home services industry was broken. Homeowners couldn&apos;t find reliable
                            help, and great professionals were spending too much time marketing instead of doing
                            what they do best.
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Handy Connect was built to solve this. By leveraging AI to diagnose problems and
                            instantly matching them with vetted local pros, we&apos;ve created a transparent, efficient
                            ecosystem that works for everyone.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <Image
                            src={aboutImage}
                            alt="A professional cleaning a window"
                            className="rounded-2xl w-full object-cover max-h-96"
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-full">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
                        <p className="text-gray-500 text-sm mt-2">
                            The principles that guide every decision we make.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="bg-amber-50 text-amber-500 rounded-xl p-3 mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;