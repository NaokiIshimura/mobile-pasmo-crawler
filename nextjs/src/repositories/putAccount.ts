import { docClient, authenticatorTableName } from "@/clients/dymamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export default async function putAccount(id: string, mailAddress: string, password: string) {
    const command = new PutCommand({
        TableName: authenticatorTableName,
        Item: {
            id: id,
            dataType: 'account',
            mailAddress: mailAddress,
            password: password
        }
    });

    const response = await docClient.send(command);
    // console.log(response);
    return response;
}