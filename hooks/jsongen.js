const fs = require('fs');
const path = require('path');

module.exports = {
  'generate:before': generator => {
    const channels = generator.asyncapi.channels();

    let channelInfo = {
      channels: Object.entries(channels).map((eachChannel, index) => {
        console.log(eachChannel);
        if('subscribe' in eachChannel[1]._json){
          return {name: eachChannel[0], operations:[{name: "subscribe", id: eachChannel[1]._json.subscribe.operationId}]};
        }
        return {name: eachChannel[0], operations:[{name: "publish", id: eachChannel[1]._json.publish.operationId }]};
      })
    }
    fs.writeFileSync(path.resolve(generator.targetDir, `flogo.json`), JSON.stringify(asyncapi,null,2));
    fs.writeFileSync(path.resolve(generator.targetDir, `channels.json`), JSON.stringify(channelInfo,null,2));
  }/*,
  'generate:after': generator => {
    fs.readdir(generator.targetDir, (err, files) => {
      files.forEach((filename, index) => {
        if(filename !== `flogo.json`){
          fs.unlink(path.resolve(generator.targetDir, filename), (err) => {
            if(err){
              console.log(err);d
            }
            return;
          });
        }
      })
    })
  }*/
};