import { moderateHistory } from "./lib/moderateHistory.mjs";

export async function handler(event) {
    console.log(event);

    await Promise.all(
        event.Records.map(async (record) => {
            const data = JSON.parse(record.body);
            const id = data.id;
            const dataType = data.dataType;
            if (dataType.includes('#history#parsed')) {
                await moderateHistory(id, data);
            }
        }));

    return 'success!!'
}
