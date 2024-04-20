import { parseHistoryPage } from "./lib/parseHistoryPage.mjs";
import { putParsed } from "./lib/dynamodb.mjs";

export async function handler(event) {
    console.log(event)

    await Promise.all(
        event.Records.map(async (record) => {
            const data = JSON.parse(record.body);
            console.log(data);

            if (data.dataType.includes('#history#source')) {
                const result = await parseHistoryPage(data.url, data.html);
                console.log(result);
                await putParsed(data, result);
            }
        })
    );

    return 'success!!'
}
