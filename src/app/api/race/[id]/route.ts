import { NextRequest, NextResponse } from "next/server";

import { getRace } from "@/lib/dynamodb/race";

export async function GET(
    request: NextRequest,
    context: any
) {
    const { id } = await context.params;
    const race = await getRace(id);

    return NextResponse.json(race);
}