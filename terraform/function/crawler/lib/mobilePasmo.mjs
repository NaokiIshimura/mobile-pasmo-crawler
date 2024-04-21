export default class MofilePasmo {
    constructor(page) {
        this.page = page;
    }

    async getTitle() {
        const title = await this.page.title();
        // console.log(title);
        return title;
    }

    async openLoginPage() {
        await this.#openLoginPage();
        await this.getTitle();
    }

    async getAuthenticationImage() {
        const base64 = await this.#getAuthenticationImage();
        return base64;
    }

    async login(mailAddress, password, authText) {
        await this.#inputMailAddress(mailAddress);
        await this.#inputPassword(password);
        await this.#inputAuthText(authText);

        const loginButton = await this.page.$("input[name='LOGIN']");
        await loginButton.click();
    }

    async getSource() {
        return await this.page.content();
    }

    async #openLoginPage() {
        await this.page.goto('https://www.mobile.pasmo.jp/');
    }

    async #inputMailAddress(mailAddress) {
        const input = await this.page.$("input[name='MailAddress']");
        await input?.type(mailAddress);
    }

    async #inputPassword(password) {
        const input = await this.page.$("input[name='Password']");
        await input?.type(password);
    }

    async #inputAuthText(authText) {
        const input = await this.page.$("#WebCaptcha1__editor");
        await input?.type(authText);
    }

    async #getAuthenticationImage() {
        // Puppeteerを使って指定したDOMのみのスクリーンショットを取得する
        // https://qiita.com/tamanugi/items/8cc1266265457f13b9ea
        const targetElementSelector = '#WebCaptcha1 > div.igc_Windows7CaptchaImageArea > img'
        const clip = await this.page.evaluate(s => {
            const el = document.querySelector(s)
            // エレメントの高さと位置を取得
            const { width, height, top: y, left: x } = el.getBoundingClientRect()
            return { width, height, x, y }
        }, targetElementSelector)

        const base64 = await this.page.screenshot({ clip, encoding: 'base64' })
        // console.log('認証画像(base64:末尾5文字)', base64.slice(-5));
        return base64;
    }
}
