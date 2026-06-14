import { NextRequest, NextResponse } from "next/server";

import { changeState, getRace } from "@/lib/dynamodb/race";

export async function GET(
    request: NextRequest,
    context: any
) {
    const { id } = await context.params;

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

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        await changeState(body);
    }
    catch (e) {
        console.log("レースの状態変更に失敗しました: " + e)
    }

    return NextResponse.json({
        success: true,
    });
}