import { bootstrap } from "./bootstrap"
import { TEST_PAGE_SERVER_PORT } from "./constants"
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

    const context = await bootstrap({ appUrl })
    const { appPage, browser, extensionPage } = context

    try {
      const welcomePageTesters = new WelcomePageTesters(context)
      // const homePageTesters = new HomePageTesters(context)

      await welcomePageTesters.checkTheBox()
      await welcomePageTesters.clickCreateNewWallet()

      await welcomePageTesters.setPassword("password")
      await welcomePageTesters.setPasswordConfirm("password")
      await welcomePageTesters.clickSubmitPassword()
      await welcomePageTesters.clickCopySeedPhrase()
      await welcomePageTesters.clickContinueSeedPhrase()
      await wait(1000)
    } finally {
      await browser.close()
    }
  })
})

describe("Setup unhappy paths", () => {
  test("Mismatching Passwords", async () => {
    const appUrl = `http://localhost:${TEST_PAGE_SERVER_PORT}/basic-page.html`
    const context = await bootstrap({ appUrl })
    const { appPage, browser, extensionPage } = context
    const welcomePageTesters = new WelcomePageTesters(context)

    try {
      await welcomePageTesters.checkTheBox()
      await welcomePageTesters.clickCreateNewWallet()

      await welcomePageTesters.setPassword("password1")
      await welcomePageTesters.setPasswordConfirm("password2")
      await welcomePageTesters.clickSubmitPassword()

      const errorMessage = await welcomePageTesters.getPasswordErrorMessage()
      expect(errorMessage).toEqual("Passwords do not match")

      await wait(500)
    } finally {
      await browser.close()
    }
  })

  test("Short Password", async () => {
    const appUrl = `http://localhost:${TEST_PAGE_SERVER_PORT}/basic-page.html`
    const context = await bootstrap({ appUrl })
    const { appPage, browser, extensionPage } = context
    const welcomePageTesters = new WelcomePageTesters(context)

    try {
      await welcomePageTesters.checkTheBox()
      await welcomePageTesters.clickCreateNewWallet()

      await welcomePageTesters.setPassword("short")
      await welcomePageTesters.setPasswordConfirm("short")
      await welcomePageTesters.clickSubmitPassword()

      const errorMessage = await welcomePageTesters.getPasswordErrorMessage()
      expect(errorMessage).toEqual("Password must be at least 8 characters")

      await wait(500)
    } finally {
      await browser.close()
    }
  })
})
