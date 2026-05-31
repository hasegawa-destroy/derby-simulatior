import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.DDB_ACCESS_KEY_ID!,
        secretAccessKey: process.env.DDB_SECRET_ACCESS_KEY!,
    },
});

export const db = DynamoDBDocumentClient.from(client);