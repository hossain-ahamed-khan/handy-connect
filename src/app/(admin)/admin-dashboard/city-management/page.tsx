"use client";
import Image from "next/image";
import { useState } from "react";
import { useGetAllCitiesQuery, useGetCityDetailsQuery, useAddNewCityMutation, useUpdateCityMutation, useDeleteCityMutation } from "@/redux/features/admin/cityManagement/cityManagementApi";
import { toast } from "sonner"; // or wherever your toast comes from

// ─── API shapes ────────────────────────────────────────────────────────────────

interface CityListItem {
    id: number;
    name: string;
    country: string;
    hero_image_url: string | null;
    secondary_image_url: string | null;
}

interface CityDetail {
    id: number;
    name: string;
    country: string;
    description: string;
    hero_image_url: string | null;
    secondary_image_url: string | null;
    highlights: string;
    neighborhoods: string;
    highlight_list: string[];
    neighborhood_list: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface CityPayload {
    name: string;
    country: string;
    description: string;
    hero_image_url: string;
    secondary_image_url: string;
    highlights: string;
    neighborhoods: string;
}

// ─── helpers ───────────────────────────────────────────────────────────────────

const EMPTY_PAYLOAD: CityPayload = {
    name: "",
    country: "",
    description: "",
    hero_image_url: "",
    secondary_image_url: "",
    highlights: "",
    neighborhoods: "",
};

function toPayload(detail: CityDetail): CityPayload {
    return {
        name: detail.name,
        country: detail.country,
        description: detail.description,
        hero_image_url: detail.hero_image_url ?? "",
        secondary_image_url: detail.secondary_image_url ?? "",
        highlights: detail.highlights,
        neighborhoods: detail.neighborhoods,
    };
}

// ─── sub-components ────────────────────────────────────────────────────────────

function EditableField({
    label,
    value,
    onChange,
    multiline = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    multiline?: boolean;
}) {
    const base =
        "border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full";
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">{label}</label>
            {multiline ? (
                <textarea
                    className={`${base} resize-none`}
                    rows={3}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input className={base} value={value} onChange={(e) => onChange(e.target.value)} />
            )}
        </div>
    );
}

function ReadonlyField({
    label,
    value,
    multiline = false,
}: {
    label: string;
    value: string;
    multiline?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">{label}</label>
            <div
                className={`border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white ${multiline ? "min-h-18 whitespace-pre-wrap" : ""
                    }`}
            >
                {value || <span className="text-gray-300 italic">—</span>}
            </div>
        </div>
    );
}

// ─── main component ────────────────────────────────────────────────────────────

