
import { getSource } from './lib/dynamoDB.mjs';
import { JSDOM } from "jsdom"

// データを取得する
const id = 'local';
const source = await getSource(id);

// HTMLをパースする
const dom = new JSDOM(source.html);
console.log(dom.window.document.title);

// パスモ一覧テーブルの2列目以降を取得する
const selector = "body > table:nth-child(7) > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(n+2)";
const elements = dom.window.document.querySelectorAll(selector);
console.log(elements.length)

// テーブル内のテキストを表示する
elements.forEach((e) => {
    console.log(e.querySelector('td:nth-child(1) > font').textContent);
    console.log(e.querySelector('td:nth-child(2) > font').textContent);
    console.log(e.querySelector('td:nth-child(3) > font').textContent);
});
