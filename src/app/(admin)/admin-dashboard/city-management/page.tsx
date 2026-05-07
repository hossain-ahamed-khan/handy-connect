"use client";
import Image from "next/image";
import { useState } from "react";

interface City {
    id: number;
    name: string;
    country: string;
    imageUrl: string;
    description: string;
    heroImageUrl: string;
    secondaryImageUrl: string;
    highlights: string;
    neighborhoods: string;
}

type StringKeys<T> = {
    [K in keyof T]-?: T[K] extends string ? K : never;
}[keyof T];

const defaultCities: City[] = [
    {
        id: 1,
        name: "Berlin",
        country: "Germany",
        imageUrl:
            "https://placehold.co/80x80/png?text=City",
        description:
            "Find top-rated, verified home service professionals across Berlin. From quick plumbing fixes in Mitte to full electrical installations in Kreuzberg, our local experts are ready to help.",
        heroImageUrl:
            "https://placehold.co/2000x800/png?text=Hero+Image",
        secondaryImageUrl:
            "https://placehold.co/1000x600/png?text=Secondary+Image",
        highlights:
            "Over 500 verified professionals in the Berlin metropolitan area, Average arrival time of under 45 minutes for emergencies, All services backed by our €10,000 Handy Connect Guarantee, English and German speaking professionals available",
        neighborhoods:
            "Mitte, Kreuzberg, Prenzlauer Berg, Friedrichshain, Charlottenburg, Neukölln, Schöneberg",
    },
    {
        id: 2,
        name: "Munich",
        country: "Germany",
        imageUrl:
            "https://placehold.co/80x80/png?text=City",
        description:
            "Connect with trusted home service experts throughout Munich. From Schwabing to Maxvorstadt, our professionals deliver quality work every time.",
        heroImageUrl:
            "https://placehold.co/2000x800/png?text=Hero+Image",
        secondaryImageUrl:
            "https://placehold.co/1000x600/png?text=Secondary+Image",
        highlights:
            "Over 300 verified professionals in the Munich area, Same-day service available for urgent requests, All services backed by our €10,000 Handy Connect Guarantee",
        neighborhoods:
            "Schwabing, Maxvorstadt, Glockenbachviertel, Haidhausen, Neuhausen",
    },
    {
        id: 3,
        name: "Hamburg",
        country: "Germany",
        imageUrl:
            "https://placehold.co/80x80/png?text=City",
        description:
            "Discover reliable home service professionals across Hamburg. From Altona to Eimsbüttel, our vetted experts are ready to assist.",
        heroImageUrl:
            "https://placehold.co/2000x800/png?text=Hero+Image",
        secondaryImageUrl:
            "https://placehold.co/1000x600/png?text=Secondary+Image",
        highlights:
            "Over 400 verified professionals in Hamburg, Fast response times across all districts, Fully insured and background-checked professionals",
        neighborhoods: "Altona, Eimsbüttel, HafenCity, Blankenese, Wandsbek",
    },
];

