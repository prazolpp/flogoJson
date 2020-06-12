const getProtocol = require("./protocols");

const flogoGenerator = (asyncapi, resourceType, protocol) => {
  if (getProtocol(protocol)) {
    const generateFlogo = getProtocol(protocol);
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
  throw new Error("The entered protocol is not found!");
};

module.exports = flogoGenerator;
