import * as bip39 from "bip39"
import * as quais from "quais"

import {
  decryptHDKey,
  deriveAddress,
  encryptHDKey,
  generateRandomMnemonic,
  getWalletFromMnemonic
} from "~crypto"

describe("generateRandomMnemonic", () => {
  it("should generate a valid mnemonic", async () => {
    const mnemonic = await generateRandomMnemonic()
    expect(bip39.validateMnemonic(mnemonic)).toBe(true)
  })
})

describe("getWalletFromMnemonic", () => {
  it("should return an HDKey from a valid mnemonic", () => {
    const mnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    const wallet = getWalletFromMnemonic(mnemonic)
    expect(wallet.constructor.name).toBe("HDKey")
  })

  it("should throw an error for an invalid mnemonic", () => {
    const mnemonic = "invalid mnemonic"
    expect(() => getWalletFromMnemonic(mnemonic)).toThrowError()
  })
})

describe("deriveAddress", () => {
  it("should derive an address from an HDKey", () => {
    const mnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    const wallet = getWalletFromMnemonic(mnemonic)
    const address = deriveAddress(wallet, { path: `m/44'/994'/0'/0` })
    expect(quais.utils.isAddress(address)).toBe(true)
  })
})

describe("encryptHDKey and decryptHDKey", () => {
  it("should encrypt and decrypt an HDKey", () => {
    const mnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    const wallet = getWalletFromMnemonic(mnemonic)
    const password = "password"
    const encrypted = encryptHDKey(password, wallet)
    const decrypted = decryptHDKey(password, encrypted)
    expect(decrypted).toEqual(wallet.toJSON())
  })
})
