const fs = require('fs');
const path = require('path');
const flogoGenerator = require('./flogo-generator.js');

module.exports = {
    'generate:before': generator => {
      let resourceType = 'flow';
      let protocol = '';
      if(generator.templateParams && generator.templateParams['resourceType'] === 'stream'){  //also pass server
        resourceType = 'stream';
      }
      if(generator.templateParams && generator.templateParams['protocol']){
        protocol = generator.templateParams['protocol'];
      }
      const flogoJSON = flogoGenerator(generator.asyncapi, resourceType, protocol);
      fs.writeFileSync(path.resolve(generator.targetDir, `flogo.json`), JSON.stringify(flogoJSON,null,2));
    }
}
