const protocols =  require('./protocol');

const flogoGenerator = (asyncapi, resourceType, protocol) => {

  if(protocols(protocol)){
    let getFlogoInfo = protocols(protocol);
    return {
      name: asyncapi.info().title(),
      type: "flogo:app",
      version: "0.0.1",
      appModel: asyncapi.info().version(),
      description: asyncapi.info().description().split(/\n/g)[0], //ask matt if we want to dump the whole description or use only one line
      imports: getFlogoInfo(asyncapi, resourceType).imports,
      triggers:  getFlogoInfo(asyncapi, resourceType).triggers,
      resources: getFlogoInfo(asyncapi,resourceType).resources
    }
  }
  throw new Error("The protocol is not found!");

}

module.exports = flogoGenerator;