export default function CityManagement() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<CityPayload>(EMPTY_PAYLOAD);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCity, setNewCity] = useState<CityPayload>(EMPTY_PAYLOAD);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

    // ── queries / mutations ──
    const {
        data: cities = [],
        isLoading: citiesLoading,
        refetch: refetchCities,
    } = useGetAllCitiesQuery(undefined);

    const activeId = selectedId ?? cities[0]?.id ?? null;

    const {
        data: cityDetail,
        isFetching: detailFetching,
        refetch: refetchCityDetail,
    } = useGetCityDetailsQuery(activeId, {
        skip: activeId === null,
    });

    const [addNewCity, { isLoading: adding }] = useAddNewCityMutation();
    const [updateCity, { isLoading: updating }] = useUpdateCityMutation();
    const [deleteCity] = useDeleteCityMutation();

    // ── handlers ──
    const handleSelectCity = (id: number) => {
        setSelectedId(id);
        setIsEditing(false);
    };

    const handleStartEdit = () => {
        if (cityDetail) {
            setEditForm(toPayload(cityDetail));
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!cityDetail) return;
        try {
            await updateCity({ cityId: cityDetail.id, cityInfo: editForm }).unwrap();
            setIsEditing(false);
            refetchCities();
            refetchCityDetail();
            toast.success(`${editForm.name} updated successfully.`);
        } catch {
            toast.error("Failed to update city. Please try again.");
        }
    };

    const handleRequestDelete = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setPendingDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async (id: number) => {
        const city = cities.find((c: CityListItem) => c.id === id);
        try {
            await deleteCity(id).unwrap();
            if (activeId === id) setSelectedId(null);
            refetchCities();
            toast.success(`${city?.name ?? "City"} deleted.`);
        } catch {
            toast.error("Failed to delete city. Please try again.");
        }
    };

    const handleConfirmDelete = async () => {
        if (pendingDeleteId === null) return;
        await handleDelete(pendingDeleteId);
        setShowDeleteModal(false);
        setPendingDeleteId(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setPendingDeleteId(null);
    };

    const handleAdd = async () => {
        try {
            const created = await addNewCity(newCity).unwrap();
            setSelectedId(created.id);
            setShowAddModal(false);
            setNewCity(EMPTY_PAYLOAD);
            refetchCities();
            refetchCityDetail();
            toast.success(`${created.name} added successfully.`);
        } catch {
            toast.error("Failed to add city. Please try again.");
        }
    };

    // ─── render ───────────────────────────────────────────────────────────────────

    const displayed = isEditing ? editForm : cityDetail ? toPayload(cityDetail) : null;
    const pendingCityName = pendingDeleteId
        ? cities.find((c: CityListItem) => c.id === pendingDeleteId)?.name
        : undefined;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">City Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Add, edit, or remove cities from the platform.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                    <span className="text-lg leading-none">+</span>
                    Add New City
                </button>
            </div>

            <div className="flex gap-4 items-start">
                {/* Sidebar */}
                <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-100 p-4 shrink-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Active Cities
                    </p>

                    {citiesLoading ? (
                        <div className="flex flex-col gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {cities.map((city: CityListItem) => (
                                <div
                                    key={city.id}
                                    onClick={() => handleSelectCity(city.id)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer group transition-colors ${activeId === city.id
                                        ? "bg-yellow-50 border border-yellow-300"
                                        : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {city.hero_image_url ? (
                                            <Image
                                                src={city.hero_image_url}
                                                alt={city.name}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 text-yellow-700 font-bold text-xs">
                                                {city.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p
                                                className={`text-sm font-medium leading-tight truncate ${activeId === city.id ? "text-yellow-700" : "text-gray-800"
                                                    }`}
                                            >
                                                {city.name}
                                            </p>
                                            <p className="text-xs text-gray-400">{city.country}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleRequestDelete(city.id, e)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-0.5 shrink-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14H6L5 6" />
                                            <path d="M10 11v6M14 11v6" />
                                            <path d="M9 6V4h6v2" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {cities.length === 0 && !citiesLoading ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-64">
                        <p className="text-gray-400 text-sm">No cities available</p>
                    </div>
                ) : detailFetching || !displayed ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {/* Panel header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-gray-900">
                                Viewing: {cityDetail?.name}
                            </h2>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={updating}
                                        className="text-sm px-4 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-semibold transition-colors"
                                    >
                                        {updating ? "Saving…" : "Save"}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleStartEdit}
                                    className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Edit Details
                                </button>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="mb-6">
                            <SectionHeading icon="table" label="Basic Information" />
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {isEditing ? (
                                    <>
                                        <EditableField label="City Name" value={editForm.name} onChange={(v) => setEditForm((f) => ({ ...f, name: v }))} />
                                        <EditableField label="Country" value={editForm.country} onChange={(v) => setEditForm((f) => ({ ...f, country: v }))} />
                                    </>
                                ) : (
                                    <>
                                        <ReadonlyField label="City Name" value={displayed.name} />
                                        <ReadonlyField label="Country" value={displayed.country} />
                                    </>
                                )}
                            </div>
                            {isEditing ? (
                                <EditableField label="Description" value={editForm.description} onChange={(v) => setEditForm((f) => ({ ...f, description: v }))} multiline />
                            ) : (
                                <ReadonlyField label="Description" value={displayed.description} multiline />
                            )}
                        </div>

                        {/* Media */}
                        <div className="mb-6">
                            <SectionHeading icon="image" label="Media" />
                            <div className="flex flex-col gap-3">
                                {isEditing ? (
                                    <EditableField label="Hero Image URL" value={editForm.hero_image_url} onChange={(v) => setEditForm((f) => ({ ...f, hero_image_url: v }))} />
                                ) : (
                                    <ReadonlyField label="Hero Image URL" value={displayed.hero_image_url} />
                                )}
                                {displayed.hero_image_url && (
                                    <Image
                                        src={displayed.hero_image_url}
                                        alt="Hero"
                                        width={1200}
                                        height={480}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                )}
                                {isEditing ? (
                                    <EditableField label="Secondary Image URL" value={editForm.secondary_image_url} onChange={(v) => setEditForm((f) => ({ ...f, secondary_image_url: v }))} />
                                ) : (
                                    <ReadonlyField label="Secondary Image URL" value={displayed.secondary_image_url} />
                                )}
                            </div>
                        </div>

                        {/* Details & Neighborhoods */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Details & Neighborhoods</p>
                            <div className="flex flex-col gap-3">
                                {isEditing ? (
                                    <>
                                        <EditableField label="Highlights (Comma separated)" value={editForm.highlights} onChange={(v) => setEditForm((f) => ({ ...f, highlights: v }))} multiline />
                                        <EditableField label="Neighborhoods (Comma separated)" value={editForm.neighborhoods} onChange={(v) => setEditForm((f) => ({ ...f, neighborhoods: v }))} multiline />
                                    </>
                                ) : (
                                    <>
                                        <ReadonlyField label="Highlights (Comma separated)" value={displayed.highlights} multiline />
                                        <ReadonlyField label="Neighborhoods (Comma separated)" value={displayed.neighborhoods} multiline />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add City Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Add New City</h3>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <EditableField label="City Name" value={newCity.name} onChange={(v) => setNewCity((f) => ({ ...f, name: v }))} />
                                <EditableField label="Country" value={newCity.country} onChange={(v) => setNewCity((f) => ({ ...f, country: v }))} />
                            </div>
                            <EditableField label="Description" value={newCity.description} onChange={(v) => setNewCity((f) => ({ ...f, description: v }))} multiline />
                            <EditableField label="Hero Image URL" value={newCity.hero_image_url} onChange={(v) => setNewCity((f) => ({ ...f, hero_image_url: v }))} />
                            <EditableField label="Secondary Image URL" value={newCity.secondary_image_url} onChange={(v) => setNewCity((f) => ({ ...f, secondary_image_url: v }))} />
                            <EditableField label="Highlights (Comma separated)" value={newCity.highlights} onChange={(v) => setNewCity((f) => ({ ...f, highlights: v }))} multiline />
                            <EditableField label="Neighborhoods (Comma separated)" value={newCity.neighborhoods} onChange={(v) => setNewCity((f) => ({ ...f, neighborhoods: v }))} multiline />
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={() => { setShowAddModal(false); setNewCity(EMPTY_PAYLOAD); }}
                                className="flex-1 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={!newCity.name || !newCity.country || adding}
                                className="flex-1 text-sm px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold transition-colors"
                            >
                                {adding ? "Adding…" : "Add City"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Delete City</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete {pendingCityName ?? "this city"}? This action cannot be undone.
                        </p>
                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 text-sm px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── tiny icon helper ──────────────────────────────────────────────────────────

function SectionHeading({ icon, label }: { icon: "table" | "image"; label: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            {icon === "table" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            )}
            <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
    );
}