import { JSDOM } from "jsdom";

export const parseHistoryPage = async (url, html) => {

    console.log(html);
    const result = { head: {}, body: {} };

    // HTMLをパースする
    const dom = new JSDOM(html);

    // URLを設定する
    result.url = url;
    // タイトルを取得する
    result.head.title = parseTitle(dom);
    // 選択してる表示対象を取得する
    result.body.select = parseSelect(dom);
    // 履歴テーブル内の値を取得する
    result.body.table = parseTable(dom);

    return result;

}

// タイトルを取得する
const parseTitle = (dom) => {
    const title = dom.window.document.title;
    return title;
}

// 選択してる表示対象を取得する
const parseSelect = (dom) => {
    const select = {}
    const selector = 'select[id="Select1"] > option[selected="selected"]';
    const element = dom.window.document.querySelector(selector);
    select.selected = element.textContent;
    return select;
}

// 履歴テーブル内の値を取得する
const parseTable = (dom) => {
    const table = [];

    const selector = "body > form > table:nth-child(8) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(2) > td > table > tbody > tr";
    const elements = dom.window.document.querySelectorAll(selector);
    console.log('履歴件数:', elements.length);

    elements.forEach(e => {
        table.push([
            e.querySelector('td:nth-child(1) > font').textContent.trim(),
            e.querySelector('td:nth-child(2) > font').textContent.trim(),
            e.querySelector('td:nth-child(3) > font').textContent.trim(),
            e.querySelector('td:nth-child(4) > font').textContent.trim(),
            e.querySelector('td:nth-child(5) > font').textContent.trim(),
            e.querySelector('td:nth-child(6) > font').textContent.trim(),
            e.querySelector('td:nth-child(7) > font').textContent.trim(),
        ]);
    });

    return table;
}
