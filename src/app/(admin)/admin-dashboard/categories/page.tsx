"use client";
import { useState } from "react";
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation} from "@/redux/features/admin/categories/categoriesApi";

import { toast } from "sonner";

interface Category {
    id: number;
    name_en: string;
    name_de: string;
    icon: string;
    color: string;
    min_price: string;
    max_price: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function XIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
    "🔧", "⚡", "⚙️", "🔨", "🪚", "🎨", "🚿", "💡", "🔌", "🧰", "🪛", "🛠️",
];

interface CategoryFormState {
    name_en: string;
    name_de: string;
    icon: string;
    color: string;
    min_price: string;
    max_price: string;
}

const DEFAULT_FORM: CategoryFormState = {
    name_en: "",
    name_de: "",
    icon: "🔧",
    color: "#0066ff",
    min_price: "0",
    max_price: "0",
};

// ─── Shared Modal Shell ───────────────────────────────────────────────────────

interface CategoryFormModalProps {
    title: string;
    form: CategoryFormState;
    isLoading: boolean;
    submitLabel: string;
    onClose: () => void;
    onChange: (field: keyof CategoryFormState, value: string) => void;
    onSubmit: () => void;
}

function CategoryFormModal({
    title,
    form,
    isLoading,
    submitLabel,
    onClose,
    onChange,
    onSubmit,
}: CategoryFormModalProps) {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Name (English) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Name (English)</label>
                    <input
                        type="text"
                        placeholder="e.g., Plumbing"
                        value={form.name_en}
                        onChange={(e) => onChange("name_en", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    />
                </div>

                {/* Name (Hebrew) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Name (Hebrew)</label>
                    <input
                        type="text"
                        dir="rtl"
                        placeholder="e.g., אינסטלציה"
                        value={form.name_de}
                        onChange={(e) => onChange("name_de", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    />
                </div>

                {/* Icon picker */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Icon</label>
                    <div className="flex flex-wrap gap-2">
                        {ICON_OPTIONS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => onChange("icon", emoji)}
                                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer border-2 ${
                                    form.icon === emoji
                                        ? "border-yellow-400 bg-yellow-50 scale-105"
                                        : "border-transparent bg-gray-100 hover:bg-gray-200"
                                }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Color</label>
                    <div className="flex items-center gap-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                        <input
                            type="color"
                            value={form.color}
                            onChange={(e) => onChange("color", e.target.value)}
                            className="w-6 h-6 rounded-md border-0 cursor-pointer bg-transparent p-0"
                        />
                        <span className="text-sm text-gray-700 font-mono">{form.color}</span>
                    </div>
                </div>

                {/* Price range */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Min Price (₪)</label>
                        <input
                            type="number"
                            min={0}
                            value={form.min_price}
                            onChange={(e) => onChange("min_price", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Max Price (₪)</label>
                        <input
                            type="number"
                            min={0}
                            value={form.max_price}
                            onChange={(e) => onChange("max_price", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isLoading}
                        className="rounded-xl bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-semibold text-gray-900 transition cursor-pointer"
                    >
                        {isLoading ? "Saving..." : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Add Modal ────────────────────────────────────────────────────────────────

interface AddCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function AddCategoryModal({ open, onClose, onSuccess }: AddCategoryModalProps) {
    const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
    const [createCategory, { isLoading }] = useCreateCategoryMutation();

    if (!open) return null;

    const handleChange = (field: keyof CategoryFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name_en.trim()) {
            toast.error("English name is required.");
            return;
        }
        try {
            await createCategory({
                name_en: form.name_en.trim(),
                name_de: form.name_de.trim(),
                icon: form.icon,
                color: form.color,
                min_price: parseFloat(form.min_price) || 0,
                max_price: parseFloat(form.max_price) || 0,
            }).unwrap();
            toast.success("Category created successfully!");
            setForm(DEFAULT_FORM);
            onSuccess();
            onClose();
        } catch {
            toast.error("Failed to create category. Please try again.");
        }
    };

    return (
        <CategoryFormModal
            title="Add Category"
            form={form}
            isLoading={isLoading}
            submitLabel="Add Category"
            onClose={() => { setForm(DEFAULT_FORM); onClose(); }}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditCategoryModalProps {
    category: Category | null;
    onClose: () => void;
    onSuccess: () => void;
}

function EditCategoryModal({ category, onClose, onSuccess }: EditCategoryModalProps) {
    const [form, setForm] = useState<CategoryFormState>({
        name_en: category?.name_en ?? "",
        name_de: category?.name_de ?? "",
        icon: category?.icon ?? "🔧",
        color: category?.color ?? "#0066ff",
        min_price: category ? parseFloat(category.min_price).toString() : "0",
        max_price: category ? parseFloat(category.max_price).toString() : "0",
    });
    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    if (!category) return null;

    const handleChange = (field: keyof CategoryFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name_en.trim()) {
            toast.error("English name is required.");
            return;
        }
        try {
            await updateCategory({
                id: category.id,
                categoryData: {
                    name_en: form.name_en.trim(),
                    name_de: form.name_de.trim(),
                    icon: form.icon,
                    color: form.color,
                    min_price: parseFloat(form.min_price) || 0,
                    max_price: parseFloat(form.max_price) || 0,
                },
            }).unwrap();
            toast.success("Category updated successfully!");
            onSuccess();
            onClose();
        } catch {
            toast.error("Failed to update category. Please try again.");
        }
    };

    return (
        <CategoryFormModal
            title="Edit Category"
            form={form}
            isLoading={isLoading}
            submitLabel="Save Changes"
            onClose={onClose}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteConfirmModalProps {
    category: Category | null;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteConfirmModal({ category, isLoading, onClose, onConfirm }: DeleteConfirmModalProps) {
    if (!category) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                {/* Text */}
                <div className="text-center">
                    <h2 className="text-base font-semibold text-gray-900">Delete Category</h2>
                    <p className="text-sm text-gray-500 mt-1.5">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-gray-800">{category.name_en}</span>?
                        This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-semibold text-white transition cursor-pointer"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Category Card ────────────────────────────────────────────────────────────

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                >
                    {category.icon}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(category)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-900 text-base">{category.name_en}</h3>
                {category.name_de && (
                    <p className="text-gray-400 text-sm mt-0.5 text-right" dir="rtl">
                        {category.name_de}
                    </p>
                )}
                <span
                    className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        category.is_active
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-400"
                    }`}
                >
                    {category.is_active ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Price Range</span>
                <span className="font-medium text-sm" style={{ color: category.color }}>
                    ₪{parseFloat(category.min_price).toFixed(0)}–₪{parseFloat(category.max_price).toFixed(0)}
                </span>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CategoryManagement() {
    const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const handleDeleteConfirm = async () => {
        if (!deletingCategory) return;
        try {
            await deleteCategory(deletingCategory.id).unwrap();
            toast.success(`"${deletingCategory.name_en}" deleted successfully.`);
            setDeletingCategory(null);
            refetch();
        } catch {
            toast.error("Failed to delete category. Please try again.");
        }
    };



    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading categories...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <p className="text-red-400 text-sm">Failed to load categories.</p>
            </div>
        );
    }

    return (
        <>
            <AddCategoryModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={refetch}
            />

            <EditCategoryModal
                key={editingCategory?.id ?? "edit"}
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                onSuccess={refetch}
            />

            <DeleteConfirmModal
                category={deletingCategory}
                isLoading={isDeleting}
                onClose={() => setDeletingCategory(null)}
                onConfirm={handleDeleteConfirm}
            />

            <div className="min-h-screen bg-gray-50 p-8">
                <div className="w-full">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Category Management</h1>

                    <div className="flex items-center justify-between mb-6">
                        <span className="text-gray-400 text-sm">{categories.length} categories</span>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 transition-colors text-gray-900 font-medium px-5 py-2.5 rounded-xl text-sm cursor-pointer"
                        >
                            <span className="text-lg leading-none">+</span>
                            Add Category
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category: Category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onEdit={setEditingCategory}
                                onDelete={(id) => setDeletingCategory(categories.find((c: Category) => c.id === id) ?? null)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}