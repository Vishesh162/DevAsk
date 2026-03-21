"use client";

import QuestionForm from '@/components/QuestionForm';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/navigation';

function AskQuestionPage() {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/login?redirect=/questions/ask');
    }
  }, [hydrated, user, router]);

  // Show loading spinner while auth is being hydrated
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, render nothing (redirect is in progress)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent text-white px-4 py-8 relative z-10 pt-36">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8 rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-md p-8 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
            Ask a public question
          </h1>
          <p className="text-zinc-400 mb-8">
            Get help from the DevAsk community. Be specific and imagine you&apos;re asking a question to another person.
          </p>
          <QuestionForm />
        </div>
      </div>
    </div>
  );
}

export default AskQuestionPage;