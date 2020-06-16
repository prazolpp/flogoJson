const fs = require("fs");
const path = require("path");
const flogoGenerator = require("./flogo-generator.js");

module.exports = {
  "generate:before": (generator) => {
    let resourceType = "flow";
    let server = "";
    if (
      generator.templateParams &&
      generator.templateParams["resourceType"] === "stream"
    ) {
      resourceType = "stream";
    }
    if (generator.templateParams && generator.templateParams["server"]) {
      server = generator.templateParams["server"];
    }
    const flogoJSON = flogoGenerator(generator.asyncapi, resourceType, server);
    fs.writeFileSync(
      path.resolve(generator.targetDir, `flogo.json`),
      JSON.stringify(flogoJSON, null, 2)
    );
  },
};
