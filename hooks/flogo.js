const fs = require('fs');
const path = require('path');
const flogoGenerator = require('./flogoFunctions.js');

module.exports = {
    'generate:before': generator => {
      let resourceType = 'flow';
      let protocol = '';
      if(generator.templateParams && generator.templateParams['resourceType'] === 'stream'){  //also pass server
        resourceType = 'stream';
      }
      if(generator.templateParams['protocol']){
        protocol = generator.templateParams['protocol'];
      }
      const flogoJson = flogoGenerator(generator.asyncapi, resourceType, protocol);
      fs.writeFileSync(path.resolve(generator.targetDir, `flogo.json`), JSON.stringify(flogoJson,null,2));
    }
}
