const fs = require('fs');
const path = require('path');
const allFunctions = {}

const convertCurlyBracestoHashtag = (path) => {
  return path.split('/').reduce((acc, eachWord, index) => {
    let forwardSlash = '';
    if(index > 0){
      forwardSlash = '/';
    }
    if(eachWord.charAt(0) === '{' && eachWord.charAt(eachWord.length - 1) === '}'){
      return acc + forwardSlash + '#' + eachWord.substring(1, eachWord.length - 1);
    }
    return acc + forwardSlash + eachWord;
  },'');
}

const getHandlerArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map(channelName => {
    const channel = asyncapi.channels()[channelName];
    const topicName = convertCurlyBracestoHashtag(channelName);
    const resourceURI = `${resourceType}URI`
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
    return {id: `${resourceType}:${channel.publish()? channel.publish().id(): channel.subscribe().id()}`, data: {}}
  })
}

const getHandlersFromServers = (asyncapi, resourceType) => {
  return Object.entries(asyncapi.servers()).map(([serverName, serverInfo], index) => {
    const currServer = asyncapi.server(serverName);
    let brokerUrl = currServer.url();
    return {
        id : serverName,
        ref: currServer.protocol(),
        settings: {
            broker: brokerUrl.replace("{port}", currServer.variable("port").defaultValue()),
            id: "<SET THE CLIENT ID>",
        },
        handlers: getHandlerArr(asyncapi, resourceType)
      }
  });
}

allFunctions.generateFlogoJson = (asyncapi, resourceType) => {
  const channels = asyncapi.channels();
  const servers = asyncapi.servers();
  const importArr = Object.keys(servers).map((serverName, index) => {
    const currServer = asyncapi.server(serverName);
    let protocol = currServer.protocol();
    switch (protocol){
      case 'https' || 'http'        : return "github.com/project-flogo/contrib/trigger/rest";
      case 'kafka' || 'kafka-secure': return "github.com/project-flogo/contrib/trigger/kafka";
      case 'mqtt'                   : return "github.com/project-flogo/edge-contrib/trigger/mqtt";
      case 'ws' || 'wss'            : return "github.com/project-flogo/websocket/trigger/wsserver";
      case 'stomp'                  : return "github.com/jvanderl/flogo-components/trigger/stomp";                            
    }
  });

  importArr.unshift(`github.com/project-flogo/${resourceType}`);
  return finalInfo = {
    name: asyncapi.info().title(),
    type: "flogo:app",
    version: "0.0.1",
    appModel: asyncapi.info().version(),
    description: asyncapi.info().description().split(/\n/g)[0],
    imports: importArr,
    triggers:getHandlersFromServers(asyncapi, resourceType),
    resources: getResourcesArr(asyncapi, resourceType)
  }
}

module.exports = allFunctions;