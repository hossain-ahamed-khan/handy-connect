import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

export default function CTA() {
  return (
    <section className="bg-[#F59E0B] py-20 px-6 text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of homeowners who trust Handy Connect for their home
          service needed.
        </p>
        <Link
          href="/login"
          className="inline-block transition-transform hover:scale-105 active:scale-95"
        >
          <button className="flex items-center gap-4 bg-white text-[#2563EB] px-8 py-4 rounded-xl font-bold shadow-xl">
            Find a Professional Now
            <FaArrowRightLong size={20} />
          </button>
        </Link>
      </div>
    </section>
  );
}
