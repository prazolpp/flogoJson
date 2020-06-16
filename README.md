# Flogo JSON template for the AsyncAPI Generator

## Usage

```
ag asyncapi.yml prazolpp/flogoJson -o output
```

If you don't have the AsyncAPI Generator installed, you can install it like this:

```
npm install -g @asyncapi/generator
```

## Supported parameters

|Name|Description|Required|Allowed values|Example|
|---|---|---|---|---|
|resourceType|Defines the type of resource. Its value is 'flow' by default.|No|`flow`  `stream`|`stream`|
|protocol|Sets the protocol that the input yml follows.|Yes|`mqtt`  `http` `https` `kafka` `kafka-secure` `stomp` `ws` `wss`|`mqtt`|