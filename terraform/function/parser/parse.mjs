import { JSDOM } from "jsdom"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { parseHistoryPage } from "./lib/parseHistoryPage.mjs";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABNE_NAME = process.env.TABLE_NAME

const getSource = async (id, dataType) => {
    const command = new GetCommand({
        TableName: TABNE_NAME,
        Key: {
            id: id,
            dataType: dataType,
        }
    });

    const { Item } = await docClient.send(command);
    // console.log(Item);
    return { html: Item.html };
}


const parseCardsList = async () => {
    // データを取得する
    const id = 'testuser';
    const source = await getSource(id, 'cards#list#source');

    // HTMLをパースする
    const dom = new JSDOM(source.html);
    console.log(dom.window.document.title);

    // パスモ一覧テーブルの2列目以降を取得する
    const selector = "body > table:nth-child(7) > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(n+2)";
    const elements = dom.window.document.querySelectorAll(selector);
    console.log('カード枚数:', elements.length);

    // テーブル内のテキストを表示する
    elements.forEach((e) => {
        console.log('----------------------------------------');
        console.log('PASMOの名称:', e.querySelector('td:nth-child(1) > font').textContent);
        console.log('カード種別:', e.querySelector('td:nth-child(2) > font').textContent);
        console.log('PASMO ID番号:', e.querySelector('td:nth-child(3) > font').textContent);
    });
    console.log('----------------------------------------\n');

}

const parseCardHistory = async () => {
    // データを取得する
    const id = 'testuser';
    const source = await getSource(id, 'card1#history#source');

    // HTMLをパースする
    const dom = new JSDOM(source.html);
    console.log(dom.window.document.title);

    // 履歴テーブルの2列目以降を取得する
    const selector = "body > form > table:nth-child(8) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(n+2)";
    const elements = dom.window.document.querySelectorAll(selector);
    console.log('履歴件数:', elements.length);
    elements.forEach(e => {
        console.log('----------------------------------------');
        console.log('月/日:', e.querySelector('td:nth-child(1) > font').textContent);
        console.log('種別:', e.querySelector('td:nth-child(2) > font').textContent);
        console.log('利用場所:', e.querySelector('td:nth-child(3) > font').textContent);
        console.log('種別:', e.querySelector('td:nth-child(4) > font').textContent);
        console.log('残額:', e.querySelector('td:nth-child(5) > font').textContent);
        console.log('差額:', e.querySelector('td:nth-child(6) > font').textContent);
    });
    console.log('----------------------------------------\n');
}


const parseCardHistorySelected = async () => {
    // データを取得する
    const id = 'testuser';
    const source = await getSource(id, 'card1#history#source');

    // HTMLをパースする
    const dom = new JSDOM(source.html);
    console.log(dom.window.document.title);

    const selector = 'select[id="Select1"] > option[selected="selected"]';
    const element = dom.window.document.querySelector(selector);
    console.log(element.textContent);
}


// await parseCardsList();
// await parseCardHistory();
// await parseCardHistorySelected();

// データを取得する
const id = 'testuser';
const source = await getSource(id, 'card1#history#source');
const result = await parseHistoryPage(id, source.html);
console.log(result);
