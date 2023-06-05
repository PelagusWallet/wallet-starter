import puppeteer, { Browser, Page } from "puppeteer"

import { EXTENSION_ID, POPUP_PAGE } from "./constants"
import type { Context } from "./types"

export class BrowserManager {
  browser: Browser
  appPage: Page | null = null
  extensionPage: Page | null = null
  welcomePage: Page | null = null
  extensionUrl: string = `chrome-extension://${EXTENSION_ID}/${POPUP_PAGE}.html`
  welcomeUrl: string = `chrome-extension://${EXTENSION_ID}/tabs/welcome.html`

  async setupWelcomePage(options) {
    const { devtools = false, slowMo = 0, appUrl } = options
    this.browser = await puppeteer.launch({
      headless: false,
      devtools,
      args: [
        "--disable-extensions-except=./build/chrome-mv3-dev",
        "--load-extension=./build/chrome-mv3-dev"
      ],
      slowMo
    })

    // Store all browser tabs
    let pages = await this.browser.pages()

    // Handle new tabs
    this.browser.on("targetcreated", async () => {
      pages = await this.browser.pages()
    })

    // Execute your extension which opens a new tab

    // Wait for the new tab to open
    while (pages.length !== 2) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      pages = await this.browser.pages()
    }

    this.welcomePage = pages[1]
    await this.welcomePage.goto(this.welcomeUrl, { waitUntil: "load" })
  }

  getWelcomePage(): Page | null {
    return this.welcomePage
  }

  async getExtensionPage(): Promise<Page | null> {
    this.extensionPage = await this.browser.newPage()
    const extensionUrl = `chrome-extension://${EXTENSION_ID}/${POPUP_PAGE}.html`
    await this.extensionPage.goto(extensionUrl, { waitUntil: "load" })
    return this.extensionPage
  }
}
