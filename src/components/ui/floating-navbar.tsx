"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import { JSX } from "react/jsx-runtime";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
}) => {
    const { scrollYProgress, scrollY } = useScroll();
    const { session, logout } = useAuthStore();
    const router = useRouter();

    const [visible, setVisible] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", current => {
        if (scrollY.get()! === 0) {
            setVisible(true);
            return;
        }
        if (typeof current === "number") {
            const direction = current! - scrollYProgress.getPrevious()!;
            if (scrollYProgress.get() < 0.05) {
                setVisible(false);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        router.push("/");
        setIsLoggingOut(false);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 1, y: -100 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "fixed inset-x-0 top-6 z-50 mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-white/10 bg-surface/60 backdrop-blur-md py-3 pl-8 pr-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] dark:bg-[#12121A]/80",
                    className
                )}
            >
                {navItems.map((navItem: any, idx: number) => (
                    <Link
                        key={`link=${idx}`}
                        href={navItem.link}
                        className={cn(
                            "relative flex items-center space-x-1 text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300"
                        )}
                    >
                        <span className="block sm:hidden">{navItem.icon}</span>
                        <span className="hidden text-sm sm:block">{navItem.name}</span>
                    </Link>
                ))}

                {session ? (
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="relative rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                        <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                ) : (
                    <div className="flex items-center space-x-3 ml-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="relative rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 p-[1px] group"
                        >
                            <div className="rounded-full bg-[#12121A] px-5 py-2 transition-all duration-300 group-hover:bg-transparent">
                                <span className="text-sm font-medium text-white">Signup</span>
                            </div>
                        </Link>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};