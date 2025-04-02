import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

type Resolvable<T> = T | Promise<T>;

interface CustomPageProps {
  params: Resolvable<{ quesId: string; quesName: string }>;
}

export default async function Page({ params }: CustomPageProps) {
  // Always await to resolve to the plain object
  const resolvedParams = await params;
  const question = await databases.getDocument(db, questionCollection, resolvedParams.quesId);
  return <EditQues question={question} />;
}
