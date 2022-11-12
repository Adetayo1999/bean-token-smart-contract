# Bean Token Contract

This is the backend of a ERC20 token built with the hardhat development framework,
the token is only present on 2 testnets, Goerli and polygon mumbai

## API Reference

#### Start A Local Node

```http
  yarn hardhat node
```

#### Run the deploy scripts

```http
  yarn hardhat deploy --network {network-name}
```

| Parameter      | Type     | Description                                                         |
| :------------- | :------- | :------------------------------------------------------------------ |
| `network-name` | `string` | Not required, if not provided defaults to the local hardhat network |

#### Run unit tests

```http
  yarn hardhat test --network {network-name}
```
