
import MobilePasmo from './lib/mobilePasmo.mjs';
import { setTimeout } from "node:timers/promises";
import { getAccount, getAuthImage, setAuthImageBinary, removeAuthImageBinaryAndText, putSource } from './lib/dynamoDB.mjs';

export default async function main(page, id) {

    const mobilePasmo = new MobilePasmo(page);

    // ログインページを開く
    await mobilePasmo.openLoginPage();

    // 認証画像(バイナリ)を取得する
    const base64 = await mobilePasmo.getAuthenticationImage();
    // 認証画像(バイナリ)をDynamoDBに保存する
    await setAuthImageBinary(id, base64);

    // アカウント情報を取得する
    const account = await getAccount(id);
    // console.log(account)

    // 認証テキストをDynamoDBから取得する
    let authImage;
    for (let i = 0; i < 20; i++) {
        console.log(`${i + 1}回目`);
        authImage = await getAuthImage(id);
        if (authImage.text.length > 0) {
            break
        }
        await setTimeout(3000);
    }

    // ログインする
    await mobilePasmo.login(account.mailAddress, account.password, authImage.text);

    // ページ遷移が完了するまで待機する
    await page.waitForNavigation();

    // タイトルを取得する
    const title = await mobilePasmo.getTitle();

    // タイトルが「モバイルPASMO＞PASMO一覧'」なら、DynamoDBにソースを保存する
    if (title === 'モバイルPASMO＞PASMO一覧') {
        const source = await mobilePasmo.getSource();
        // console.log(source);
        await putSource(id, source);
    }

    // DynamoDBから認証画像のバイナリとテキストを削除する
    await removeAuthImageBinaryAndText(id);
}
