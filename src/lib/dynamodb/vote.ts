import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

export async function putVote(vote: Vote) {
    // await db.send(
    //     new PutCommand({
    //         TableName: TABLE_NAME,
    //         Item: vote,
    //     })
    // );

    await db.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: vote.PK,
                SK: vote.SK,
            },
            UpdateExpression: `
      SET
        BetAmount = if_not_exists(BetAmount, :zero) + :addAmount,
        RunnerName = if_not_exists(RunnerName, :runnerName)
    `,
            ExpressionAttributeValues: {
                ":zero": 0,
                ":addAmount": vote.BetAmount,
                ":runnerName": vote.RunnerName,
            },
            ReturnValues: "ALL_NEW",
        })
    );
}