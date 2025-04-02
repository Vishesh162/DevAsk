import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

interface PageProps {
  params: Promise<{
    quesId: string;
    quesName: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await the params since they are a Promise
  const { quesId, quesName } = await params;
  const question = await databases.getDocument(db, questionCollection, quesId);
  return <EditQues question={question} />;
}

