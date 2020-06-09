
const fs = require('fs');
const path = require('path');

module.exports = {
    'generate:before': generator => {
      const asyncapi = generator.asyncapi;
      const name = asyncapi.info().title();
      const type = "flogo:app";
      const appModel = asyncapi.info().version();
      const description = asyncapi.info().description();
      const channels = asyncapi.channels();
      const channelNames = asyncapi.channelNames();
      const serverObjs = asyncapi.servers();
      
      const serverArr = Object.entries(serverObjs).map(([serverName, serverInfo], index) => {
        const currServer = asyncapi.server(serverName);
        const handlers = channelNames.map(channelName => {
            const channel = channels[channelName];
            const topicName = channelName.split('/').reduce((acc, eachWord, index) => {
              let forwardSlash = '';
              if(index > 0){
                forwardSlash = '/';
              }
              if(eachWord.charAt(0) === '{' && eachWord.charAt(eachWord.length - 1) === '}'){
                return acc + forwardSlash + '#' + eachWord.substring(1, eachWord.length - 1);
              }
              return acc + forwardSlash + eachWord;
            },'');
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
        let brokerUrl = currServer.url();
        return {
            id : serverName,
            ref: currServer.protocol(),
            settings: {
                broker: brokerUrl.replace("{port}", currServer.variable("port").defaultValue()),
                id: "<SET THE CLIENT ID>",

            },
            handlers: handlers
          }
      });

      let finalInfo = {
          name: name,
          type: type,
          version: "0.0.1",
          appModel: appModel,
          description: description.split(/\n/g)[0],
          imports: [
            "github.com/project-flogo/flow",
            "github.com/project-flogo/edge-contrib/trigger/mqtt"
          ],
          triggers: serverArr,
          resources: channelNames.map((channelName, index) => {
            const channel = channels[channelName];
            return {id: `flow:${channel.publish()? channel.publish().id(): channel.subscribe().id()}`, data: {}}
          })
      }
      fs.writeFileSync(path.resolve(generator.targetDir, `streetlights.json`), JSON.stringify(finalInfo,null,2));
    }
  }