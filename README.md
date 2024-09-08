## Requriements

- Node.js 20.x

## Getting Started

```
# pnpm の有効化
$ corepack enable

#  依存関係のインストール
$ pnpm install
```

## API について

- `pnpm dev:api` で http://localhost:3001 に起動します
- API は以下の4種類のプロトコルおよびフォーマットが利用できます
  - **GraphQL**
    - http://localhost:3001/graphql からサーブされています
    - スキーマファイルは `./apps/api/src/graphql/**/schema.graphql` に存在します
    - 同じ URL で GraphiQL を利用できます
  - **Connect**
    - http://localhost:3001/connect からサーブされています
    - スキーマファイルは `./apps/api/proto` 以下に存在します
  - **REST(OpenAPI)**
    - http://localhost:3001/rest からサーブされています
    - http://localhost:3001/rest/openapi に GET リクエストを送ることで OpenAPI Spec を入手できます
  - **REST(Hono RPC)**
    - http://localhost:3001/hono からサーブされています
    - api パッケージから `HonoAppType` という名前で API Spec の型定義を import できます
- API から書き込んだデータは `apps/api/tmp/db.pb` に保存されます
  - データを削除したい場合はこのファイルを消してサーバを再起動してください
