import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import { Particles } from "@/components/magicui/particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { avatars } from "@/models/client/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
  commentCollection,
  questionAttachmentBucket,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { storage } from "@/models/client/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { TracingBeam } from "@/components/ui/tracing-beam";

// Define PageProps so that params can be a plain object or a Promise.
interface PageProps {
  params: Promise<{ quesId: string; quesName: string }>;
}

const Page = async ({ params }: PageProps) => {
  // Ensure params is awaited regardless of its original type.
  const { quesId, quesName } = await params;

  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", quesId),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const preview = question.attachmentId
    ? await storage.getFilePreview(questionAttachmentBucket, question.attachmentId)
    : null;

  const author = await users.get<UserPrefs>(question.authorId).catch(() => ({
    $id: question.authorId,
    name: "Deleted User",
    email: "",
    prefs: { reputation: 0 } as UserPrefs,
  }));

  if (comments?.documents) {
    comments.documents = await Promise.all(
      comments.documents.map(async (comment) => {
        const author = await users.get<UserPrefs>(comment.authorId).catch(() => ({
          $id: comment.authorId,
          name: "Deleted User",
          email: "",
          prefs: { reputation: 0 } as UserPrefs,
        }));
        return {
          ...comment,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      })
    );
  }

  if (answers?.documents) {
    answers.documents = await Promise.all(
      answers.documents.map(async (answer) => {
        const [author, answerComments, upvotes, downvotes] = await Promise.all([
          users.get<UserPrefs>(answer.authorId).catch(() => ({
            $id: answer.authorId,
            name: "Deleted User",
            email: "",
            prefs: { reputation: 0 } as UserPrefs,
          })),
          databases.listDocuments(db, commentCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1),
          ]),
        ]);

        if (answerComments?.documents) {
          answerComments.documents = await Promise.all(
            answerComments.documents.map(async (comment) => {
              const author = await users.get<UserPrefs>(comment.authorId).catch(() => ({
                $id: comment.authorId,
                name: "Deleted User",
                email: "",
                prefs: { reputation: 0 } as UserPrefs,
              }));
              return {
                ...comment,
                author: {
                  $id: author.$id,
                  name: author.name,
                  reputation: author.prefs.reputation,
                },
              };
            })
          );
        }

        return {
          ...answer,
          comments: answerComments,
          upvotesDocuments: upvotes,
          downvotesDocuments: downvotes,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      })
    );
  }

  return (
    <TracingBeam className="container pl-6">
      <Particles className="fixed inset-0 h-full w-full" quantity={500} ease={100} color="#ffffff" refresh />
      <div className="min-h-screen bg-transparent text-white px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto w-full">
          <div className="relative mx-auto px-4 pb-20 pt-36">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
              <div className="w-full">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">{question.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                  <span className="bg-white/5 px-3 py-1 rounded-full">Asked {convertDateToRelativeTime(new Date(question.$createdAt))}</span>
                  <span className="bg-white/5 px-3 py-1 rounded-full">{answers.total} Answers</span>
                  <span className="bg-white/5 px-3 py-1 rounded-full">{upvotes.total + downvotes.total} Votes</span>
                </div>
              </div>
              <Link href="/questions/ask" className="shrink-0">
                <ShimmerButton className="shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all hover:scale-105">
                  <span className="whitespace-pre-wrap text-center text-sm font-semibold leading-none tracking-tight text-white lg:text-base">
                    Ask a Question
                  </span>
                </ShimmerButton>
              </Link>
            </div>

            <hr className="my-8 border-white/10" />

            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex sm:shrink-0 flex-row sm:flex-col items-center gap-4">
                <VoteButtons type="question" id={question.$id} className="w-full" upvotes={upvotes} downvotes={downvotes} />
                <EditQuestion questionId={question.$id} questionTitle={question.title} authorId={question.authorId} />
                <DeleteQuestion questionId={question.$id} authorId={question.authorId} />
              </div>

              <div className="w-full min-w-0">
                <div className="rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-md p-6 shadow-xl mb-6">
                  <MarkdownPreview className="prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10" source={question.content} />
                  {preview && (
                    <picture>
                      <img src={preview || undefined} alt={question.title} className="mt-6 rounded-xl border border-white/10 shadow-lg object-cover w-full max-h-[500px]" />
                    </picture>
                  )}
                </div>

                <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
                  {question.tags.map((tag: string) => (
                    <Link key={tag} href={`/questions?tag=${tag}`} className="inline-block rounded-full bg-violet-500/10 text-cyan-400 border border-violet-500/20 px-3 py-1 font-medium transition-colors hover:bg-violet-500/20">
                      #{tag}
                    </Link>
                  ))}
                </div>

                <div className="mb-10 flex items-center justify-end gap-3 bg-white/5 p-4 rounded-xl border border-white/5 w-fit ml-auto">
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 mb-1">asked by</p>
                    <Link href={`/users/${author.$id}/${slugify(author.name)}`} className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold block">
                      {author.name}
                    </Link>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded mr-1">{author.prefs.reputation}</strong> reputation
                    </p>
                  </div>
                  <picture>
                    <img src={avatars.getInitials(author.name, 48, 48)} alt={author.name} className="rounded-xl shadow-md border border-white/10" />
                  </picture>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">Comments</h3>
                  <Comments comments={comments} className="rounded-xl border border-white/5 bg-white/5 p-4" type="question" typeId={question.$id} />
                </div>

                <hr className="my-10 border-white/10" />

                <Answers answers={answers} questionId={question.$id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TracingBeam>
  );
};

export default Page;

export async function generateStaticParams() {
  return []; // This ensures Next.js treats it as a dynamic route without preloading params
}
