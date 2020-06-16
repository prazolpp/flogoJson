const getProtocol = require("./protocols");

const flogoGenerator = (asyncapi, resourceType, protocol) => {
  let generateFlogo = "";
  if (getProtocol(protocol)) {
    generateFlogo = getProtocol(protocol);
  }
  else{
    generateFlogo = getProtocol("mqtt");
  }
    const { imports, triggers, resources } = generateFlogo(
      asyncapi,
      resourceType
    );

    return {
      name: asyncapi.info().title(),
      type: "flogo:app",
      version: "0.0.1",
      appModel: asyncapi.info().version(),
      description: asyncapi.info().description().split(/\n/g)[0],
      imports,
      triggers,
      resources,
    };
  }
//throw new Error(`Protocol "${protocol}" is not supported by this template.`)

module.exports = flogoGenerator;
