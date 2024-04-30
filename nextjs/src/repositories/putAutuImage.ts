import { docClient, authenticatorTableName } from "@/clients/dymamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export default async function putAuthImage(id: string, text: string) {
    const command = new PutCommand({
        TableName: authenticatorTableName,
        Item: {
            id: id,
            dataType: 'authImage',
            binary: '',
            text: text
        }
    });

    const response = await docClient.send(command);
    // console.log(response);
    return response;
}
