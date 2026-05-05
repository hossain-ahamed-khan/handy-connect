"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Search,
    MessageSquare,
    CalendarCheck,
    CheckCircle,
    KeyRound,
    Bell,
    DollarSign,
    TrendingUp,
} from "lucide-react";

const homeownerSteps = [
    {
        id: 1,
        title: "Describe Your Need",
        description:
            "Tell us what needs fixing. Use our AI tool to upload photos for an instant diagnosis and cost estimate.",
        icon: Search,
        side: "right" as const,
    },
    {
        id: 2,
        title: "Get Matched",
        description:
            "We instantly notify vetted professionals in your area who specialize in your specific issue.",
        icon: MessageSquare,
        side: "left" as const,
    },
    {
        id: 3,
        title: "Compare & Book",
        description:
            "Review quotes, read past customer reviews, and book the professional that fits your schedule and budget.",
        icon: CalendarCheck,
        side: "right" as const,
    },
    {
        id: 4,
        title: "Job Done",
        description:
            "Pay securely through the platform only when the job is completed to your satisfaction.",
        icon: CheckCircle,
        side: "left" as const,
    },
];

const professionalSteps = [
    {
        id: 1,
        title: "Create Your Profile",
        description:
            "Sign up, verify your credentials, and set your service area and specialties.",
        icon: KeyRound,
        side: "right" as const,
    },
    {
        id: 2,
        title: "Receive Leads",
        description:
            "Get instant notifications for jobs in your area that match your skills. No bidding wars.",
        icon: Bell,
        side: "left" as const,
    },
    {
        id: 3,
        title: "Win Jobs",
        description:
            "Chat with customers, provide quotes, and get hired. Manage your schedule right from the app.",
        icon: DollarSign,
        side: "right" as const,
    },
    {
        id: 4,
        title: "Grow Your Business",
        description:
            "Build your reputation with reviews, get repeat customers, and watch your business thrive.",
        icon: TrendingUp,
        side: "left" as const,
    },
];

type Step = (typeof homeownerSteps)[number];

function StepCard({ step }: { step: Step }) {
    const Icon = step.icon;
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-64 md:w-72">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
        </div>
    );
}

function Timeline({ steps }: { steps: Step[] }) {
    return (
        <div className="relative flex flex-col items-center gap-0 py-4">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-amber-300 z-0" />

            {steps.map((step) => (
                <div
                    key={step.id}
                    className="relative flex items-center w-full mb-10 last:mb-0"
                    style={{ minHeight: "120px" }}
                >
                    {/* Left side */}
                    <div className="flex-1 flex justify-end pr-8">
                        {step.side === "left" && <StepCard step={step} />}
                    </div>

                    {/* Step circle */}
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center shadow">
                        <span className="text-amber-500 font-bold text-sm">{step.id}</span>
                    </div>

                    {/* Right side */}
                    <div className="flex-1 flex justify-start pl-8">
                        {step.side === "right" && <StepCard step={step} />}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function HowHandyConnectWorks() {
    const [activeTab, setActiveTab] = useState<"homeowners" | "professionals">(
        "homeowners"
    );

    return (
        <section className="bg-gray-50 min-h-screen py-16 px-4">
            <div className="max-container mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        How Handy Connect Works
                    </h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                        Whether you need a repair or you&apos;re a professional looking for work,
                        we make the process seamless and transparent.
                    </p>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(v) =>
                        setActiveTab(v as "homeowners" | "professionals")
                    }
                    className="w-full"
                >
                    <div className="flex justify-center mb-10">
                        <TabsList className="bg-white border border-gray-200 rounded-full px-3 py-6 shadow-sm">
                            <TabsTrigger
                                value="homeowners"
                                className="rounded-full px-8 py-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-gray-900 text-gray-500 transition-all cursor-pointer"
                            >
                                For Homeowners
                            </TabsTrigger>
                            <TabsTrigger
                                value="professionals"
                                className="rounded-full px-8 py-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-gray-900 text-gray-500 transition-all cursor-pointer"
                            >
                                For Professionals
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="homeowners">
                        <Timeline steps={homeownerSteps} />
                    </TabsContent>

                    <TabsContent value="professionals">
                        <Timeline steps={professionalSteps} />
                    </TabsContent>
                </Tabs>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-900 font-semibold text-lg mb-4">
                        Ready to get started?
                    </p>
                    <button className="bg-[#F59E0B] hover:bg-[#E69100] text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm shadow">
                        {activeTab === "homeowners"
                            ? "Find a Professional"
                            : "Join as a Professional"}
                    </button>
                </div>
            </div>
        </section>
    );
}