![Pelagus Icon](./assets/logos/white/png/horizontal-lockup.png)

# Pelagus: Embark on Web3

**Disclaimer: This project is currently in an early alpha stage. This means it's under active development, and it's likely that you'll encounter bugs and unexpected behavior. Please use it with caution and report any issues you find. Your patience and assistance are appreciated as we work to improve Pelagus.**

Welcome to the GitHub repository for Pelagus, a dedicated cryptocurrency wallet extension for the Quai Network.
This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

# Events

Pelagus provides custom events using `CustomEvent` web API.

### `networkChanged`

networkChanged is called when the user switches networks in the Pelagus extension.

```ts
window.addEventListener("networkChanged", (e) => {
  const newNetwork = e.detail.network
  /** Handle network switch **/
})
```

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

# Unrestricted API Methods

## wallet_getPermissions

Gets permissions for the site.

### Returns

An array of the caller's permission objects.

### Example

```js
document.getElementById("getPermissionsButton", getPermissions)

function getPermissions() {
  quai
    .request({
      method: "wallet_getPermissions"
    })
    .then((permissions) => {
      console.log(permissions)
    })
}
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

# Restricted API Methods

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

Visit the **[CONTRIBUTING](.github/CONTRIBUTING.md)** file for information on how to hack on Pelagus.

## 🎉 Was the extension helpful? Help us raise these numbers up

[![GitHub followers](https://img.shields.io/github/followers/PelagusWallet.svg?style=social)](https://github.com/PelagusWallet)
[![GitHub stars](https://img.shields.io/github/stars/PelagusWallet/pelagus-extension.svg?style=social)](https://github.com/PelagusWallet/pelagus-extension/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/PelagusWallet/pelagus-extension.svg?style=social)](https://github.com/PelagusWallet/pelagus-extension/watchers)
[![GitHub forks](https://img.shields.io/github/forks/PelagusWallet/pelagus-extension.svg?style=social)](https://github.com/PelagusWallet/pelagus-extension/network/members)

Enjoy! 🥳

## ⚖️📝 **License and Changelog**

See the license in the **[LICENSE](LICENSE.md)** file.

Watch the changes in the **[CHANGELOG.md](CHANGELOG.md)** file.
