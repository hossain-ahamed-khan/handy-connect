import { FiCheckCircle, FiClipboard, FiStar, FiUsers } from "react-icons/fi";

const steps = [
  {
    id: 1,
    title: "Describe Your Issue",
    desc: "Tell us what needs fixing or improving in your home.",
    icon: FiClipboard,
  },
  {
    id: 2,
    title: "AI Diagnoses the Problem",
    desc: "Our AI helps identify the issue and estimates costs.",
    icon: FiStar,
  },
  {
    id: 3,
    title: "Professionals Receive Request",
    desc: "Local, verified experts review your job details.",
    icon: FiUsers,
  },
  {
    id: 4,
    title: "Get Quotes & Hire",
    desc: "Compare quotes, read reviews, and hire the best.",
    icon: FiCheckCircle,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-[30px] font-bold text-[#0F172A]">
            How It Works
          </h2>
          <p className="text-[#64748B] text-sm mt-2">
            Four simple steps to get your home projects done.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-6 right-6 top-16 h-px bg-[#E2E8F0]" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="text-center">
                  <div className="relative w-fit mx-auto mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#EEF4FF] flex items-center justify-center">
                      <Icon className="text-[#2563EB] text-2xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center justify-center">
                      {step.id}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-[#0F172A]">
                      {step.title}
                    </h3>
                    <p className="text-[#64748B] text-sm leading-relaxed mt-2">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
