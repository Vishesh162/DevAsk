import { NextResponse } from "next/server";
import getOrCreateDB from "@/models/server/dbSetup";
import getOrCreateStorage from "@/models/server/storageSetup";

export async function GET() {
    try {
        await Promise.all([
            getOrCreateDB(),
            getOrCreateStorage()
        ]);
        return NextResponse.json({ message: "Database and Storage initialized successfully." }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to initialize." }, { status: 500 });
    }
}
