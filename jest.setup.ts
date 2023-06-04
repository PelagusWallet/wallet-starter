import "@testing-library/jest-dom"

import { Crypto } from "@peculiar/webcrypto"
import { TextEncoder } from "util"

global.TextEncoder = TextEncoder

// Delete the existing 'crypto' property if it exists
if (global.crypto) {
  delete global.crypto
}

// Set up the polyfill
global.crypto = new Crypto()
