import puppeteer from "puppeteer"

import { EXTENSION_ID, POPUP_PAGE } from "./constants"
import type { Context } from "./types"

export async function bootstrap(options: {
  devtools?: boolean
  slowMo?: number
  appUrl: string
}): Promise<Context> {
  const { devtools = false, slowMo = 0, appUrl } = options
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: [
      "--disable-extensions-except=./build/chrome-mv3-dev",
      "--load-extension=./build/chrome-mv3-dev"
    ],
    slowMo
  })

  // Store all browser tabs
  let pages = await browser.pages()

  // Handle new tabs
  browser.on("targetcreated", async () => {
    pages = await browser.pages()
  })

  // Execute your extension which opens a new tab

  // Wait for the new tab to open
  while (pages.length != 2) {
    pages = await browser.pages()
    console.log("Waiting for extension to open...", pages.length)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  const appPage = null
  // await appPage.goto(appUrl, { waitUntil: "load" })

  const extensionPage = null
  const extensionUrl = `chrome-extension://${EXTENSION_ID}/${POPUP_PAGE}.html`
  // await extensionPage.goto(extensionUrl, { waitUntil: "load" })

  console.log("pages", pages)
  const welcomePage = pages[1]
  const welcomeUrl = `chrome-extension://${EXTENSION_ID}/tabs/welcome.html`
  await welcomePage.goto(welcomeUrl, { waitUntil: "load" })

  return {
    appPage,
    browser,
    extensionUrl,
    extensionPage,
    welcomeUrl,
    welcomePage
  }
}
