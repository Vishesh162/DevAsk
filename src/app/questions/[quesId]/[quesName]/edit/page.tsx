import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

export default async function Page({ params }: { params: unknown }) {
  // Force params to be resolved as the expected object shape
  const { quesId, quesName } = (await Promise.resolve(params)) as { quesId: string; quesName: string };
  const question = await databases.getDocument(db, questionCollection, quesId);
  return <EditQues question={question} />;
}

