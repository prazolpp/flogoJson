const fs = require('fs');
const path = require('path');

module.exports = {
  'generate:before': generator => {
    const asyncapi = generator.asyncapi;
    const channels = asyncapi.channels();
    const channelNames = asyncapi.channelNames();
    console.log(asyncapi.info().description());

    let channelInfo = {
      channels: channelNames.map(channelName => {
        const channel = channels[channelName];
        if(channel.hasPublish()){
          return {name: channelName, operations: [{name: "publish", id: channel.publish().id()}]}
        }
        else if(channel.hasSubscribe()){
          return {name: channelName, operations: [{name: "subscribe", id: channel.subscribe().id()}]}
        }
      })
      
    }
    fs.writeFileSync(path.resolve(generator.targetDir, `flogo.json`), JSON.stringify(generator.asyncapi.json(),null,2));
    fs.writeFileSync(path.resolve(generator.targetDir, `channels.json`), JSON.stringify(channelInfo,null,2));
  }
}