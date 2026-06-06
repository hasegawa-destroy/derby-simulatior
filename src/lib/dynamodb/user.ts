import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

export async function changePoint(sk: string, changeAmount: number) {
    await db.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: "USER",
                SK: `${sk}`,
            },
            UpdateExpression: `
      SET
        Point = if_not_exists(Point, :zero) + :changeAmount
    `,
            ExpressionAttributeValues: {
                ":zero": 0,
                ":changeAmount": changeAmount,
            },
            ReturnValues: "ALL_NEW",
        })
    );
}