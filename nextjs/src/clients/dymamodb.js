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
