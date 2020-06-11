const getProtocol =  require('./protocol');

const flogoGenerator = (asyncapi, resourceType, protocol) => {

  if(getProtocol(protocol)){
    const generateFlogo = getProtocol(protocol);
    const flogoParts = generateFlogo(asyncapi, resourceType);
    return {
      name: asyncapi.info().title(),
      type: "flogo:app",
      version: "0.0.1",
      appModel: asyncapi.info().version(),
      description: asyncapi.info().description().split(/\n/g)[0], //ask matt if we want to dump the whole description or use only one line
      imports:   flogoParts.imports,
      triggers:  flogoParts.triggers,
      resources: flogoParts.resources
    }
  }
  throw new Error("The entered protocol is not found!");
}

module.exports = flogoGenerator;
