import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client";

const TABLE_NAME = "Race";

export async function getRaces() {
    const result = await db.send(
        new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "SK = :sk",
            ExpressionAttributeValues: {
                ":sk": "META",
            },
        })
    );

    const races = result.Items ?? [];
    return races;
}

export async function getRace(raceId: string) {
    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,

            KeyConditionExpression: "PK = :pk",

            ExpressionAttributeValues: {
                ":pk": `RACE#${raceId}`,
            },
        })
    );

    const items = result.Items ?? [];

    const race = items.find(
        item => item.SK === "META"
    );

    const runners = items.filter(
        item => item.SK?.startsWith("RUNNER#")
    );

    return { ...race, runners };
}