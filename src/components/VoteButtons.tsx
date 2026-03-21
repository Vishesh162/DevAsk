"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { ID, Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: Models.DocumentList<Models.Document>;
    downvotes: Models.DocumentList<Models.Document>;
    className?: string;
}) => {
    const [votedDocument, setVotedDocument] = React.useState<Models.Document | null>(); // undefined means not fetched yet
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);

    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            if (user) {
                const response = await databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ]);
                setVotedDocument(() => response.documents[0] || null);
            }
        })();
    }, [user, id, type]);

    const toggleUpvote = async () => {
        if (!user) return router.push("/login");

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "upvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document);
        } catch (error: any) {
            window.alert(error?.message || "Something went wrong");
        }
    };

    const toggleDownvote = async () => {
        if (!user) return router.push("/login");

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "downvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document);
        } catch (error: any) {
            window.alert(error?.message || "Something went wrong");
        }
    };

    return (
        <div className={cn("flex flex-col items-center justify-start gap-y-2 rounded-full bg-surface/50 border border-white/5 p-2 backdrop-blur-md shadow-sm", className)}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                    votedDocument && votedDocument.voteStatus === "upvoted"
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
                        : "border-transparent bg-transparent text-zinc-400 hover:bg-white/5 hover:text-cyan-400"
                )}
                onClick={toggleUpvote}
            >
                <IconCaretUpFilled className="h-6 w-6" />
            </motion.button>
            <span className="font-bold text-white my-1">{voteResult}</span>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                    votedDocument && votedDocument.voteStatus === "downvoted"
                        ? "border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]"
                        : "border-transparent bg-transparent text-zinc-400 hover:bg-white/5 hover:text-red-500"
                )}
                onClick={toggleDownvote}
            >
                <IconCaretDownFilled className="h-6 w-6" />
            </motion.button>
        </div>
    );
};

export default VoteButtons;