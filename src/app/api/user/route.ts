import { getUser } from "@/lib/dynamodb/user";
import { cookies } from "next/headers";

export async function GET() {
    const SK = (await cookies()).get("SK")?.value;

    if (!SK) {
        return Response.json({}, { status: 401 });
    }

    const user = await getUser(SK);
    return Response.json(user);
}