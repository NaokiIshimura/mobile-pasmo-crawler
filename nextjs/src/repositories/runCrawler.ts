
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { client, crawlerFunctionName } from "@/clients/lambda";

export default async function runCrawler() {
    const command = new InvokeCommand({
        FunctionName: crawlerFunctionName,
        InvocationType: 'Event'
    });
    await client.send(command);
}
