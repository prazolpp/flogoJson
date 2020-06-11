const getProtocol =  require('./protocol');

const flogoGenerator = (asyncapi, resourceType, protocol) => {

  if(getProtocol(protocol)){
    let generateFlogo = getProtocol(protocol);
    return {
      name: asyncapi.info().title(),
      type: "flogo:app",
      version: "0.0.1",
      appModel: asyncapi.info().version(),
      description: asyncapi.info().description().split(/\n/g)[0], //ask matt if we want to dump the whole description or use only one line
      imports:   generateFlogo(asyncapi, resourceType).imports,
      triggers:  generateFlogo(asyncapi, resourceType).triggers,
      resources: generateFlogo(asyncapi,resourceType).resources
    }
  }
  throw new Error("The entered protocol is not found!");
}

module.exports = flogoGenerator;
