
const fs = require('fs');
const path = require('path');

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


module.exports = {
    'generate:before': generator => {

      const asyncapi = generator.asyncapi;
      const channels = asyncapi.channels();

      const getHandlerArr = () => {
        return asyncapi.channelNames().map(channelName => {
          const channel = channels[channelName];
          const topicName = convertCurlyBracestoHashtag(channelName);
          return {
              settings: {
                  topic: topicName,
              },
              action: {
                  ref : "#flow",
                  settings: {
                      flowURI: `res://flow:${channel.publish()? channel.publish().id(): channel.subscribe().id()}`
                  }
              }
          }
        });
      }
      
      const getHandlersFromServers = () => {
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
              handlers: getHandlerArr(asyncapi.channelNames(), channels)
            }
        });
      }

      const getResourcesArr = () => {
        return asyncapi.channelNames().map((channelName, index) => {
          const channel = channels[channelName];
          return {id: `flow:${channel.publish()? channel.publish().id(): channel.subscribe().id()}`, data: {}}
        })
      }

      let finalInfo = {
        name: asyncapi.info().title(),
        type: "flogo:app",
        version: "0.0.1",
        appModel: asyncapi.info().version(),
        description: asyncapi.info().description().split(/\n/g)[0],
        imports: [
          "github.com/project-flogo/flow",
          "github.com/project-flogo/edge-contrib/trigger/mqtt"
        ],
        triggers:getHandlersFromServers(),
        resources: getResourcesArr()
      }
      fs.writeFileSync(path.resolve(generator.targetDir, `streetlights.json`), JSON.stringify(finalInfo,null,2));
    }
  }