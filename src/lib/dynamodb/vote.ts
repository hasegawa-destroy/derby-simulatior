import { DeleteCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client";
import { Vote } from "@/types/vote";

const TABLE_NAME = "Vote";

// 指定したユーザーの投票を取得
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

// 指定したレースの全投票を取得
export async function getRaceVotes(raceId: string) {
    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "RaceVotesIndex",
            KeyConditionExpression: "RaceId = :raceId",
            ExpressionAttributeValues: {
                ":raceId": `RACE${raceId}`,
            },
        })
    );

    return (result.Items ?? []) as Vote[];
}

// 投票
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
        RaceId = if_not_exists(RaceId, :raceId),
        RunnerName = if_not_exists(RunnerName, :runnerName)
    `,
            ExpressionAttributeValues: {
                ":zero": 0,
                ":addAmount": vote.BetAmount,
                ":raceId": vote.RaceId,
                ":runnerName": vote.RunnerName,
            },
            ReturnValues: "ALL_NEW",
        })
    );
}

export async function deleteVote(vote: Vote) {
    await db.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: vote.PK,
                SK: vote.SK,
            },
        })
    );
}