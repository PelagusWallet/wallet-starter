import type { Page } from "puppeteer"

import type { Context } from "../types"
import { wait } from "../utils"

export class WelcomePageTesters {
  private welcomePage: Page

  constructor(context: Context) {
    this.welcomePage = context.welcomePage
  }

  async checkTheBox() {
    await wait(250)
    const checkBox = await this.welcomePage.$('input[type="checkbox"]')
    await checkBox.click()
    await wait(250)
  }

  async clickCreateNewWallet() {
    await wait(250)
    await this.welcomePage.click('[data-testid="createWalletButton"]')
    await this.welcomePage.waitForSelector('[data-testid="passwordInput"]')
    await wait(250)
  }

  async setPassword(password) {
    await wait(250)
    const passwordInput = await this.welcomePage.$(
      '[data-testid="passwordInput"]'
    )
    await passwordInput.type(password)
    await wait(250)
  }

  async setPasswordConfirm(passwordConfirm) {
    await wait(250)
    const passwordConfirmInput = await this.welcomePage.$(
      '[data-testid="passwordConfirmInput"]'
    )
    await passwordConfirmInput.type(passwordConfirm)
    await wait(250)
  }

  async getPasswordErrorMessage() {
    await wait(250)
    const errorMessageElement = await this.welcomePage.$(
      '[data-testid="passwordErrorMessage"]'
    )
    const errorMessageText = await this.welcomePage.evaluate(
      (element) => element.textContent,
      errorMessageElement
    )
    return errorMessageText
  }

  async clickSubmitPassword() {
    await wait(250)
    const submitPasswordButton = await this.welcomePage.$(
      '[data-testid="submitPasswordButton"]'
    )
    await submitPasswordButton.click()
    await wait(250)
  }

  async clickCopySeedPhrase() {
    await wait(250)
    const copySeedPhraseButton = await this.welcomePage.$(
      '[data-testid="copySeedPhraseButton"]'
    )
    await copySeedPhraseButton.click()
    await wait(250)
  }

  async clickContinueSeedPhrase() {
    await wait(250)
    const continueSeedPhraseButton = await this.welcomePage.$(
      '[data-testid="continueSeedPhraseButton"]'
    )
    await continueSeedPhraseButton.click()
    await wait(250)
  }

  async clickPinExtensionButton() {
    await wait(250)
    const pinExtensionButton = await this.welcomePage.$(
      '[data-testid="pinExtensionButton"]'
    )
    await pinExtensionButton.click()
    await wait(250)
  }
}
