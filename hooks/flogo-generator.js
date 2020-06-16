const getProtocol = require("./protocols");
const FLOGO_APP_MODEL = "1.1.0";
const flogoGenerator = (asyncapi, resourceType, server) => {
  let currentProtocol = getProtocol(asyncapi.server(server).protocol());
  if (currentProtocol) {
    const generateFlogo = currentProtocol;
    const { imports, triggers, resources } = generateFlogo(
      asyncapi,
      resourceType
    );
    return {
      name: asyncapi.info().title(),
      type: "flogo:app",
      version: asyncapi.info().version(),
      appModel: FLOGO_APP_MODEL,
      description: asyncapi.info().description().split(/\n/g)[0],
      imports,
      triggers,
      resources,
    };
  }
  throw new Error(
    `Protocol "${currentProtocol}" is not supported by this template.`
  );
};

module.exports = flogoGenerator;
