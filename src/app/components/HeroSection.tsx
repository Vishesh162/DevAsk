import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import HeroSectionHeader from "./HeroSectionHeader";

const fallbackProducts = [
    { title: "React Architecture", link: "#", thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop" },
    { title: "Node.js Backend", link: "#", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=600&auto=format&fit=crop" },
    { title: "System Design", link: "#", thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop" },
    { title: "Database Optimization", link: "#", thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop" },
    { title: "Appwrite Database", link: "#", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" },
    { title: "GraphQL Integration", link: "#", thumbnail: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?q=80&w=600&auto=format&fit=crop" },
    { title: "Next.js SSR", link: "#", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" },
    { title: "TypeScript Generics", link: "#", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop" },
    { title: "Tailwind CSS Layouts", link: "#", thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop" },
    { title: "Cloud Deployment", link: "#", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop" },
    { title: "Linux Terminal", link: "#", thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=600&auto=format&fit=crop" },
    // ✅ Fixed — replaced broken photo-1614064641913 URL
    { title: "Authentication Flows", link: "#", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop" },
    { title: "Algorithm Efficiency", link: "#", thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" },
    { title: "Security Best Practices", link: "#", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop" },
    { title: "Code Refactoring", link: "#", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" },
];

export default async function HeroSection() {
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.orderDesc("$createdAt"),
        Query.limit(15),
    ]);

    const realProducts = questions.documents
        .filter(q => q.attachmentId)
        .map(q => ({
            title: q.title,
            link: `/questions/${q.$id}/${slugify(q.title)}`,
            thumbnail: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${q.attachmentId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        }));

    const products = [...realProducts, ...fallbackProducts].slice(0, 15);

    return (
        <HeroParallax
            header={<HeroSectionHeader />}
            products={products}
        />
    );
}