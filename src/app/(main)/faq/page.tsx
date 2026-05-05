"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const homeownerFAQs = [
    {
        id: "item-1",
        question: "How does the AI diagnosis work?",
        answer:
            "Our AI analyzes the photos or videos you upload to identify common household issues. It compares your media against thousands of known problems to suggest the most likely cause, the type of professional needed, and an estimated cost range.",
    },
    {
        id: "item-2",
        question: "Are the professionals vetted?",
        answer:
            "Yes, all professionals on Handy Connect go through a rigorous vetting process including background checks, license verification, and review of past work history before they are approved to join our platform.",
    },
    {
        id: "item-3",
        question: "How do I pay for the service?",
        answer:
            "Payment is handled securely through our platform. You can pay using credit/debit cards or other supported payment methods. Funds are only released to the professional after you confirm the job is complete.",
    },
    {
        id: "item-4",
        question: "What if I am not satisfied with the work?",
        answer:
            "Your satisfaction is our priority. If you are not happy with the work, you can raise a dispute through the platform and our support team will work with you and the professional to resolve the issue promptly.",
    },
];

const professionalFAQs = [
    {
        id: "item-5",
        question: "How much does it cost to join?",
        answer:
            "Joining Handy Connect as a professional is free. We charge a small service fee on completed jobs, which is deducted automatically from your earnings.",
    },
    {
        id: "item-6",
        question: "How do I get paid?",
        answer:
            "Once a homeowner confirms the job is complete, your payment is released and transferred to your linked bank account within 2–3 business days.",
    },
    {
        id: "item-7",
        question: "Can I choose my own hours?",
        answer:
            "Absolutely. As a professional on Handy Connect, you have full flexibility to set your own availability and accept jobs that fit your schedule.",
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-white px-4 py-12">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm text-gray-500">
                        Find answers to common questions about using Handy Connect.
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-10">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search questions..."
                        className="pl-9 text-sm text-gray-500 placeholder:text-gray-400"
                    />
                </div>

                {/* For Homeowners */}
                <section className="mb-10">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        For Homeowners
                    </h2>
                    <Accordion type="single" collapsible className="space-y-3">
                        {homeownerFAQs.map((faq) => (
                            <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                className="rounded-lg border border-gray-200 px-4"
                            >
                                <AccordionTrigger className="text-sm font-medium text-gray-800 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-gray-500">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                {/* For Professionals */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        For Professionals
                    </h2>
                    <Accordion type="single" collapsible className="space-y-3">
                        {professionalFAQs.map((faq) => (
                            <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                className="rounded-lg border border-gray-200 px-4"
                            >
                                <AccordionTrigger className="text-sm font-medium text-gray-800 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-gray-500">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            </div>
        </div>
    );
}