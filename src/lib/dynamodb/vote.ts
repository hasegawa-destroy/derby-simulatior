import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client";
import { Vote } from "@/types/vote";

const TABLE_NAME = "Vote";

export async function getVote(raceId: string, userId: string, runnerId: string) {
    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,

            KeyConditionExpression: "PK = :pk",

            ExpressionAttributeValues: {
                ":pk": `RACE${raceId}#USER${userId}`,
            },
        })
    );

    const items = (result.Items ?? []) as Vote[];
    return items;
}