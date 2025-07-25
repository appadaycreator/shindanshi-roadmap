# 中小企業診断士合格ロードマップ

中小企業診断士試験合格のための総合学習管理システム

## 概要

このアプリケーションは、中小企業診断士試験の受験者向けに開発された学習管理ツールです。試験日から逆算した学習計画の自動生成、7科目の進捗可視化、過去問演習機能などを提供し、効率的な学習をサポートします。

## 主な機能

### 1. 学習計画自動生成
- 試験日と1日の学習時間を入力するだけで、最適な学習計画を自動生成
- 7科目それぞれに必要な学習時間を自動配分

### 2. 進捗管理
- 科目別の学習進捗をリアルタイムで可視化
- レーダーチャートによる総合的な進捗表示
- 学習記録の保存と振り返り機能

### 3. 統計ダッシュボード
- 総学習日数・時間の表示
- 平均進捗率の自動計算
- 学習履歴の管理

### 4. データ管理
- localStorage による安全なデータ保存
- エクスポート/インポート機能（開発中）
- 完全無料・登録不要

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (Vanilla)
- **UIフレームワーク**: Tailwind CSS
- **アイコン**: Font Awesome
- **チャート**: Chart.js
- **データ保存**: localStorage
- **PWA対応**: Service Worker実装

## セットアップ

### ローカル環境での実行

```bash
# リポジトリのクローン
git clone https://github.com/appadaycreator/shindanshi-roadmap.git

# ディレクトリに移動
cd shindanshi-roadmap

# ローカルサーバーの起動（Python 3）
python3 -m http.server 8000

# ブラウザでアクセス
# http://localhost:8000
```

### デプロイ

このプロジェクトはGitHub Pagesでホスティングされています。
mainブランチへのプッシュで自動的にデプロイされます。

## ファイル構成

```
shindanshi-roadmap/
├── index.html              # メインページ（ダッシュボード）
├── lp.html                 # ランディングページ
├── usage.html              # 使い方ページ
├── terms.html              # 利用規約・免責事項
├── privacy.html            # プライバシーポリシー
├── contact.html            # 問い合わせフォーム
├── function.html           # 機能要件書
├── css/
│   ├── style.css          # メインスタイル
│   ├── responsive.css     # レスポンシブ対応
│   └── themes.css         # テーマカラー設定
├── js/
│   ├── app.js             # メインアプリケーション
│   ├── storage.js         # localStorage管理
│   ├── calendar.js        # 学習計画・進捗管理
│   ├── quiz.js            # 過去問機能
│   ├── i18n.js            # 多言語対応
│   └── pwa.js             # PWA機能
├── assets/
│   ├── icons/             # SVGアイコン
│   ├── images/            # OGP画像等
│   └── fonts/             # Webフォント
├── tests/
│   ├── test-suite.html    # 機能テスト
│   └── ui-test.js         # Puppeteer UIテスト
├── manifest.json          # PWAマニフェスト
├── sw.js                  # Service Worker
├── sitemap.xml           # サイトマップ
└── robots.txt            # robots.txt
```

## 使い方

1. **試験日の設定**: 「学習計画作成」セクションで試験日を選択
2. **1日の学習時間**: 確保できる学習時間を入力（0.5〜12時間）
3. **学習記録**: 日々の学習時間と科目を記録
4. **進捗確認**: ダッシュボードで全体の進捗を確認

## 開発者向け情報

### ローカル開発

```bash
# テスト実行
python3 -m http.server 8000

# ブラウザでのデバッグ
# Chrome DevToolsを使用してlocalStorageの確認が可能
```

### コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。

## 作者

- GitHub: [@appadaycreator](https://github.com/appadaycreator)

## サポート

問題や提案がある場合は、[Issues](https://github.com/appadaycreator/shindanshi-roadmap/issues)で報告してください。