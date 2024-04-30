
import { docClient, moderatorTableName } from "@/clients/dymamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export default async function getHistory(id: string) {
    const command = new QueryCommand({
        TableName: moderatorTableName,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': id,
        },
        ScanIndexForward: true
    });

    const { Items } = await docClient.send(command);
    // console.log(Items);
    return Items;
}
