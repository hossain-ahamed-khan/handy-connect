// import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "David Cohen",
    initials: "DC",
    color: "bg-amber-500",
    rating: 5,
    text: "Excellent work, very professional!",
  },
  {
    id: 2,
    name: "Sarah Levi",
    initials: "SL",
    color: "bg-red-500",
    rating: 5,
    text: "Fixed the issue quickly. Highly recommend!",
  },
  {
    id: 3,
    name: "David Cohen",
    initials: "DC",
    color: "bg-amber-500",
    rating: 5,
    text: "Excellent work, very professional!",
  },
  {
    id: 4,
    name: "Sarah Levi",
    initials: "SL",
    color: "bg-red-500",
    rating: 5,
    text: "Fixed the issue quickly. Highly recommend!",
  },
  {
    id: 5,
    name: "David Cohen",
    initials: "DC",
    color: "bg-amber-500",
    rating: 5,
    text: "Excellent work, very professional!",
  },
  {
    id: 6,
    name: "Sarah Levi",
    initials: "SL",
    color: "bg-red-500",
    rating: 5,
    text: "Fixed the issue quickly. Highly recommend!",
  },
  {
    id: 7,
    name: "David Cohen",
    initials: "DC",
    color: "bg-amber-500",
    rating: 5,
    text: "Excellent work, very professional!",
  },
  {
    id: 8,
    name: "Sarah Levi",
    initials: "SL",
    color: "bg-red-500",
    rating: 5,
    text: "Fixed the issue quickly. Highly recommend!",
  },
];

type StarRatingProps = {
  rating: number;
  max?: number;
};

function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

type ReviewCardProps = {
  name: string;
  initials: string;
  color: string;
  rating: number;
  text: string;
};

function ReviewCard({ name, initials, color, rating, text }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4">
      <div
        className={`${color} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}
      >
        <span className="text-white text-sm font-semibold">{initials}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-800">{name}</span>
          <StarRating rating={rating} />
        </div>
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}

export default function ReviewList() {
  return (
    <div className="flex justify-center">
      <div className="w-4/5 mx-auto flex flex-col gap-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </div>
    </div>
  );
}
