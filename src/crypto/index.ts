import * as bip39 from "bip39"
import * as quais from "quais"

const { HDKey } = require("@scure/bip32")
const encryptor = require("@metamask/browser-passworder")

// Options:
const defaultHDPath = `m/44'/994'/0'/0`

export async function generateRandomMnemonic() {
  let mnemonic = bip39.generateMnemonic()
  return mnemonic
}

/**
 * Sets appropriate properties for the keyring based on the given
 * BIP39-compliant mnemonic.
 *
 * @param {string|Array<number>|Buffer} mnemonic - A seed phrase represented
 * as a string, an array of UTF-8 bytes, or a Buffer. Mnemonic input
 * passed as type buffer or array of UTF-8 bytes must be NFKD normalized.
 */
export async function getWalletFromMnemonic(mnemonic) {
  // validate before initializing
  const isValid = bip39.validateMnemonic(mnemonic)
  if (!isValid) {
    throw new Error("Hd-Keyring: Invalid secret recovery phrase provided")
  }

  const seedBuffer = await bip39.mnemonicToSeed(mnemonic)
  const seedUint8Array = Uint8Array.from(seedBuffer)
  return HDKey.fromMasterSeed(seedUint8Array)
}

/**
 * Returns a derived address from a given HDKey. Options available
 * are path (defaults to the Quai 994 path) and index (defaults to 0).
 *
 * @param hdKey
 * @param opts
 * @returns
 */
export function deriveAddress(hdKey, opts) {
  let path = opts.path || defaultHDPath
  let index = opts.index || 0

  let childKey = hdKey.derive(path + "/" + index.toString())
  let signingKey = new quais.utils.SigningKey(childKey.privateKey)
  let address = quais.utils.computeAddress(signingKey.publicKey)
  return address
}

/**
 * Takes in a password and wallet. Returns an encrypted form of the HD Key.
 * @param password
 * @param wallet
 * @returns
 */
export function encryptHDKey(password, wallet) {
  return encryptor.encrypt(password, wallet)
}

/**
 * Returns the decrypted HDKey from an encrypted file and password.
 * @param password
 * @param encrypted
 * @returns
 */
export async function decryptHDKey(password, encrypted) {
  let hdJson = await encryptor.decrypt(password, encrypted)
  return HDKey.fromJSON(hdJson)
}

/**
 * Takes in a password and mnemonic. Returns an encrypted form of the mnemonic.
 * @param password
 * @param mnemonic
 * @returns
 */
export function encryptMnemonic(password, mnemonic) {
  return encryptor.encrypt(password, mnemonic)
}

/**
 * Takes in a password and encrypted mnemonic. Returns a decrypted form of the mnemonic.
 * @param password
 * @param mnemonic
 * @returns
 */
export async function decryptMnemonic(password, encrypted) {
  return encryptor.decrypt(password, encrypted)
}
