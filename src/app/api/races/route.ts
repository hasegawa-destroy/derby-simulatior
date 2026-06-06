import { NextResponse } from "next/server";
import { getRaces } from "@/lib/dynamodb/race";

export async function GET() {
    const races = await getRaces();
    races.sort((a, b) => a.PK.localeCompare(b.PK));

    return NextResponse.json(races);
}