import { Fragment, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import { X, Shield, Clock, User, Fingerprint, Eye } from "lucide-react";

interface AuditLog {
    id: number;
    request_id: string;
    user_id: string;
    timestamp: string;
    risk_score: number;
    entity_types: string[];
    latency_ms: number;
    status: string;
}

interface LogDetailSheetProps {
    isOpen: boolean;
    onClose: () => void;
    log: AuditLog | null;
}

export default function LogDetailSheet({ isOpen, onClose, log }: LogDetailSheetProps) {
    const [revealedData, setRevealedData] = useState<Record<string, string> | null>(null);
    const [isRevealing, setIsRevealing] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setRevealedData(null);
            setIsRevealing(false);
        }
    }, [isOpen]);

    const handleReveal = async () => {
        if (!log) return;
        setIsRevealing(true);
        try {
            const res = await fetch(`http://localhost:8000/api/v1/reveal/${log.request_id}`);
            if (res.ok) {
                const data = await res.json();
                setRevealedData(data);
            }
        } catch (err) {
            console.error("Reveal Error:", err);
        } finally {
            setIsRevealing(false);
        }
    };

    const handleDownloadReport = () => {
        window.print();
    };

    if (!log) return null;

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 print:hidden" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-slate-900 shadow-2xl">
                                        <div className="px-6 py-6 border-b dark:border-slate-800">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                                    <Fingerprint className="h-6 w-6 text-primary" />
                                                    Request Details
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md text-slate-400 hover:text-slate-500 focus:outline-none"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <X className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative mt-2 flex-1 px-6 pb-6">
                                            <div className="space-y-6 pt-4">
                                                {/* Status & Risk */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                        <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">{log.status}</p>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Score</p>
                                                        <p className="text-base font-semibold text-rose-600 dark:text-rose-400">{log.risk_score.toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                {/* Metadata */}
                                                <div className="space-y-3">
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 border-b dark:border-slate-800 pb-2">Context</h3>
                                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                        <User className="h-4 w-4" />
                                                        <span>User: {log.user_id || "ANONYMOUS"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">
                                                        <Shield className="h-4 w-4" />
                                                        <span>RID: {log.request_id || "N/A"}</span>
                                                    </div>
                                                </div>

                                                {/* Redacted Data */}
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 border-b dark:border-slate-800 pb-2 mb-3">Detected Entities</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {log.entity_types.map((type: string) => (
                                                            <span key={type} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* PII Reveal Section */}
                                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">PII Rehydration Map</h3>
                                                        <button
                                                            onClick={handleReveal}
                                                            disabled={isRevealing || revealedData !== null}
                                                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isRevealing ? "DE-CRYPTING..." : revealedData ? "REVEALED" : "REVEAL MAPPING"}
                                                            {!revealedData && !isRevealing && <Eye className="h-3 w-3" />}
                                                        </button>
                                                    </div>

                                                    {revealedData ? (
                                                        <div className="space-y-2">
                                                            {Object.entries(revealedData).map(([token, value]) => (
                                                                <div key={token} className="flex items-center justify-between group">
                                                                    <span className="text-xs font-mono text-slate-500">{token}</span>
                                                                    <span className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-slate-500 leading-relaxed font-mono italic">
                                                            PII values are hashed and stored in the secure vault. Click reveal to de-crypt using standard root credentials.
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-6">
                                                    <button
                                                        onClick={handleDownloadReport}
                                                        className="w-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                                                    >
                                                        Audit Trail Report
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Print Handling Styles */}
            <style type="text/css" media="print">
                {`
                    @page { size: A4; margin: 0; }
                    html, body { margin: 0; padding: 0; height: auto; }
                    /* Hide the main app content completely to remove it from flow */
                    #app-root { display: none !important; }
                    
                    /* Ensure print content is visible and positioned correctly */
                    .print-content { 
                        display: block !important;
                        visibility: visible !important; 
                        position: absolute; 
                        top: 0; 
                        left: 0; 
                        width: 100%;
                        height: 100%;
                        z-index: 9999;
                        background: white;
                    }
                `}
            </style>

            {/* Print-Only Layout - Portaled to Body to escape #app-root display:none */}
            {typeof window !== "undefined" && createPortal(
                <div className="print-content hidden print:block absolute top-0 left-0 w-full min-h-screen bg-white z-[9999] p-[10mm]">
                    <div className="max-w-[210mm] mx-auto space-y-8">
                        {/* Header */}
                        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Audit Trail Report</h1>
                                <p className="text-slate-500 mt-1">Generated by Sentinel AI Privacy Proxy</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono text-slate-400">RID: {log.request_id}</p>
                            </div>
                        </div>

                        {/* Status Overview */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-xl font-bold text-slate-900">{log.status}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Score</p>
                                <p className="text-xl font-bold text-slate-900">{log.risk_score.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Metadata Table */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">Session Metadata</h3>
                            <table className="w-full text-left text-sm">
                                <tbody>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-2 text-slate-500 font-medium w-1/3">Timestamp</th>
                                        <td className="py-2 text-slate-900">{new Date(log.timestamp).toLocaleString()}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-2 text-slate-500 font-medium">User ID</th>
                                        <td className="py-2 text-slate-900">{log.user_id || "ANONYMOUS"}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-2 text-slate-500 font-medium">Latency</th>
                                        <td className="py-2 text-slate-900">{log.latency_ms}ms</td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 text-slate-500 font-medium">Detected Entities</th>
                                        <td className="py-2 text-slate-900">{log.entity_types.join(", ") || "None"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* PII Map (if revealed) */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">PII Rehydration Map</h3>
                            {revealedData ? (
                                <table className="w-full text-left text-sm border border-slate-200 rounded-lg overflow-hidden">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="py-2 px-4 border-b border-slate-200 font-medium text-slate-500">Token</th>
                                            <th className="py-2 px-4 border-b border-slate-200 font-medium text-slate-500">Original Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(revealedData).map(([token, value]) => (
                                            <tr key={token} className="border-b border-slate-100 last:border-0">
                                                <td className="py-2 px-4 font-mono text-slate-600">{token}</td>
                                                <td className="py-2 px-4 font-mono text-slate-900 font-bold bg-yellow-50">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded text-slate-500 text-sm italic">
                                    PII data was not revealed in this session.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-200 pt-8 mt-12 text-center">
                            <p className="text-xs text-slate-400">Values marked as SENSITIVE are strictly confidential.</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </Transition.Root>
    );
}
