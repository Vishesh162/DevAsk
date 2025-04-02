import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

const Page = async (props: any) => {
    const { params } = await props; // Ensure params is awaited properly
    const question = await databases.getDocument(db, questionCollection, params.quesId);
    return <EditQues question={question} />;
};

export default Page;

