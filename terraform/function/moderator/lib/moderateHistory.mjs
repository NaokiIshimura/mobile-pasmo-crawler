import { putItem } from "./dynamodb.mjs"

export const moderateHistory = async (id, data) => {

    const selected = data.result.body.select.selected;
    const table = data.result.body.table.reverse();

    await Promise.all(
        table.map(async (record, index) => {
            console.log(index, record);
            switch (record[1]) {
                case '種別':
                    console.log('ヘッダー');
                    break;
                case '物販':
                    console.log('物販');
                    await putItem({
                        id: id,
                        dataType: `card1#history#${selected.replace('/', '')}#${index.toString().padStart(4, '0')}`,
                        date: record[0],
                        category: '物販',
                        value: Number(record[6].replace(',', ''))
                    });
                    break;
                case 'ｶｰﾄﾞ':
                    console.log('チャージ');
                    // 最初の履歴は差額が空欄になっている
                    if (record[6].length > 0) {
                        await putItem({
                            id: id,
                            dataType: `card1#history#${selected.replace('/', '')}#${index.toString().padStart(4, '0')}`,
                            date: record[0],
                            category: 'チャージ',
                            value: Number(record[6].replace(',', ''))
                        });
                    } else {
                        await putItem({
                            id: id,
                            dataType: `card1#history#${selected.replace('/', '')}#${index.toString().padStart(4, '0')}`,
                            date: record[0],
                            category: 'チャージ',
                            value: Number(record[5].replace(',', '').replace('¥', '+'))
                        });
                    }
                    break;
                default:
                    console.log('運賃');
                    await putItem({
                        id: id,
                        dataType: `card1#history#${selected.replace('/', '')}#${index.toString().padStart(4, '0')}`,
                        date: record[0],
                        category: '運賃',
                        value: Number(record[6].replace(',', '')),
                        detail: { in: record[2], out: record[4] }
                    });
            }
        })
    );
}
