# Remix Optimism Compiler

<TODO>

## Install

In the Remix plugin manager activate Optimism Compiler.

<img src="./images/install.png" alt="installing" width="50%"/>

Now you should be able to compile Optimistic compatible smart contracts.

## Deploy to Optimistic Kovan using Remix

For this example we will use the following contract

```javascript
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract Greeter {
  string greeting;

  constructor(string memory _greeting) {
    greeting = _greeting;
  }

  function greet() public view returns (string memory) {
    return greeting;
  }

  function setGreeting(string memory _greeting) public {
    greeting = _greeting;
  }
}
```

We will assume you have funds in Optimistic Kovan. For a detailed guide on how to send funds to Optimistic Kovan follow [this tutorial](https://community.optimism.io/docs/users/gateway.html).

Now, go to the Optimism compiler and compile the contract.

Switch metamask to Optimistic Kovan by going to [https://chainid.link/?network=optimism-kovan](https://chainid.link/?network=optimism-kovan) and click connect.

<img src="./images/optimistic-kovan.png" alt="optimistic-kovan" width="50%"/>

Be sure metamask is in the following network:

<img src="./images/metamask.png" alt="metamask" width="50%"/>

Now go to the Deploy & Run transactions plugin and select injected provider and deploy the contract.

<img src="./images/injected-provider.png" alt="injected-provider" width="90%"/>

<IMAGE_DEPLOY>

## Issues

If you have any issues, please feel free to create an issue in our [Github repository](https://github.com/Machinalabs/remix-optimism-compiler-plugin/issues).