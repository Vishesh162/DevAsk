import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

export default async function Page(props: any) {
  // Bypass strict typing by treating props as any
  const { params } = props;
  // Cast params to our expected shape
  const { quesId, quesName } = params as { quesId: string; quesName: string };

  const question = await databases.getDocument(db, questionCollection, quesId);
  return <EditQues question={question} />;
}
