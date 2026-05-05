"use client";
import { useState } from "react";

import productImage from "@/assets/product-1.png";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Post {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  featured?: boolean;
}

const posts: Post[] = [
  {
    id: 1,
    category: "HVAC",
    categoryColor: "bg-cyan-400 text-cyan-900",
    title: "10 Signs Your HVAC System Needs Immediate Attention",
    excerpt:
      "Don't wait until your heating or cooling fails completely. Learn the early warning signs that your HVAC system needs professional repair.",
    featured: true,
  },
  {
    id: 2,
    category: "Plumbing",
    categoryColor: "bg-blue-400 text-blue-900",
    title: "How to Prepare Your Home for Winter Plumbing Issues",
    excerpt:
      "Frozen pipes can cause thousands in water damage. Follow this checklist to winterize your plumbing before the first freeze hits.",
  },
  {
    id: 3,
    category: "Electrical",
    categoryColor: "bg-yellow-300 text-yellow-900",
    title: "DIY vs. Professional: When to Call an Electrician",
    excerpt:
      "While changing a lightbulb is easy, other electrical work can be deadly. Here is a definitive guide on what you can DIY and what requires a pro.",
  },
  {
    id: 4,
    category: "Painting",
    categoryColor: "bg-pink-300 text-pink-900",
    title: "Choosing the Right Paint Finish for Every Room",
    excerpt:
      "Matte, eggshell, satin, or gloss? The finish you choose is just as important as the color. A room-by-room guide to paint finishes.",
  },
  {
    id: 5,
    category: "Gardening",
    categoryColor: "bg-green-300 text-green-900",
    title: "Fall Lawn Care: Setting Up for Spring Success",
    excerpt:
      "What you do to your lawn in autumn determines how it will look in spring. Essential aeration, seeding, and fertilizing tips.",
  },
  {
    id: 6,
    category: "Moving",
    categoryColor: "bg-orange-300 text-orange-900",
    title: "The Ultimate Moving Day Checklist",
    excerpt:
      "Keep your sanity intact on moving day with our comprehensive checklist covering everything from packing essentials to utility transfers.",
  },
];

function CategoryBadge({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={`text-[10px] px-2 py-0.5 ${colorClass}`}
    >
      {label}
    </Badge>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8">
      <div className="md:w-1/2 flex-shrink-0">
        <Image
          src={productImage}
          alt={post.title}
          className="w-full h-64 md:h-full object-cover"
          width={600}
          height={400}
        />
      </div>
      <div className="flex flex-col justify-center p-6 gap-3">
        <CategoryBadge label={post.category} colorClass={post.categoryColor} />
        <h2 className="text-2xl font-bold text-gray-900 leading-snug">
          {post.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
        <button className="mt-2 self-start text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          Read more →
        </button>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-200">
      <Image
        src={productImage}
        alt={post.title}
        className="w-full h-44 object-cover"
        width={400}
        height={176}
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <CategoryBadge label={post.category} colorClass={post.categoryColor} />
        <h3 className="text-base font-bold text-gray-900 leading-snug">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}

export default function HomeMaintenanceBlog() {
  const [featured] = useState(posts[0]);
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[80%] mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Home Maintenance Blog
          </h1>
          <p className="text-gray-500 text-sm">
            Expert advice, tips, and guides to help you maintain and improve
            your home.
          </p>
        </header>

        {/* Featured Post */}
        <FeaturedPost post={featured} />

        {/* Grid Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {gridPosts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}