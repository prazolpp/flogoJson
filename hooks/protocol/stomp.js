const convertCurlyBracestoHashtag = require('./convertCurlyBracestoHashtag.js');

const getHandlerArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map(channelName => {
    const channel = asyncapi.channels()[channelName];
    const topicName = convertCurlyBracestoHashtag(channelName);
    const resourceURI = `${resourceType}URI`;

    return {
        settings: {
            topic: topicName,
        },
        action: {
            ref : `#${resourceType}`,
            settings: {
                [resourceURI] :`res://${resourceType}:${channel.publish()? channel.publish().id(): channel.subscribe().id()}`
            }
        }
    }
  });
}

const getResourcesArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName, index) => {
    const channel = asyncapi.channels()[channelName];
    return {id: `${resourceType}:${channel.publish()? channel.publish().id(): channel.subscribe().id()}`, data: {}};
  })
}

const getHandlersFromServers = (asyncapi, resourceType) => {

  return Object.entries(asyncapi.servers()).map(([serverName, serverInfo], index) => {
    const currServer = asyncapi.server(serverName);
    let brokerUrl = currServer.url();
    return {
        id : serverName,
        ref: `#${currServer.protocol()}`,
        settings: {
            address: currServer.variable("port").defaultValue(), //????
        },
        handlers: getHandlerArr(asyncapi, resourceType, currServer.protocol())
    }
  });
}

const getImports = (resourceType) => {
    return [`github.com/project-flogo/${resourceType}`,"github.com/jvanderl/flogo-components/trigger/stomp"] ;
}

const generateJson = (asyncapi, resourceType) => {
    return {
        triggers: getHandlersFromServers(asyncapi, resourceType),
        resources: getResourcesArr(asyncapi, resourceType),
        imports: getImports(resourceType)
    }
}

module.exports = generateJson;