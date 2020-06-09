const fs = require('fs');
const path = require('path');
const flogoFunctions = require('./flogoFunctions.js');

module.exports = {
    'generate:before': generator => {
      let resourceType = 'flow';
      if(generator.templateParams && generator.templateParams['resourceType'] === 'stream'){
        resourceType = 'stream';
      }
      const finalInfo = flogoFunctions.generateFlogoJson(generator.asyncapi, resourceType);
      fs.writeFileSync(path.resolve(generator.targetDir, `flogo.json`), JSON.stringify(finalInfo,null,2));
    }
  }