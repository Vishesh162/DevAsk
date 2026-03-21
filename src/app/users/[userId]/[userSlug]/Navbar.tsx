"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    const { userId, userSlug } = useParams();
    const pathname = usePathname();

    const items = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}/`,
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`,
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`,
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`,
        },
    ];

    return (
        <ul className="flex w-full min-w-0 shrink-0 gap-2 overflow-auto sm:w-64 sm:flex-col lg:sticky lg:top-24 h-fit p-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            {items.map(item => (
                <li key={item.name}>
                    <Link
                        href={item.href}
                        className={`group relative flex items-center w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${pathname === item.href
                                ? "bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                                : "text-zinc-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        {pathname === item.href && (
                            <div className="absolute left-0 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        )}
                        <span className="relative">{item.name}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default Navbar;