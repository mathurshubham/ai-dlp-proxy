"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface FilterToolbarProps {
    onSearch: (userId: string) => void;
    onStatusChange: (status: string) => void;
    onEntityTypeChange: (entityType: string) => void;
    onClear: () => void;
}

export default function FilterToolbar({ onSearch, onStatusChange, onEntityTypeChange, onClear }: FilterToolbarProps) {
    const [userId, setUserId] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(userId);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border mb-6 shadow-sm">
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by User ID..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all dark:text-slate-200"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm py-2 pl-3 pr-8 focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer dark:text-slate-200"
                >
                    <option value="">All Statuses</option>
                    <option value="SUCCESS">Success</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="ERROR">Error</option>
                </select>

                <select
                    onChange={(e) => onEntityTypeChange(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm py-2 pl-3 pr-8 focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer dark:text-slate-200"
                >
                    <option value="">All Entities</option>
                    <option value="PERSON">Person</option>
                    <option value="EMAIL_ADDRESS">Email</option>
                    <option value="PHONE_NUMBER">Phone</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                </select>

                <button
                    onClick={() => {
                        setUserId("");
                        onClear();
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Clear Filters"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
