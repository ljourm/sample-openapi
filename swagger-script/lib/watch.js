import SwaggerParser from "@apidevtools/swagger-parser";
import jsYaml from "js-yaml";
import chokidar from "chokidar";

import { logInfo, logError, writeFile } from "./util.js";
import config from "../config.js";

import openApiTS from "openapi-typescript";

/**
 * 分割されたOpenAPIファイルを読み込み、一つにマージした結果を出力し、さらにTypeScriptの型定義ファイルを出力する
 * @param {string} srcOpenApiPath - 分割されたOpenAPIファイルのパス
 * @param {string} distOpenApiPath - 出力するOpenAPIファイルのパス
 * @param {string} distTsSchemaPath - 出力するTypeScriptの型定義ファイルのパス
 */
const generate = async (srcOpenApiPath, distOpenApiPath, distTsSchemaPath) => {
  try {
    // バリデーション。マージ結果がオブジェクト型で返却される
    const spec = await SwaggerParser.validate(srcOpenApiPath);

    // YAML形式に変換してファイル出力
    const yamlSpec = jsYaml.dump(spec, { noRefs: true });
    writeFile(distOpenApiPath, yamlSpec);
    logInfo("generated", distOpenApiPath);

    // TypeScriptの型定義のファイル出力
    const tsSchema = await openApiTS(spec);
    writeFile(distTsSchemaPath, tsSchema);
    logInfo("generated", distTsSchemaPath);
  } catch (err) {
    logError(err.toString());
  }
};

/**
 * 指定したディレクトリを監視し、変更があった場合にコールバック関数を実行する
 * @param {string} watchPath - 監視するディレクトリのパス
 * @param {function} callback - 変更があった場合に実行するコールバック関数
 */
const watchFiles = (watchPath, callback) => {
  const watcher = chokidar.watch(watchPath, { usePolling: true, ignoreInitial: true });

  // ファイル追加、変更、削除を監視対象とする
  ["add", "change", "unlink"].forEach((event) => {
    watcher.on(event, (path) => {
      logInfo(event, path);
      callback();
    });
  });
};

config.targets.forEach((target) => {
  const run = () => {
    generate(target.srcOpenApiPath, target.distOpenApiPath, target.distTsSchemaPath);
  };

  // 起動直後にファイルを生成しておく
  run();

  // 以降はファイルの変更を監視して、変更があればファイルを生成する
  watchFiles(target.watchPath, () => {
    run();
  });
});
