import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import NumberTicker from "@/components/magicui/number-ticker";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";

export default async function Page({ params }: {
    params: Promise<{ userId: string; userSlug: string }>; // ✅ Fixed
}) {
    const { userId } = await params;

    const [user, questions, answers] = await Promise.all([
        users.get<UserPrefs>(userId),
        databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", userId),
            Query.limit(1),
        ]),
        databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", userId),
            Query.limit(1),
        ]),
    ]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <CardSpotlight className="group relative flex w-full flex-col items-center justify-center p-12 rounded-3xl border border-white/10 bg-surface/40 backdrop-blur-md transition-all hover:bg-surface/60 overflow-hidden">
                <div className="absolute inset-x-6 top-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 group-hover:text-violet-400 transition-colors">Reputation</h2>
                </div>
                <div className="z-10 flex flex-col items-center gap-2">
                    <p className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                        <NumberTicker value={user.prefs.reputation || 0} />
                    </p>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Points earned</span>
                </div>
            </CardSpotlight>

            <CardSpotlight className="group relative flex w-full flex-col items-center justify-center p-12 rounded-3xl border border-white/10 bg-surface/40 backdrop-blur-md transition-all hover:bg-surface/60 overflow-hidden">
                <div className="absolute inset-x-6 top-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 group-hover:text-cyan-400 transition-colors">Questions Asked</h2>
                </div>
                <div className="z-10 flex flex-col items-center gap-2">
                    <p className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <NumberTicker value={questions.total || 0} />
                    </p>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Total Threads</span>
                </div>
            </CardSpotlight>

            <CardSpotlight className="group relative flex w-full flex-col items-center justify-center p-12 rounded-3xl border border-white/10 bg-surface/40 backdrop-blur-md transition-all hover:bg-surface/60 overflow-hidden">
                <div className="absolute inset-x-6 top-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 group-hover:text-fuchsia-400 transition-colors">Answers Given</h2>
                </div>
                <div className="z-10 flex flex-col items-center gap-2">
                    <p className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">
                        <NumberTicker value={answers.total || 0} />
                    </p>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Contributions</span>
                </div>
            </CardSpotlight>
        </div>
    );
};