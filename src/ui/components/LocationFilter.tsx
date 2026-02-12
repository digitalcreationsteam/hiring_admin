// src/components/LocationFilter.tsx
// Reusable Location Filter Component

import React, { useEffect, useState } from "react";
import { FeatherMapPin, FeatherLoader } from "@subframe/core";
import API from "../../common/API";
import { URL_PATH } from "../../common/API";
import { colors } from "../../common/colors";

interface LocationFilterProps {
    onFilterChange?: (data: any) => void;
    showResults?: boolean;
}

export default function LocationFilter({ onFilterChange, showResults = true }: LocationFilterProps) {
    const [countries, setCountries] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedState, setSelectedState] = useState<string>("");
    const [locationStats, setLocationStats] = useState<any>(null);

    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingLocationStats, setLoadingLocationStats] = useState(false);

    // ===============================
    // FETCH COUNTRIES
    // ===============================
    useEffect(() => {
        (async () => {
            try {
                setLoadingCountries(true);
                const res = await API("GET", URL_PATH.getAllCountries);

                if (res?.success && Array.isArray(res?.data)) {
                    setCountries(res.data);
                    if (res.data.length > 0) {
                        setSelectedCountry(res.data[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch countries:", err);
                setCountries([]);
            } finally {
                setLoadingCountries(false);
            }
        })();
    }, []);

    // ===============================
    // FETCH STATES WHEN COUNTRY CHANGES
    // ===============================
    useEffect(() => {
        if (!selectedCountry) return;

        (async () => {
            try {
                setLoadingStates(true);
                setSelectedState("");

                const res = await API("GET", URL_PATH.getStatesByCountry, {
                    country: selectedCountry
                });

                if (res?.success && Array.isArray(res?.data)) {
                    setStates(res.data);
                    if (res.data.length > 0) {
                        setSelectedState(res.data[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch states:", err);
                setStates([]);
            } finally {
                setLoadingStates(false);
            }
        })();
    }, [selectedCountry]);

    // ===============================
    // FETCH USER COUNT BY LOCATION
    // ===============================
    useEffect(() => {
        if (!selectedCountry || !selectedState) return;

        (async () => {
            try {
                setLoadingLocationStats(true);

                const res = await API("GET", URL_PATH.getUsersByLocation, {
                    country: selectedCountry,
                    state: selectedState
                });

                if (res?.success && res?.data) {
                    setLocationStats(res.data);
                    if (onFilterChange) {
                        onFilterChange(res.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch location stats:", err);
                setLocationStats(null);
            } finally {
                setLoadingLocationStats(false);
            }
        })();
    }, [selectedCountry, selectedState]);

    return (
        <div
            className="rounded-xl p-6 border"
            style={{
                background: colors.surface,
                borderColor: colors.border,
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <FeatherMapPin
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                />
                <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                    Filter Users by Location
                </h3>
            </div>

            {/* Filter Controls - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Country Select */}
                <div className="flex flex-col">
                    <label
                        className="text-sm font-medium mb-2"
                        style={{ color: colors.textPrimary }}
                    >
                        Country
                    </label>
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        disabled={loadingCountries}
                        className="px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors"
                        style={{
                            borderColor: colors.border,
                            background: colors.background,
                            color: colors.textPrimary,
                            opacity: loadingCountries ? 0.6 : 1,
                            cursor: loadingCountries ? "not-allowed" : "pointer",
                        }}
                    >
                        <option value="">
                            {loadingCountries ? "Loading countries..." : "Select a country"}
                        </option>
                        {countries.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                {/* State Select */}
                <div className="flex flex-col">
                    <label
                        className="text-sm font-medium mb-2"
                        style={{ color: colors.textPrimary }}
                    >
                        State/Region
                    </label>
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        disabled={loadingStates || !selectedCountry}
                        className="px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors"
                        style={{
                            borderColor: colors.border,
                            background: colors.background,
                            color: colors.textPrimary,
                            opacity: loadingStates || !selectedCountry ? 0.6 : 1,
                            cursor: loadingStates || !selectedCountry ? "not-allowed" : "pointer",
                        }}
                    >
                        <option value="">
                            {loadingStates ? "Loading states..." : "Select a state"}
                        </option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Location Stats - Show only when both are selected */}
            {showResults && selectedCountry && selectedState && (
                <div
                    className="pt-6 border-t"
                    style={{ borderColor: colors.border }}
                >
                    <p
                        className="text-sm font-medium mb-4"
                        style={{ color: colors.textSecondary }}
                    >
                        Users from <span style={{ color: colors.primary }}>{selectedState}, {selectedCountry}</span>
                    </p>

                    {loadingLocationStats ? (
                        <div className="flex items-center justify-center py-8">
                            <FeatherLoader
                                className="w-5 h-5 animate-spin mr-2"
                                style={{ color: colors.primary }}
                            />
                            <span className="text-sm" style={{ color: colors.textTertiary }}>
                                Loading statistics...
                            </span>
                        </div>
                    ) : locationStats ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Total Users Card */}
                            <div
                                className="rounded-lg p-4 text-center border"
                                style={{
                                    background: `${colors.primary}10`,
                                    borderColor: `${colors.primary}30`,
                                }}
                            >
                                <p
                                    className="text-xs font-medium uppercase tracking-wide mb-2"
                                    style={{ color: colors.textSecondary }}
                                >
                                    Total Users
                                </p>
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: colors.primary }}
                                >
                                    {locationStats.count}
                                </p>
                            </div>

                            {/* Students Card */}
                            <div
                                className="rounded-lg p-4 text-center border"
                                style={{
                                    background: `${colors.secondary}10`,
                                    borderColor: `${colors.secondary}30`,
                                }}
                            >
                                <p
                                    className="text-xs font-medium uppercase tracking-wide mb-2"
                                    style={{ color: colors.textSecondary }}
                                >
                                    Students
                                </p>
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: colors.secondary }}
                                >
                                    {locationStats.students}
                                </p>
                            </div>

                            {/* Recruiters Card */}
                            <div
                                className="rounded-lg p-4 text-center border"
                                style={{
                                    background: `${colors.success}10`,
                                    borderColor: `${colors.success}30`,
                                }}
                            >
                                <p
                                    className="text-xs font-medium uppercase tracking-wide mb-2"
                                    style={{ color: colors.textSecondary }}
                                >
                                    Recruiters
                                </p>
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: colors.success }}
                                >
                                    {locationStats.recruiters}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="rounded-lg p-6 text-center"
                            style={{ background: colors.background }}
                        >
                            <p style={{ color: colors.textTertiary }}>
                                No data available for this location
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
