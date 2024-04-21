
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({});
const QUEUE_URL = process.env.PARSER_QUEUE_URL;

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
                const timestamp = Number(record.dynamodb.NewImage.timestamp.N);
                const url = record.dynamodb.NewImage.url.S;
                const html = record.dynamodb.NewImage.html.S;
                console.log('id:', id);
                console.log('dataType:', dataType);
                console.log('timestamp:', timestamp);
                console.log('url:', url);
                console.log('html:', html);

                await sendMessage({ id, dataType, timestamp, url, html });
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
