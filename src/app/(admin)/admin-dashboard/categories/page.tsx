"use client";
import { useState } from "react";

interface Category {
    id: number;
    name: string;
    nameHe: string;
    icon: string;
    iconBg: string;
    priceMin: number;
    priceMax: number;
}

const initialCategories: Category[] = [
    { id: 1, name: "Plumbing", nameHe: "אינסטלציה", icon: "🔧", iconBg: "bg-blue-100", priceMin: 80, priceMax: 500 },
    { id: 2, name: "Electrical", nameHe: "חשמל", icon: "⚡", iconBg: "bg-yellow-100", priceMin: 100, priceMax: 600 },
    { id: 3, name: "AC", nameHe: "מיזוג אוויר", icon: "❄️", iconBg: "bg-cyan-100", priceMin: 150, priceMax: 800 },
    { id: 4, name: "Cleaning", nameHe: "ניקיון", icon: "🧹", iconBg: "bg-green-100", priceMin: 50, priceMax: 300 },
    { id: 5, name: "Carpentry", nameHe: "נגרות", icon: "🔨", iconBg: "bg-gray-100", priceMin: 100, priceMax: 700 },
    { id: 6, name: "Painting", nameHe: "צביעה", icon: "🎨", iconBg: "bg-purple-100", priceMin: 200, priceMax: 1500 },
];

function EditIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-2xl ${category.iconBg} flex items-center justify-center text-2xl`}>
                    {category.icon}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(category)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-900 text-base">{category.name}</h3>
                <p className="text-gray-400 text-sm mt-0.5 text-right" dir="rtl">{category.nameHe}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Price Range</span>
                <span className="text-blue-600 font-medium text-sm">
                    ₪{category.priceMin}– ₪{category.priceMax}
                </span>
            </div>
        </div>
    );
}

interface ModalProps {
    category: Category | null;
    onSave: (category: Category) => void;
    onClose: () => void;
}

function Modal({ category, onSave, onClose }: ModalProps) {
    const [form, setForm] = useState<Category>(
        category || { id: Date.now(), name: "", nameHe: "", icon: "🔧", iconBg: "bg-blue-100", priceMin: 0, priceMax: 0 }
    );

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold mb-4">{category ? "Edit Category" : "Add Category"}</h2>
                <div className="flex flex-col gap-3">
                    <input
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400 text-right"
                        placeholder="שם (Hebrew)"
                        dir="rtl"
                        value={form.nameHe}
                        onChange={(e) => setForm({ ...form, nameHe: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400 w-1/2"
                            placeholder="Min Price"
                            value={form.priceMin}
                            onChange={(e) => setForm({ ...form, priceMin: Number(e.target.value) })}
                        />
                        <input
                            type="number"
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400 w-1/2"
                            placeholder="Max Price"
                            value={form.priceMax}
                            onChange={(e) => setForm({ ...form, priceMax: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div className="flex gap-2 mt-5 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        className="px-4 py-2 rounded-lg text-sm bg-yellow-400 hover:bg-yellow-500 font-medium transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleAdd = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    const handleSave = (category: Category) => {
        setCategories((prev) => {
            const exists = prev.find((c) => c.id === category.id);
            if (exists) return prev.map((c) => (c.id === category.id ? category : c));
            return [...prev, category];
        });
        setModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Category Management</h1>

                <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-400 text-sm">{categories.length} categories</span>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 transition-colors text-gray-900 font-medium px-5 py-2.5 rounded-xl text-sm"
                    >
                        <span className="text-lg leading-none">+</span>
                        Add Category
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>

            {modalOpen && (
                <Modal
                    category={editingCategory}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}