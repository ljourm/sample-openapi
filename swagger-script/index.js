const path = require("path");
const fs = require("fs");

const SwaggerParser = require("@apidevtools/swagger-parser");
const jsYaml = require("js-yaml");
const chokidar = require("chokidar");

const INPUT_FILEPATH = "/src/service2/index.yml";
const OUTPUT_FILEPATH = "/dist/service2/openapi.yml";

const infoLog = (...messages) => {
  console.log("[INFO]", ...messages);
};
const errorLog = (...messages) => {
  console.error("[ERROR]", ...messages);
};

const validateAndMergeSpecification = async (inputFilepath, outputFilepath) => {
  try {
    // バリデーション。マージ結果がオブジェクト型で返却される
    const objectSpecification = await SwaggerParser.validate(inputFilepath);

    // YAML形式に変換
    const yamlSpecification = jsYaml.dump(objectSpecification, { noRefs: true });

    // ファイル出力
    fs.mkdirSync(path.dirname(outputFilepath), { recursive: true });
    fs.writeFileSync(outputFilepath, yamlSpecification);

    infoLog("generate", outputFilepath);
  } catch (err) {
    errorLog(err.toString());
  }
};

const watchFiles = (callback) => {
  const watcher = chokidar.watch("/src", { usePolling: true, ignoreInitial: true });

  // ファイル追加、変更、削除を監視対象とする
  ["add", "change", "unlink"].forEach((event) => {
    watcher.on(event, (path) => {
      infoLog(event, path);
      callback();
    });
  });
};

// 起動直後にファイルを生成しておく
validateAndMergeSpecification(INPUT_FILEPATH, OUTPUT_FILEPATH);

// 以降はファイルの変更を監視して、変更があればファイルを生成する
watchFiles(() => {
  validateAndMergeSpecification(INPUT_FILEPATH, OUTPUT_FILEPATH);
});
