import { QueryCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client";
import { Race } from "@/types/race";

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

export async function changeState(race: Race) {
    await db.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: race.PK,
                SK: race.SK,
            },
            UpdateExpression: "SET #state = :state",
            ExpressionAttributeNames: {
                "#state": "State",
            },
            ExpressionAttributeValues: {
                ":state": race.State,
            },
            ReturnValues: "ALL_NEW",
        })
    );
}
