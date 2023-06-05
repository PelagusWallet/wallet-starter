import { BrowserManager } from "./bootstrap"
import { TEST_PAGE_SERVER_PORT } from "./constants"
import { EXTENSION_ID, POPUP_PAGE } from "./constants"
import testPageServer from "./testPageServer"
import { HomePageTesters } from "./testers/HomePageTesters"
import { WelcomePageTesters } from "./testers/WelcomePageTesters"
import { wait } from "./utils"

jest.setTimeout(10 * 60 * 1000)

beforeAll(() => {
  testPageServer.listen(TEST_PAGE_SERVER_PORT)
})

afterAll(() => {
  testPageServer.close()
})

describe("Clean setup", () => {
  test("text changes are applied", async () => {
    const appUrl = `http://localhost:${TEST_PAGE_SERVER_PORT}/basic-page.html`

    const manager = new BrowserManager()
    await manager.setupWelcomePage({ appUrl })

    const welcomePage = manager.getWelcomePage()
    if (!welcomePage) {
      throw new Error("Welcome page not found.")
    }

    try {
      const welcomePageTesters = new WelcomePageTesters(manager)

      await welcomePageTesters.checkTheBox()
      await welcomePageTesters.clickCreateNewWallet()

      await welcomePageTesters.setPassword("password")
      await welcomePageTesters.setPasswordConfirm("password")
      await welcomePageTesters.clickSubmitPassword()
      await welcomePageTesters.clickCopySeedPhrase()
      await welcomePageTesters.clickContinueSeedPhrase()

      const extensionPage = await manager.getExtensionPage()
      if (!extensionPage) {
        throw new Error("Extension page not found.")
      }

      // Perform actions on the extension page

      await wait(1000)
    } finally {
      await manager.browser.close()
    }
  })
})

describe("Setup unhappy paths", () => {
  test("Mismatching Passwords", async () => {
    const appUrl = `http://localhost:${TEST_PAGE_SERVER_PORT}/basic-page.html`
    const manager = new BrowserManager()
    await manager.setupWelcomePage({ appUrl })

    const welcomePage = manager.getWelcomePage()
    if (!welcomePage) {
      throw new Error("Welcome page not found.")
    }

    try {
      const welcomePageTesters = new WelcomePageTesters(manager)

      await welcomePageTesters.checkTheBox()
      await welcomePageTesters.clickCreateNewWallet()

      await welcomePageTesters.setPassword("password1")
      await welcomePageTesters.setPasswordConfirm("password2")
      await welcomePageTesters.clickSubmitPassword()

      const errorMessage = await welcomePageTesters.getPasswordErrorMessage()
      expect(errorMessage).toEqual("Passwords do not match")

      await wait(500)
    } finally {
      await manager.browser.close()
    }
  })

  test("Short Password", async () => {
    const appUrl = `http://localhost:${TEST_PAGE_SERVER_PORT}/basic-page.html`
    const manager = new BrowserManager()
    await manager.setupWelcomePage({ appUrl })

    const welcomePage = manager.getWelcomePage()
    if (!welcomePage) {
      throw new Error("Welcome page not found.")
    }

    try {
      const welcomePageTesters = new WelcomePageTesters(manager)
      await welcomePageTesters.checkTheBox()
      await welcomePageTesters.clickCreateNewWallet()

      await welcomePageTesters.setPassword("short")
      await welcomePageTesters.setPasswordConfirm("short")
      await welcomePageTesters.clickSubmitPassword()

      const errorMessage = await welcomePageTesters.getPasswordErrorMessage()
      expect(errorMessage).toEqual("Password must be at least 8 characters")

      await wait(500)
    } finally {
      await manager.browser.close()
    }
  })
})
