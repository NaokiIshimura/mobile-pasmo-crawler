
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const sqsClient = new SQSClient({});
const QUEUE_URL = process.env.MODERATOR_QUEUE_URL;

export async function handler(event) {

    console.log(event);

    await Promise.all(
        event.Records.map(async (record) => {
            console.log('record:', record);
            console.log('record.dynamodb:', record.dynamodb);
            console.log('record.dynamodb.NewImage:', record.dynamodb.NewImage);

            if (record.dynamodb.NewImage) {
                const id = record.dynamodb.Keys.id.S;
                const dataType = record.dynamodb.Keys.dataType.S;
                const timestamp = record.dynamodb.NewImage.timestamp.N;
                const result = unmarshall(record.dynamodb.NewImage.result.M);
                console.log('id:', id);
                console.log('dataType:', dataType);
                console.log('timestamp:', timestamp);
                console.log('result:', result);

                await sendMessage({ id, dataType, timestamp, result });
            }

        })
    );

    return 'success!!'
}

const sendMessage = async (message) => {
    console.log('QUEUE_URL', QUEUE_URL);
    console.log('sendMessage', message);
    const command = new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody:
            JSON.stringify(message),
    });

    const response = await sqsClient.send(command);
    console.log(response);
    return response;
};
