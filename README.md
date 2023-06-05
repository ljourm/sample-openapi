# Sample OpenAPI

扱いやすいOpenAPIを目指して構成したサンプルリポジトリ。

## ポイント

- OpenAPIの定義ファイル
  - ファイルを分割して扱えるようにした
  - 複数のAPI (service1とservice2) を同時に取り扱える構成にした
  - 実運用を意識して、使いそうな構文を記載した
- ファイル変更の監視
  - src配下が変更されると分割されたファイルが一つのファイルとなってdistに出力されるようにした
  - 一つにまとめられたファイルを元にTypeScriptの型定義が出力されるようにした

## Docker

### 起動方法

```sh
$ docker-compose up
```

### 構成

|サービス名|用途・コメント|URL (Webアプリのみ)|
|--|--|--|
|swagger-editor|SwaggerEditorを起動する|http://localhost:8001|
|swagger-ui|SwaggerUIを起動する|http://localhost:8002|
|redocly-redoc|ReDocを起動する (SwaggerUIと機能が重複。今回はサンプルとして両方配置)|http://localhost:8003|
|swagger-script|src配下を監視し、変更があったらdistにマージしたOpenAPIの定義ファイルとTypeScriptの型定義ファイルを出力する|-|
