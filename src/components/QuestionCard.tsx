"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
    const [height, setHeight] = React.useState(0);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref]);

    return (
        <div
            ref={ref}
            className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-4 transition-all duration-300 hover:border-accent-violet/50 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] sm:flex-row backdrop-blur-md"
        >
            <BorderBeam size={height} duration={12} delay={9} />
            <div className="relative shrink-0 text-sm sm:text-right flex flex-col items-end justify-start pt-2">
                <span className="font-semibold text-white bg-white/10 px-3 py-1 rounded-full mb-2">{ques.totalVotes} votes</span>
                <span className="text-zinc-400">{ques.totalAnswers} answers</span>
            </div>
            <div className="relative w-full">
                <Link
                    href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                    className="text-white duration-200 hover:text-cyan-400"
                >
                    <h2 className="text-xl font-bold tracking-tight">{ques.title}</h2>
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    {ques.tags.map((tag: string) => (
                        <Link
                            key={tag}
                            href={`/questions?tag=${tag}`}
                            className="inline-block rounded-full bg-violet-500/10 text-cyan-400 border border-violet-500/20 px-3 py-1 font-medium transition-colors hover:bg-violet-500/20"
                        >
                            #{tag}
                        </Link>
                    ))}
                    <div className="ml-auto flex items-center gap-2">
                        <picture>
                            <img
                                src={avatars.getInitials(ques.author.name, 24, 24)}
                                alt={ques.author.name}
                                className="rounded-full shadow-md"
                            />
                        </picture>
                        <Link
                            href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                            className="text-fuchsia-400 hover:text-fuchsia-300 font-medium"
                        >
                            {ques.author.name}
                        </Link>
                        <strong className="text-zinc-500 text-xs ml-1">&bull; {ques.author.reputation}</strong>
                        <span className="text-zinc-500 text-xs">asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;