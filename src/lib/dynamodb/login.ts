import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client";
import { User } from "@/types/user";

const TABLE_NAME = "User";

export async function login(userId: string, password: string) {
    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND SK = :sk",
            ExpressionAttributeValues: {
                ":pk": "USER",
                ":sk": `${userId}#${password}`,
            },
        })
    );

    const user = result.Items?.[0] as User | undefined;
    if (!user) { return null; }

    return user;
}


