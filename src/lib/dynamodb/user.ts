import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client";
import { User } from "@/types/user";

const TABLE_NAME = "User";

export async function getUser(sk: string) {
    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND SK = :sk",
            ExpressionAttributeValues: {
                ":pk": "USER",
                ":sk": `${sk}`,
            },
        })
    );

    const user = result.Items?.[0] as User | undefined;
    if (!user) { return null; }

    return user;
}
