"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { X, Settings, AlertCircle } from "lucide-react";

interface PolicySettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PolicySettingsModal({ isOpen, onClose }: PolicySettingsModalProps) {
    const [threshold, setThreshold] = useState(0.8);
    const [detectors, setDetectors] = useState({
        email: true,
        phone: true,
        ssn: true,
        creditCard: true
    });

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="px-6 py-6 border-b dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Settings className="h-5 w-5" />
                                        </div>
                                        <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-slate-50">
                                            Security Policy
                                        </Dialog.Title>
                                    </div>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-8">
                                    {/* Threshold Slider */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                                                Block Threshold
                                            </label>
                                            <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {threshold.toFixed(2)}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={threshold}
                                            onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <p className="mt-2 text-xs text-slate-400">
                                            Requests with a risk score above this value will be automatically blocked.
                                        </p>
                                    </div>

                                    {/* Detector Toggles */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wider block mb-4">
                                            Active Detectors
                                        </label>

                                        {Object.entries(detectors).map(([key, enabled]) => (
                                            <div key={key} className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <Switch
                                                    checked={enabled}
                                                    onChange={(val) => setDetectors(prev => ({ ...prev, [key]: val }))}
                                                    className={`${enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                                                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                                                >
                                                    <span
                                                        className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                    />
                                                </Switch>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-xl flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                                            Changes to security policies are logged in the audit trail and affect all incoming traffic in real-time.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
