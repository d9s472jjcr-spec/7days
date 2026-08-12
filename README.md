# 神は7日で世界を作った

架空の20代の成人日本人女性を対象に、フォトリアルな人物画像生成用の日本語指示文を選択式で作成する完全クライアント処理型PWAです。

## 特徴

- 通常項目はプルダウン、色は名称付きカラーチップから選択
- 前回値と名前付きプリセットを端末内の `localStorage` にのみ保存
- Service Workerによるオフライン利用
- API、データベース、アクセス解析、広告、外部フォントなし
- iPhone 16を主対象とするレスポンシブUI

## 開発

```sh
npm test
npm run serve
```

iPhone実機確認時は、同一Wi-Fi内のPCで `npm run serve:lan` を実行し、PCのLAN IPの4175番へアクセスします。

公開版はGitHub Pagesから配信します。実機Safari確認はChromiumのモバイル表示確認とは別に実施します。

公開URL: https://d9s472jjcr-spec.github.io/7days/

## 非公開情報の扱い

画像生成カスタムGPTのInstructionsやKnowledge本文は、この公開リポジトリへ保存しません。変更履歴にはバージョン、ハッシュ、目的、要約だけを記録します。
