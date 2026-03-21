import React from "react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Footer = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Questions", href: "/questions" },
        { title: "Ask a Question", href: "/questions/ask" },
    ];

    return (
        <footer className="relative block overflow-hidden border-t border-solid border-white/10 py-16 mt-10">
            <div className="container mx-auto px-4 relative z-10">
                <p className="text-center text-2xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500">
                    DevAsk
                </p>
                <ul className="flex flex-wrap items-center justify-center gap-8 mb-6">
                    {items.map(item => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="text-center text-zinc-600 text-xs">
                    © {new Date().getFullYear()} DevAsk. All rights reserved.
                </div>
            </div>
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.06}
                duration={3}
                repeatDelay={1}
                className={cn(
                    "[mask-image:radial-gradient(3000px_circle_at_center,white,transparent)]",
                    "inset-y-[-50%] h-[200%] skew-y-6"
                )}
            />
        </footer>
    );
};

export default Footer;