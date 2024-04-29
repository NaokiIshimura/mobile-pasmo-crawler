import { docClient, authenticatorTableName } from "@/clients/dymamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export default async function getAuthImage(id: string) {
    const command = new GetCommand({
        TableName: authenticatorTableName,
        Key: {
            id: id,
            dataType: 'authImage'
        },
    });

    const { Item } = await docClient.send(command);
    // console.log(Item);
    return { binary: Item?.binary, text: Item?.text }
}
