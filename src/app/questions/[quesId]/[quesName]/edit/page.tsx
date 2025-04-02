import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

export default async function Page({ params }: { params: any }) {
  // Force params to be awaited and cast it to the expected shape
  const { quesId, quesName } = await Promise.resolve(params) as { quesId: string; quesName: string };

  const question = await databases.getDocument(db, questionCollection, quesId);
  return <EditQues question={question} />;
}
export async function generateStaticParams() {
    return []; // This ensures Next.js treats it as a dynamic route without preloading params
}
