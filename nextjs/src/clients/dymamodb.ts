import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const region = process.env.NEXT_PUBLIC_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_ACCESS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('Environment variables for AWS credentials are not set properly');
}

const client = new DynamoDBClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    },
});

export const docClient = DynamoDBDocumentClient.from(client);

const authenticatorTableName = process.env.NEXT_PUBLIC_AUTHENTICATOR_TABLE_NAME;
const crawlerTableName = process.env.NEXT_PUBLIC_CRAWLER_TABLE_NAME;
const moderatorTableName = process.env.NEXT_PUBLIC_MODERATOR_TABLE_NAME;

if (!authenticatorTableName || !crawlerTableName || !moderatorTableName) {
    throw new Error('One or more table name environment variables are not set properly');
}

export {
    authenticatorTableName,
    crawlerTableName,
    moderatorTableName
};
