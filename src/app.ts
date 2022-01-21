import path from "path";

const commandPath = path.resolve(__dirname, "commands/test.command.js");
console.log("Path: ", commandPath);
require(commandPath).default();
