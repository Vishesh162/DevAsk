"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};

export default function Register() {
    const { login, createAccount } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");
        const email = formData.get("email");
        const password = formData.get("password");

        if (!firstname || !lastname || !email || !password) {
            setError(() => "Please fill out all fields");
            return;
        }

        setIsLoading(() => true);
        setError(() => "");

        const response = await createAccount(
            `${firstname} ${lastname}`,
            email.toString(),
            password.toString()
        );

        if (response.error) {
            setError(() => response.error!.message);
        } else {
            const loginResponse = await login(email.toString(), password.toString());
            if (loginResponse.error) {
                setError(() => loginResponse.error!.message);
            }
        }
        setIsLoading(() => false);
    };

    return (
        <div className="mx-auto mt-16 w-full max-w-md rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl p-6 shadow-2xl md:p-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight text-center mb-2">
                Join DevAsk
            </h2>
            <p className="mt-2 text-center text-sm text-zinc-400 mb-8">
                Ready to collaborate? If you already have an account,{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    log in here
                </Link>
            </p>

            {error && (
                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-500">
                    {error}
                </div>
            )}
            <form className="my-4" onSubmit={handleSubmit}>
                <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <LabelInputContainer>
                        <Label htmlFor="firstname" className="text-zinc-300">First name</Label>
                        <Input className="text-white bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors" id="firstname" name="firstname" placeholder="Tyler" type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname" className="text-zinc-300">Last name</Label>
                        <Input className="text-white bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors" id="lastname" name="lastname" placeholder="Durden" type="text" />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-6">
                    <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                    <Input
                        className="text-white bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors"
                        id="email"
                        name="email"
                        placeholder="developer@example.com"
                        type="email"
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                    <Input className="text-white bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors" id="password" name="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-12 w-full rounded-xl bg-electric-gradient p-[1px] transition-transform active:scale-95"
                    type="submit"
                    disabled={isLoading}
                >
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface transition-all duration-300 hover:bg-transparent">
                        <span className="font-semibold text-white">Sign up &rarr;</span>
                    </div>
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            </form>
        </div>
    );
}