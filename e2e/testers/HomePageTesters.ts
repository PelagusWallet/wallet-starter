import type { Page } from "puppeteer"

import type { Context } from "../types"
import { wait } from "../utils"

export class HomePageTesters {
  private extensionPage: Page

  constructor(context: Context) {
    this.extensionPage = context.extensionPage
  }

  async goToTextSettingsPage() {
    await wait(500)
    const textSettings = await this.extensionPage.$(
      '[data-testid="text-settings"]'
    )
    await textSettings.click()
    await wait(500)
  }

  async goToOverlayPage() {
    await wait(500)
    const overlaySettings = await this.extensionPage.$(
      '[data-testid="overlay-tint"]'
    )
    await overlaySettings.click()
    await wait(500)
  }

  async goToLineFocusPage() {
    await wait(500)
    const overlaySettings = await this.extensionPage.$(
      '[data-testid="line-focus"]'
    )
    await overlaySettings.click()
    await wait(500)
  }

  async goBack() {
    await wait(500)
    const backButton = await this.extensionPage.$(
      '[data-testid="nav-back-button"]'
    )
    await backButton.click()
    await wait(500)
  }
}