export default function CityManagement() {
    const [cities, setCities] = useState<City[]>(defaultCities);
    const [selectedCity, setSelectedCity] = useState<City>(defaultCities[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<City>(defaultCities[0]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCity, setNewCity] = useState<Omit<City, "id">>({
        name: "",
        country: "",
        imageUrl: "",
        description: "",
        heroImageUrl: "",
        secondaryImageUrl: "",
        highlights: "",
        neighborhoods: "",
    });

    const handleSelectCity = (city: City) => {
        setSelectedCity(city);
        setEditForm(city);
        setIsEditing(false);
    };

    const handleDeleteCity = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = cities.filter((c) => c.id !== id);
        setCities(updated);
        if (selectedCity.id === id && updated.length > 0) {
            setSelectedCity(updated[0]);
            setEditForm(updated[0]);
        }
    };

    const handleEditSave = () => {
        const updated = cities.map((c) => (c.id === editForm.id ? editForm : c));
        setCities(updated);
        setSelectedCity(editForm);
        setIsEditing(false);
    };

    const handleAddCity = () => {
        const id = Date.now();
        const city: City = { id, ...newCity };
        setCities([...cities, city]);
        setSelectedCity(city);
        setEditForm(city);
        setShowAddModal(false);
        setNewCity({
            name: "",
            country: "",
            imageUrl: "",
            description: "",
            heroImageUrl: "",
            secondaryImageUrl: "",
            highlights: "",
            neighborhoods: "",
        });
    };

    const field = <T, K extends StringKeys<T>>(
        label: string,
        key: K,
        form: T,
        setForm: React.Dispatch<React.SetStateAction<T>>,
        multiline = false
    ) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">{label}</label>
            {multiline ? (
                <textarea
                    className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    rows={3}
                    value={form[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value } as T)}
                />
            ) : (
                <input
                    className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={form[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value } as T)}
                />
            )}
        </div>
    );

    const readonlyField = (label: string, value: string, multiline = false) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">{label}</label>
            {multiline ? (
                <div className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white min-h-[72px] whitespace-pre-wrap">
                    {value}
                </div>
            ) : (
                <div className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                    {value}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">City Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Add, edit, or remove cities from the platform.
                    </p>
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
                <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Active Cities
                    </p>
                    <div className="flex flex-col gap-1">
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                onClick={() => handleSelectCity(city)}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer group transition-colors ${selectedCity.id === city.id
                                    ? "bg-yellow-50 border border-yellow-300"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Image
                                        src={city.imageUrl}
                                        alt={city.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://placehold.co/80x80/png?text=City";
                                        }}
                                    />
                                    <div>
                                        <p
                                            className={`text-sm font-medium leading-tight ${selectedCity.id === city.id
                                                ? "text-yellow-700"
                                                : "text-gray-800"
                                                }`}
                                        >
                                            {city.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{city.country}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteCity(city.id, e)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-0.5"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14H6L5 6" />
                                        <path d="M10 11v6M14 11v6" />
                                        <path d="M9 6V4h6v2" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail Panel */}
                {cities.length > 0 ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-gray-900">
                                Viewing: {selectedCity.name}
                            </h2>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditSave}
                                        className="text-sm px-4 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Edit Details
                                </button>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-gray-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="M3 9h18M9 21V9" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">
                                    Basic Information
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {isEditing ? (
                                    <>
                                        {field("City Name", "name", editForm, setEditForm)}
                                        {field("Country", "country", editForm, setEditForm)}
                                    </>
                                ) : (
                                    <>
                                        {readonlyField("City Name", selectedCity.name)}
                                        {readonlyField("Country", selectedCity.country)}
                                    </>
                                )}
                            </div>
                            {isEditing
                                ? field(
                                    "Description",
                                    "description",
                                    editForm,
                                    setEditForm,
                                    true
                                )
                                : readonlyField("Description", selectedCity.description, true)}
                        </div>

                        {/* Media */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-gray-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">
                                    Media
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {isEditing
                                    ? field(
                                        "Hero Image URL",
                                        "heroImageUrl",
                                        editForm,
                                        setEditForm
                                    )
                                    : readonlyField("Hero Image URL", selectedCity.heroImageUrl)}
                                <Image
                                    src={selectedCity.heroImageUrl}
                                    alt="Hero"
                                    width={1200}
                                    height={480}
                                    className="w-full h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                                {isEditing
                                    ? field(
                                        "Secondary Image URL",
                                        "secondaryImageUrl",
                                        editForm,
                                        setEditForm
                                    )
                                    : readonlyField(
                                        "Secondary Image URL",
                                        selectedCity.secondaryImageUrl
                                    )}
                            </div>
                        </div>

                        {/* Details & Neighborhoods */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Details & Neighborhoods
                            </p>
                            <div className="flex flex-col gap-3">
                                {isEditing ? (
                                    <>
                                        {field(
                                            "Highlights (Comma separated)",
                                            "highlights",
                                            editForm,
                                            setEditForm,
                                            true
                                        )}
                                        {field(
                                            "Neighborhoods (Comma separated)",
                                            "neighborhoods",
                                            editForm,
                                            setEditForm,
                                            true
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {readonlyField(
                                            "Highlights (Comma separated)",
                                            selectedCity.highlights,
                                            true
                                        )}
                                        {readonlyField(
                                            "Neighborhoods (Comma separated)",
                                            selectedCity.neighborhoods,
                                            true
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-64">
                        <p className="text-gray-400 text-sm">No cities available</p>
                    </div>
                )}
            </div>

            {/* Add City Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Add New City
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {field("City Name", "name", newCity, setNewCity)}
                                {field("Country", "country", newCity, setNewCity)}
                            </div>
                            {field("Description", "description", newCity, setNewCity, true)}
                            {field("Hero Image URL", "heroImageUrl", newCity, setNewCity)}
                            {field(
                                "Secondary Image URL",
                                "secondaryImageUrl",
                                newCity,
                                setNewCity
                            )}
                            {field(
                                "Highlights (Comma separated)",
                                "highlights",
                                newCity,
                                setNewCity,
                                true
                            )}
                            {field(
                                "Neighborhoods (Comma separated)",
                                "neighborhoods",
                                newCity,
                                setNewCity,
                                true
                            )}
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCity}
                                disabled={!newCity.name || !newCity.country}
                                className="flex-1 text-sm px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold transition-colors"
                            >
                                Add City
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}