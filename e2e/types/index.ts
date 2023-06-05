import type { Browser, Page } from "puppeteer"

export type Context = {
  appPage: Page
  browser: Browser
  extensionUrl: string
  extensionPage: Page
  welcomeUrl: string
  welcomePage: Page
}
