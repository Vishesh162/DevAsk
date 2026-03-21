"use client";

import RTE from "@/components/RTE";
import { Meteors } from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { fireConfetti } from "./magicui/confetti";

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col space-y-3 overflow-hidden rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-md p-6 shadow-lg transition-all focus-within:border-violet-500/50 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)]",
                className
            )}
        >
            <Meteors number={15} />
            {children}
        </div>
    );
};

/**
 * ******************************************************************************
 * ![INFO]: for buttons, refer to https://ui.aceternity.com/components/tailwindcss-buttons
 * ******************************************************************************
 */
const QuestionForm = ({ question }: { question?: Models.Document }) => {
    const { user } = useAuthStore();
    const [tag, setTag] = React.useState("");
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        title: String(question?.title || ""),
        content: String(question?.content || ""),
        authorId: user?.$id,
        tags: new Set((question?.tags || []) as string[]),
        attachment: null as File | null,
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const loadConfetti = (timeInMS = 3000) => {
        const end = Date.now() + timeInMS; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            fireConfetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });

            fireConfetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    const create = async () => {
        let attachmentId = null;

        if (formData.attachment) {
            const storageResponse = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                formData.attachment
            );
            attachmentId = storageResponse.$id;
        }

        const data: any = {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
        };

        if (attachmentId) {
            data.attachmentId = attachmentId;
        }

        const response = await databases.createDocument(
            db,
            questionCollection,
            ID.unique(),
            data
        );

        loadConfetti();

        return response;
    };

    const update = async () => {
        if (!question) throw new Error("Please provide a question");

        const attachmentId = await (async () => {
            if (!formData.attachment) return question?.attachmentId as string | undefined;

            if (question.attachmentId) {
                await storage.deleteFile(questionAttachmentBucket, question.attachmentId);
            }

            const file = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                formData.attachment
            );

            return file.$id;
        })();

        const data: any = {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
        };

        if (attachmentId) {
            data.attachmentId = attachmentId;
        }

        const response = await databases.updateDocument(db, questionCollection, question.$id, data);

        return response;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.authorId) {
            setError(() => "Please fill out all fields");
            return;
        }

        // Image is no longer required, removed check for !formData.attachment

        setLoading(() => true);
        setError(() => "");

        try {
            const response = question ? await update() : await create();

            router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
        } catch (error: any) {
            setError(() => error.message);
        }

        setLoading(() => false);
    };

    // Set authorId when user changes
    React.useEffect(() => {
        if (user?.$id) {
            setFormData(prev => ({ ...prev, authorId: user.$id }));
        }
    }, [user]);

    return (
        <form className="space-y-4" onSubmit={submit}>
            {error && (
                <LabelInputContainer>
                    <div className="text-center">
                        <span className="text-red-500">{error}</span>
                    </div>
                </LabelInputContainer>
            )}
            <LabelInputContainer>
                <Label htmlFor="title" className="text-white font-semibold flex flex-col">
                    <span>Title</span>
                    <small className="text-zinc-500 font-normal mt-1">
                        (Be specific and imagine you&apos;re asking a question to another person.)
                    </small>
                </Label>
                <Input
                    className="text-white font-medium bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors mt-2"
                    id="title"
                    name="title"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="content" className="text-white font-semibold flex flex-col mb-4">
                    <span>What are the details of your problem?</span>
                    <small className="text-zinc-500 font-normal mt-1">
                        (Introduce the problem and expand on what you put in the title. Minimum 20
                        characters.)
                    </small>
                </Label>
                <RTE
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))}
                />
            </LabelInputContainer>
            <LabelInputContainer >
                <Label htmlFor="image" className="text-white font-semibold flex flex-col">
                    <span>Image</span>
                    <small className="text-zinc-500 font-normal mt-1">
                        (Add image to your question to make it more clear and easier to understand.)
                    </small>
                </Label>
                <Input
                    className="mt-2 text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-500/10 file:text-violet-400 hover:file:bg-violet-500/20"
                    id="image"
                    name="image"
                    accept="image/*"
                    type="file"
                    onChange={e => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setFormData(prev => ({
                            ...prev,
                            attachment: files[0],
                        }));
                    }}
                />
            </LabelInputContainer>
            <LabelInputContainer >
                <Label htmlFor="tag" className="text-white font-semibold flex flex-col mb-2">
                    <span>Tags</span>
                    <small className="text-zinc-500 font-normal mt-1">
                        Add tags to describe what your question is about. Start typing to see
                        suggestions.
                    </small>
                </Label>
                <div className="flex w-full gap-4 items-center mt-2">
                    <div className="w-full">
                        <Input
                            className="text-white font-medium bg-black/40 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/50 transition-colors"
                            id="tag"
                            name="tag"
                            placeholder="e.g. (java c objective-c)"
                            type="text"
                            value={tag}
                            onChange={e => setTag(() => e.target.value)}
                        />
                    </div>
                    <button
                        className="relative shrink-0 rounded-full border border-violet-500/30 bg-violet-500/10 px-8 py-2 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/20 active:scale-95"
                        type="button"
                        onClick={() => {
                            if (tag.length === 0) return;
                            setFormData(prev => ({
                                ...prev,
                                tags: new Set([...Array.from(prev.tags), tag]),
                            }));
                            setTag(() => "");
                        }}
                    >
                        <span>Add</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {Array.from(formData.tags).map((tag, index) => (
                        <div key={index} className="flex items-center gap-2 group">
                            <div className="relative flex items-center space-x-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 backdrop-blur-md transition-all hover:bg-violet-500/20">
                                <span>#{tag}</span>
                                <button
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            tags: new Set(
                                                Array.from(prev.tags).filter(t => t !== tag)
                                            ),
                                        }));
                                    }}
                                    type="button"
                                    className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <IconX size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </LabelInputContainer>

            <button
                className="group relative block w-full h-14 rounded-2xl bg-electric-gradient p-[1px] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-[0.98]"
                type="submit"
                disabled={loading}
            >
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-surface transition-all duration-300 group-hover:bg-transparent">
                    <span className="text-lg font-bold text-white tracking-wide">
                        {loading ? "Processing..." : question ? "Update Question" : "Post a Question →"}
                    </span>
                </div>
            </button>
        </form>
    );
};

export default QuestionForm;