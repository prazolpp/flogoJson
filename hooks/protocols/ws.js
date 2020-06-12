const { convertCurlyBracesToHashtag } = require("./utils.js");

const getHandlerArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName) => {
    const channel = asyncapi.channels()[channelName];
    const topicName = convertCurlyBracesToHashtag(channelName);
    const resourceURI = `${resourceType}URI`;

    //todo: determine the functions to structure the returned object 
    return { 
      settings: {
        topic: topicName,
      },
      action: {
        ref: `#${resourceType}`,
        settings: {
          [resourceURI]: `res://${resourceType}:${
            channel.publish()
              ? channel.publish().id()
              : channel.subscribe().id()
          }`,
        },
      },
    };
  });
};

const getResourcesArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName, index) => {
    const channel = asyncapi.channels()[channelName];
    return {
      id: `${resourceType}:${
        channel.publish() ? channel.publish().id() : channel.subscribe().id()
      }`,
      data: {},
    };
  });
};

const getHandlersFromServers = (asyncapi, resourceType) => {
  return Object.entries(asyncapi.servers()).map(
    ([serverName, serverInfo], index) => {
      const currServer = asyncapi.server(serverName);
      let brokerUrl = currServer.url();
      let protocol = currServer.protocol();
      //todo: determine the functions to structure the returned object
      return {
        id: serverName,
        ref: `#${protocol}`,
        settings: {
        },
        handlers: getHandlerArr(asyncapi, resourceType, protocol),
      };
    }
  );
};

const getImports = (resourceType) => {
  return [
    `github.com/project-flogo/${resourceType}`,
    "github.com/project-flogo/websocket/trigger/wsserver",
  ];
};

const generateJson = (asyncapi, resourceType) => {
  return {
    triggers: getHandlersFromServers(asyncapi, resourceType),
    resources: getResourcesArr(asyncapi, resourceType),
    imports: getImports(resourceType),
  };
};

module.exports = generateJson;