
import MobilePasmo from './lib/mobilePasmo.mjs';
import { setTimeout } from "node:timers/promises";
import { getAccount, getAuthImage, setAuthImageBinary, removeAuthImageBinaryAndText, putSource } from './lib/dynamoDB.mjs';

export default async function main(page, id) {

    const mobilePasmo = new MobilePasmo(page);

    // ログインページを開く
    await mobilePasmo.openLoginPage();

    // --------------------------------------------------------------------------------
    // ログインページ
    // --------------------------------------------------------------------------------

    // 認証画像(バイナリ)を取得する
    const base64 = await mobilePasmo.getAuthenticationImage();
    // 認証画像(バイナリ)をDynamoDBに保存する
    await setAuthImageBinary(id, base64);

    // アカウント情報を取得する
    const account = await getAccount(id);
    // console.log(account)

    // 認証テキストをDBから取得する
    let authImage;
    for (let i = 0; i < 20; i++) {
        console.log(`待機${i + 1}回目`);
        authImage = await getAuthImage(id);
        if (authImage.text.length > 0) {
            break
        }
        await setTimeout(3000);
    }

    // ログインする
    await Promise.all([
        page.waitForNavigation(),
        mobilePasmo.login(account.mailAddress, account.password, authImage.text)
    ]);

    // DynamoDBから認証画像のバイナリとテキストを削除する
    await removeAuthImageBinaryAndText(id);

    // --------------------------------------------------------------------------------
    // PASMO一覧ページ
    // --------------------------------------------------------------------------------

    console.log('title:', await page.title());
    //=> モバイルPASMO＞PASMO一覧

    // ソースをDBへ保存する
    await putSource(id, 'cards#list#source', await page.url(), await mobilePasmo.getSource());

    // 次へボタンをクリックする
    await Promise.all([
        page.waitForNavigation(),
        page.click('input[name="NEXT"]')
    ]);

    // --------------------------------------------------------------------------------
    // 会員メニューページ
    // --------------------------------------------------------------------------------

    console.log('title:', await page.title());
    // => モバイルPASMO＞会員メニュー


    // ソースをDBへ保存する
    await putSource(id, 'card1#index#source', await page.url(), await mobilePasmo.getSource());

    // 残額履歴ボタンをクリックする
    await Promise.all([
        page.waitForNavigation(),
        await page.click('img[alt="SF(電子マネー)利用履歴"]')
    ]);

    // --------------------------------------------------------------------------------
    //  残額履歴ページ
    // --------------------------------------------------------------------------------

    console.log('title:', await page.title());
    //=> モバイルPASMO＞SF（電子マネー）残額履歴

    // ソースをDBへ保存する
    await putSource(id, 'card1#history#source', await page.url(), await mobilePasmo.getSource());

}
