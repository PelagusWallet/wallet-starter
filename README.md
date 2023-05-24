![Pelagus Icon](./assets/icon.png)

# Pelagus: Embark on Web3

**Disclaimer: This project is currently in an early alpha stage. This means it's under active development, and it's likely that you'll encounter bugs and unexpected behavior. Please use it with caution and report any issues you find. Your patience and assistance are appreciated as we work to improve Pelagus.**

Welcome to the GitHub repository for Pelagus, a dedicated cryptocurrency wallet extension for the Quai Network.
This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

# Quai Provider API

## window.quai.request(args)

```js
interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

window.quai.request(args: RequestArguments): Promise<unknown>;
```

Use this method to submit RPC API requests to Quai Network using Pelagus. It returns a promise that resolves to the result of the RPC method call.

The parameters and return value vary by RPC method. In practice, if a method has parameters, they're almost always of type Array<any>.

If the request fails, the promise rejects with an error.

# API Methods

## quai_sendTransaction

This method is used to send a transaction.

### Parameters

A single transaction object is accepted as a parameter.

### Returns

This method returns a promise that resolves to a transaction hash hexadecimal string upon success.

### Example

```js
params: [
  {
    from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    gas: "0x76c0", // 30400
    maxFeePerGas: "0x9184e72a000", // 10000000000000
    maxPriorityFeePerGas: "0x9184e72a000", // 10000000000000
    value: "0x9184e72a", // 2441406250
    data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
  }
]

window.quai
  .request({
    method: "quai_sendTransaction",
    params
  })
  .then((result) => {
    // The result varies by RPC method.
    // For example, this method returns a transaction hash hexadecimal string upon success.
  })
  .catch((error) => {
    // If the request fails, the Promise rejects with an error.
  })
```

## wallet_requestPermissions

Requests permissions from the user.
The request causes a Pelagus popup to appear. You should only request permissions in response to a direct user action, such as a button click.

### Parameters

An array containing the requested permission objects.

### Returns

An array of the caller's permission objects. If the user denies the request, a 4001 error is returned.

### Example

```js
document.getElementById("requestPermissionsButton", requestPermissions)

function requestPermissions() {
  quai
    .request({
      method: "wallet_requestPermissions",
      requestedMethods: ["quai_requestAccounts"]
    })
    .then((permissions) => {
      const accountsPermission = permissions.find(
        (permission) => permission.parentCapability === "quai_requestAccounts"
      )
      if (accountsPermission) {
        console.log("quai_requestAccounts permission successfully requested!")
      }
    })
    .catch((error) => {
      if (error.code === 4001) {
        console.log("Permissions needed to continue.")
      } else {
        console.error(error)
      }
    })
}
```

## quai_requestAccounts

Requests that the user provide an Quai address to be identified by. Use this method to access a user's accounts.

### Returns

If the user accepts the request, this method returns an array of a single, hexadecimal Quai address string. If they reject the request, this method rejects with a 4001 error.

### Example

```js
document.getElementById("connectButton", connect)

function connect() {
  ethereum
    .request({ method: "quai_requestAccounts" })
    .then(handleAccountsChanged)
    .catch((error) => {
      if (error.code === 4001) {
        console.log("Please connect to Pelagus.")
      } else {
        console.error(error)
      }
    })
}
```

## personal_sign

This method requests the user to sign a given data with their private key.

### Parameters

params[0] - String: The message to sign.
params[1] - String: The account to sign with.

### Returns

A promise that resolves to the signature string of the provided message.

### Example

```js
await window.quai.request({
  method: "personal_sign",
  params: ["hello", "0x06BeDcD422F569735D02293083deFf4B366990fe"]
})
```

# Contributing

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/workflows/submit) and you should be on your way for automated submission!

[General Disclaimer](https://docs.quai.network/disclaimers/quai-network-wallet-terms-of-use)
