import fs from "fs";
import path from "path";

const logInfo = (...messages) => {
  console.log("[INFO]", ...messages);
};

const logError = (...messages) => {
  console.error("[ERROR]", ...messages);
};

const writeFile = (filepath, data) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, data);
};

export { logInfo, logError, writeFile };
