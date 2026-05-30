import { NextRequest, NextResponse } from "next/server";

import { getRace } from "@/lib/dynamodb/race";

export async function GET(
    request: NextRequest,
    context: any
) {
    const { id } = await context.params;

    console.log({
        region: process.env.DDB_REGION,
        accessKeyExists: !!process.env.DDB_ACCESS_KEY_ID,
        secretKeyExists: !!process.env.DDB_SECRET_ACCESS_KEY,
    });

    try {
        const race = await getRace(id);

        return NextResponse.json(race);
    } catch (error) {
        console.error("API Error:", error);

        return NextResponse.json(
            {
                error: "Failed to fetch race",
                detail: String(error),
            },
            { status: 500 }
        );
    }
}