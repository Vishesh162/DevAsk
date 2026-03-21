"use client";

import { IconCloud } from "@/components/magicui/icon-cloud";
import { Particles } from "@/components/magicui/particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import React from "react";

const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
];

const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
);

const HeroSectionHeader = () => {
    const { session } = useAuthStore();

    return (
        <div className="container mx-auto px-4 ">
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-center">
                    <div className="space-y-4 text-center">
                        <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 bg-clip-text text-center text-7xl font-extrabold leading-tight tracking-tighter text-transparent drop-shadow-lg">
                            DevAsk
                        </h1>
                        <p className="text-center text-xl font-bold leading-none tracking-tighter">
                            Ask questions, share knowledge, and collaborate with developers
                            worldwide. Join our community and enhance your coding skills!
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/questions">
                                <ShimmerButton className="shadow-2xl">
                                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                                        Explore Questions →
                                    </span>
                                </ShimmerButton>
                            </Link>
                            <Link
                                href={session ? "/questions/ask" : "/login?redirect=/questions/ask"}
                                className="relative rounded-full border border-white/20 px-8 py-3 font-medium text-white backdrop-blur-sm hover:border-violet-400/50 hover:text-violet-300 transition-colors duration-200"
                            >
                                <span>Ask a Question</span>
                                <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="relative max-w-[32rem] overflow-hidden">
                        <IconCloud images={images} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSectionHeader;