import { avatars } from "@/models/client/config";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import Header from "@/app/components/Header";

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string; userSlug: string }>;
}) {
    // Create a new variable
    const { userId } = await params;


    const user = await users.get<UserPrefs>(userId);

    return (
        <div className="container mx-auto space-y-8 px-4 pb-20 pt-32 relative z-10">
            <div className="flex flex-col gap-8 sm:flex-row items-center sm:items-start p-8 rounded-3xl border border-white/10 bg-surface/40 backdrop-blur-md shadow-2xl">
                <div className="w-48 h-48 shrink-0 relative group">
                    <div className="absolute -inset-1 bg-electric-gradient rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <picture className="relative block w-full h-full">
                        <img
                            src={avatars.getInitials(user.name, 200, 200)}
                            alt={user.name}
                            className="h-full w-full rounded-2xl object-cover border border-white/10"
                        />
                    </picture>
                </div>
                <div className="w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight text-white">{user.name}</h1>
                            <p className="text-xl text-zinc-400 font-medium">{user.email}</p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-white/5">
                                <p className="flex items-center gap-2 text-sm font-semibold text-zinc-500 bg-white/5 px-3 py-1 rounded-full">
                                    <IconUserFilled className="w-4 h-4 text-violet-400" />
                                    <span>Joined {convertDateToRelativeTime(new Date(user.$createdAt))}</span>
                                </p>
                                <p className="flex items-center gap-2 text-sm font-semibold text-zinc-500 bg-white/5 px-3 py-1 rounded-full">
                                    <IconClockFilled className="w-4 h-4 text-cyan-400" />
                                    <span>Last seen {convertDateToRelativeTime(new Date(user.$updatedAt))}</span>
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0">
                            {/* <EditButton /> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-8 lg:flex-row">
                <div className="lg:w-64 shrink-0">
                    <Navbar />
                </div>
                <div className="w-full min-w-0">{children}</div>
            </div>
        </div>
    );
};

export const dynamicParams = true;