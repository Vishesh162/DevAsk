"use client";

import { motion } from "framer-motion";
import { MagicCard } from "@/components/magicui/magic-card";
import React from "react";

// Reusable scroll-reveal wrapper
const FadeUp = ({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

// Stats bar data
const stats = [
    { label: "Questions", value: "10K+", color: "from-violet-400 to-violet-600" },
    { label: "Answers", value: "45K+", color: "from-cyan-400 to-cyan-600" },
    { label: "Developers", value: "5K+", color: "from-fuchsia-400 to-fuchsia-600" },
    { label: "Solutions", value: "98%", color: "from-emerald-400 to-emerald-600" },
];

export function AnimatedStatsBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4"
        >
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/20 transition-colors"
                >
                    <span className={`text-3xl font-extrabold bg-gradient-to-b ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                    </span>
                    <span className="text-zinc-400 text-sm mt-1 font-medium">{stat.label}</span>
                </motion.div>
            ))}
        </motion.div>
    );
}

export function AnimatedSectionHeading() {
    return (
        <FadeUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-tight text-white drop-shadow-md">
                The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500">
                    Community
                </span>
            </h2>
        </FadeUp>
    );
}

export function AnimatedCards({
    latestQuestions,
    topContributers,
}: {
    latestQuestions: React.ReactNode;
    topContributers: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
            {/* Latest Questions Card */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group relative flex flex-col shadow-2xl overflow-hidden bg-surface/40 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-violet-500/30 transition-colors h-full"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10 w-full p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-violet-500 rounded-full inline-block shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                        Latest Questions
                    </h3>
                    <div className="overflow-auto pr-2 custom-scrollbar flex-1">
                        {latestQuestions}
                    </div>
                </div>
            </motion.div>

            {/* Top Contributors Card */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="group relative flex flex-col shadow-2xl overflow-hidden bg-surface/40 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-fuchsia-500/30 transition-colors h-full"
            >
                <div className="absolute inset-0 bg-gradient-to-bl from-fuchsia-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10 w-full p-6 md:p-8 flex-1 flex flex-col items-center">
                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center self-start gap-3">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-fuchsia-400 to-orange-500 rounded-full inline-block shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                        Top Contributors
                    </h3>
                    <div className="w-full flex justify-center flex-1">
                        {topContributers}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function AnimatedDivider() {
    return (
        <FadeUp className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-xs text-zinc-500 font-medium uppercase tracking-widest"
                >
                    Community Hub
                </motion.span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>
        </FadeUp>
    );
}
