import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABNE_NAME = process.env.TABLE_NAME;

export async function putItem(item) {
    const command = new PutCommand({
        TableName: TABNE_NAME,
        Item: item
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
}
