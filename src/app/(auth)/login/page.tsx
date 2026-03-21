"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};

export default function Login() {
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) {
            setError(() => "Please fill out all fields");
            return;
        }

        setIsLoading(() => true);
        setError(() => "");

        const loginResponse = await login(email.toString(), password.toString());
        if (loginResponse.error) {
            setError(() => loginResponse.error!.message);
        } else {
            router.push(redirectTo);
        }

        setIsLoading(() => false);
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl p-6 shadow-2xl md:p-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight text-center mb-2">
                DevAsk Login
            </h2>
            <p className="mt-2 text-center text-sm text-zinc-400 mb-8">
                Welcome back! Don&apos;t have an account?{" "}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    Register here
                </Link>
            </p>

            {error && (
                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-500">
                    {error}
                </div>
            )}
            <form className="my-4" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-6">
                    <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                    <Input
                        className="text-white bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors"
                        id="email"
                        name="email"
                        placeholder="developer@example.com"
                        type="email"
                        autoFocus={false}          
                        autoComplete="email"       
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                    <Input
                        className="text-white bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        autoFocus={false}          
                        autoComplete="current-password" 
                    />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-12 w-full rounded-xl bg-electric-gradient p-[1px] transition-transform active:scale-95"
                    type="submit"
                    disabled={isLoading}
                >
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface transition-all duration-300 hover:bg-transparent">
                        <span className="font-semibold text-white">
                            {isLoading ? "Logging in..." : "Log in →"} {/* ✅ Loading state */}
                        </span>
                    </div>
                </button>
            </form>
        </div>
    );
}