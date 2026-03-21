import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.limit(5),
        Query.orderDesc("$createdAt"),
    ]);

    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                // ✅ Safe user fetch — returns fallback if user was deleted
                users.get<UserPrefs>(ques.authorId).catch(() => ({
                    $id: ques.authorId,
                    name: "Deleted User",
                    email: "",
                    prefs: { reputation: 0 } as UserPrefs,
                })),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1),
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1),
                ]),
            ]);

            // ✅ Only build URL if attachmentId exists
            const imageUrl = ques.attachmentId
                ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${ques.attachmentId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
                : null;

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                imageUrl, // expose the parsed imageUrl
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
            };
        })
    );

    return (
        <div className="space-y-6">
            {questions.documents.map(question => (
                <QuestionCard key={question.$id} ques={question} />
            ))}
        </div>
    );
};

export default LatestQuestions;