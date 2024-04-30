import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.NEXT_PUBLIC_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY
        , secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
    },
});

export const docClient = DynamoDBDocumentClient.from(client);
export const tableName = process.env.NEXT_PUBLIC_TABLE_NAME;
export const authenticatorTableName = process.env.NEXT_PUBLIC_AUTHENTICATOR_TABLE_NAME;
export const crawlerTableName = process.env.NEXT_PUBLIC_CRAWLER_TABLE_NAME;
export const moderatorTableName = process.env.NEXT_PUBLIC_MODERATOR_TABLE_NAME;
