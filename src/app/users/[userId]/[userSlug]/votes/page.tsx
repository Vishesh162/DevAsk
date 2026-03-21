import Pagination from "@/components/Pagination";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>; // ✅ Fixed
    searchParams: Promise<{ page?: string; voteStatus?: "upvoted" | "downvoted" }>; // ✅ Fixed
}) => {
    const { userId, userSlug } = await params;
    const { page = "1", voteStatus } = await searchParams;

    const query = [
        Query.equal("votedById", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25),
    ];

    if (voteStatus) query.push(Query.equal("voteStatus", voteStatus));

    const votes = await databases.listDocuments(db, voteCollection, query);

    votes.documents = (
        await Promise.all(
            votes.documents.map(async (vote) => {
                if (!vote?.type || !vote?.typeId) return null;
    
                try {
                    if (vote.type === "question") {
                        const questionOfTypeQuestion = await databases.getDocument(
                            db, questionCollection, vote.typeId, [Query.select(["title"])]
                        );
                        return { ...vote, question: questionOfTypeQuestion };
                    }
    
                    const answer = await databases.getDocument(db, answerCollection, vote.typeId);
                    if (!answer) return null;
    
                    const questionOfTypeAnswer = await databases.getDocument(
                        db, questionCollection, answer.questionId, [Query.select(["title"])]
                    );
    
                    return questionOfTypeAnswer
                        ? { ...vote, question: questionOfTypeAnswer }
                        : null;
                } catch (error) {
                    if ((error as { code?: number }).code === 404){
                        console.warn(`Skipping vote ${vote.$id} - Linked document not found.`);
                        return null;
                    }
                    throw error;
                }
            })
        )
    ).filter((vote): vote is NonNullable<typeof vote> => vote !== null);

    return (
        <div className="px-4">
            <div className="mb-4 flex justify-between">
                <p>{votes.total} votes</p>
                <ul className="flex gap-1">
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${!voteStatus ? "bg-white/20" : "hover:bg-white/20"}`}
                        >
                            All
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=upvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${voteStatus === "upvoted" ? "bg-white/20" : "hover:bg-white/20"}`}
                        >
                            Upvotes
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=downvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${voteStatus === "downvoted" ? "bg-white/20" : "hover:bg-white/20"}`}
                        >
                            Downvotes
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {votes.documents.map((vote) => (
                    <div
                        key={vote.$id}
                        className="rounded-xl border border-white/40 p-4 duration-200 hover:bg-white/10"
                    >
                        <div className="flex">
                            <p className="mr-4 shrink-0">{vote.voteStatus}</p>
                            <p>
                                <Link
                                    href={`/questions/${vote.question.$id}/${slugify(vote.question.title)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {vote.question.title}
                                </Link>
                            </p>
                        </div>
                        <p className="text-right text-sm">
                            {convertDateToRelativeTime(new Date(vote.$createdAt))}
                        </p>
                    </div>
                ))}
            </div>
            <Pagination total={votes.total} limit={25} />
        </div>
    );
};

export default Page;