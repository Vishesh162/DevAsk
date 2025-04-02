import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

export default async function Page({ params }: { params: any }) {
  // Now params is not forced to be a Promise
  const { quesId, quesName } = params;
  const question = await databases.getDocument(db, questionCollection, quesId);
  return <EditQues question={question} />;
}

