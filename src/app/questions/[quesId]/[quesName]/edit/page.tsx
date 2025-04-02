import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

// Fix: Change the parameter type definition
export default async function Page({ params }: { params: { quesId: string; quesName: string } }) {
  // No need to await params as it's not a Promise
  const { quesId, quesName } = params;
  const question = await databases.getDocument(db, questionCollection, quesId);
  return <EditQues question={question} />;
}

export async function generateStaticParams() {
    return []; // This ensures Next.js treats it as a dynamic route without preloading params
}
