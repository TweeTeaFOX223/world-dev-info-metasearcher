# world-dev-info-metasearcher
![screenshot](https://raw.githubusercontent.com/TweeTeaFOX223/world-dev-info-metasearcher/refs/heads/main/ScreenShot.png)  
  
![screenshot](https://raw.githubusercontent.com/TweeTeaFOX223/world-dev-info-metasearcher/refs/heads/main/ScreenShot3.png)     
  
  
![screenshot](https://raw.githubusercontent.com/TweeTeaFOX223/world-dev-info-metasearcher/refs/heads/main/ScreenShot4.png)     
  
## アプリの概要 
World Dev Info Meta Searcher（WDIMS）は、Claude Codeでサクッと開発した軽量メタ検索エンジンです。検索窓に単語を入力してエンターすると、開発技術＋αの情報収集に有用と思われる検索結果のURLのリストを表示します。  
  
- 基本的な「**検索エンジンの表示設定**」と「**検索エンジンとタブの編集と入れ替え**」「**設定のインポート＆エクスポート**」が可能です。
- URLに「選択中のタブ」と「検索中のワード」の情報がパラメータとして入ります。ページをブラウザブックマークしておくことで、素早く現在の検索結果にジャンプすることが可能です。  
- `./src/data/searchEngines.json`を書き換えた後にビルドすることで、初期設定で使用する検索エンジンをカスタムすることが可能です。エクスポート機能で保存した設定ファイルの内容を使用することも可能です。  
- サーバー不要でローカルのブラウザから直接開く(fileプロトコルで開く)だけで動作する、単一HTMLファイルにビルドすることが可能です。→`npm run build-offline`。LINEやDiscordやメールでHTMLファイルを送るだけでアプリの共有が可能です。 
- アプリ(HTMLファイル)のサイズは50KB程度で非常に小さいです（Preactをフレームワークに採用しているため）。  
- 検索結果URLを生成する処理はクライアント上(ブラウザ内)で行われます。単一HTMLファイルを開いて使用する場合だとプライバシー的に安全です。※GitHub PagesのやつだとGitHub側に検索クエリが記録される可能性があるので一応注意です。  
  
<br>
  
## ★このアプリを今すぐ使用！
### 方法A：GitHub Pagesにアクセス
このリポジトリのGitHub Pagesにアクセスすると使えます。初期状態では技術関連タブの「Preact」の検索結果のリストを表示します。  

**https://tweeteafox223.github.io/world-dev-info-metasearcher/?tab=tech-blogs&q=Preact**

💣️注意：設定は[ブラウザの内部データ(ローカルストレージ)](https://zenn.dev/crebo_tech/articles/article-0019-20251103#%E3%82%B7%E3%83%BC%E3%82%AF%E3%83%AC%E3%83%83%E3%83%88%E3%83%A2%E3%83%BC%E3%83%89%EF%BC%88%E3%83%97%E3%83%A9%E3%82%A4%E3%83%99%E3%83%BC%E3%83%88%E3%83%A2%E3%83%BC%E3%83%89%EF%BC%89%E3%81%AE%E6%8C%99%E5%8B%95)に保存されます。**「シークレットモード使用時にアクセスし編集を行った後にブラウザを閉じる」「ブラウザの設定から手動でこのページのサイトデータを消去する」という操作をすると、設定が消えてしまう**ので気をつけてください！  
  
💣️注意：編集や設定変更した時の設定は、「Webページを開いた[ブラウザアプリの内部データ(ローカルストレージ)](https://zenn.dev/crebo_tech/articles/article-0019-20251103#%E3%82%B7%E3%83%BC%E3%82%AF%E3%83%AC%E3%83%83%E3%83%88%E3%83%A2%E3%83%BC%E3%83%89%EF%BC%88%E3%83%97%E3%83%A9%E3%82%A4%E3%83%99%E3%83%BC%E3%83%88%E3%83%A2%E3%83%BC%E3%83%89%EF%BC%89%E3%81%AE%E6%8C%99%E5%8B%95)」に保存されます！**別々のブラウザでHTMLを開くと、設定はそれぞれに別になるので気をつけてください！**  
  
<br>
  
### 方法B：HTMLをDLしてブラウザで開く
下のリンクから単一HTMLファイルを、PCやスマホにダウンロード →適当なブラウザで開くのでも使えます！ 黄色い丸で囲ったボタンを押してください。  
  
**https://github.com/TweeTeaFOX223/world-dev-info-metasearcher/blob/main/dist-offline/index.html**
![screenshot2](https://raw.githubusercontent.com/TweeTeaFOX223/world-dev-info-metasearcher/refs/heads/main/ScreenShot2.png)  
  
    
💣️注意：方法Aと同じことに注意が必要です。→ **「シークレットモード使わない」「設定は開いたブラウザに保存」「ブラウザ設定からサイトデータ消さない」**
  
💣️注意：ローカルHTMLを開いて使用する場合、**ブラウザの内部データ(ローカルストレージ)は、「HTMLのファイル位置(パス)」に紐付けられます。一度使用した後にHTMLファイルの場所を移動させると、設定が別扱いになってしまうので気をつけてください！**
  
<br>
  
## 開発の背景と思想
以前から「特定のトピックに関するZennやQiitaやDev.toやGitHubやCSDNやMediumやnoteやXやReddit等の新着投稿を手動検索で全部確認したいが…、毎回毎回各サービスの検索窓に単語を入力する作業が面倒臭すぎる。ブラウザの検索エンジン追加機能は一回ずつ選択する形式なのでUI的に微妙だな。」と感じていました。  
  
ふと「一回単語入力するだけで各種の技術情報サイトの検索結果URLを一括で表示する、開発情報特化のメタ検索エンジンを作ったら便利なのでは？」と考えたので、Claude Codeに要件定義を入れてサクッと作ってみました。  
  
※手動検索による新着投稿の全確認：生成AIによる自動検索・身内チャット情報網・X(旧Twitter)やYouTubeやTechFeed等のフォローTLとレコメンド(おすすめ)で回ってくる範囲ではカバーできない、マイナーな面白い情報を発見できることがあるので、開発に限らずあらゆる分野で非常に有用な行動だと思います。  
  
※作っている最中に「開発情報収集以外でも使えそう」と思ったので、世界各国言語特化の検索エンジンや百科事典やブログや動画サイトもザッと入れてみました。「開発系サイトで検索する単語を、ついでに開発無関係なサイトでも検索してみる」、逆に「開発無関係な活動で検索する単語を、ついでに開発系サイトでも検索してみる」ということをやると想定外の面白い情報を発見できるかもしれないです。  
  
## 先駆者様(他のメタ検索エンジン)
先駆者様のメタ検索エンジンです。私のやつとは違った特徴があります。

複数の検索エンジンの検索結果を統合して表示するタイプが良い or 最近流行りの生成AIエージェントを用いた検索利用なら**SearXNG**(Perplexityも使ってるらしい)、国内外の政治経済情報の調査ならありとあらゆる分野をカバー可能な**最速一括検索**を使用するのがオススメです。

- **SearXNG**:https://github.com/searxng/searxng
- **最速一括検索**：https://skensaku.com/
  
<br>
  
# 目次
- [world-dev-info-metasearcher](#world-dev-info-metasearcher)
  - [アプリの概要](#アプリの概要)
  - [★このアプリを今すぐ使用！](#このアプリを今すぐ使用)
    - [方法A：GitHub Pagesにアクセス](#方法agithub-pagesにアクセス)
    - [方法B：HTMLをDLしてブラウザで開く](#方法bhtmlをdlしてブラウザで開く)
  - [開発の背景と思想](#開発の背景と思想)
  - [先駆者様(他のメタ検索エンジン)](#先駆者様他のメタ検索エンジン)
- [目次](#目次)
- [技術スタック](#技術スタック)
- [アプリの動作＆改変方法](#アプリの動作改変方法)
  - [［0］:インストールが必要なもの](#0インストールが必要なもの)
  - [［1］：リポジトリをクローン](#1リポジトリをクローン)
  - [［2］：依存関係を入れると動かせる](#2依存関係を入れると動かせる)
  - [［3A］：httpプロトコルで動くやつをビルド(デフォルト)](#3ahttpプロトコルで動くやつをビルドデフォルト)
  - [［3B］：httpプロトコル＋fileプロトコルでも動くやつをビルド](#3bhttpプロトコルfileプロトコルでも動くやつをビルド)
  - [検索エンジン初期設定のカスタム方法](#検索エンジン初期設定のカスタム方法)
- [プロジェクトのファイル構成](#プロジェクトのファイル構成)
- [検索エンジン初期設定に入れたサイトの一覧](#検索エンジン初期設定に入れたサイトの一覧)
  - [JSONの生データ](#jsonの生データ)
  - [マークダウンの表データ(見やすい)](#マークダウンの表データ見やすい)
- [GitHub Pages(GitHub Actionsの設定)](#github-pagesgithub-actionsの設定)
- [開発参加](#開発参加)
- [ライセンス](#ライセンス)



# 技術スタック

「軽量かつ動作楽なアプリをサクッと作る」という基準で選定。
  
| 技術項目                          | 使用しているもの             |
| --------------------------------- | ---------------------------- |
| AI エージェント                | Claude Code（Sonnet 4.5）           |
| プログラミング言語                | TypeScript           |
| フロントエンドフレームワーク        | Preact                          |
|CSS        | 通常のCSS                          |
| パッケージ管理とタスク処理        | npm                          |
| ビルドツール                  | Vite                         |
| Viteで単一HTMLを出力 | vite-plugin-singlefile                      |


# アプリの動作＆改変方法

## ［0］:インストールが必要なもの

これらのインストールが必須です。node.jsの公式サイトからDLできます。一番新しいLTSのやつを使えば多分動きます。
https://nodejs.org/ja/download
  
| 事前インストールが必要 | 動作確認したver |
| ---------------------- | --------------- |
| npm                    | v10.9.2         |
| node.js                | v23.7.0        |

## ［1］：リポジトリをクローン
ファイルを入れたいディレクトでリポジトリをクローンし、cdでディレクトリに入ってください。gitがない場合はZIPでダウンロードして解凍してください。
```
git clone https://github.com/TweeTeaFOX223/world-dev-info-metasearcher.git
cd world-dev-info-metasearcher 
```
## ［2］：依存関係を入れると動かせる
npmで以下のコマンドを実行すると動きます。`./src/data/searchEngines.json`を書き換えてカスタムしたり、コンポーネントのUIを変えたりすることができます。

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

## ［3A］：httpプロトコルで動くやつをビルド(デフォルト)

```bash
npm run build

# dist/index.html が生成される
```

## ［3B］：httpプロトコル＋fileプロトコルでも動くやつをビルド

```bash
npm run build-offline

# dist-offline/index.html が生成される
```

`./dist-offline`に単一のindex.htmlが生成されます。そのindex.htmlをブラウザで直接開くと動きます。



## 検索エンジン初期設定のカスタム方法

`src/data/searchEngines.json` を編集して、検索エンジンを追加・削除できます。

```json
{
  "tabs": [
    {
      "id": "custom",
      "name": "カスタム検索",
      "engines": [
        {
          "id": "example",
          "name": "Example Search",
          "url": "https://example.com/search?q={query}",
          "description": "説明文（オプション）",
          "icon": "https://example.com/icon.png（オプション）"
        }
      ]
    }
  ]
}
```

編集後、再ビルドが必要です。

```bash
npm run build

# dist/index.html が生成される
```

```bash
npm run build-offline

# dist-offline/index.html が生成される
```
  
<br>
  
# プロジェクトのファイル構成

```
project-root/
├── .github/
│   └── workflows/
│       └── main.yml              # GitHub Actions CI/CD設定
├── .claude/
│   └── settings.local.json       # Claude Code設定
├── config_sample/                # サンプル設定ファイル
│   ├── wdis-display-settings.json    # 表示設定のサンプル
│   └── wdis-search-engines.json      # 検索エンジン設定のサンプル
├── dist-offline/
│   └── index.html                # 単一HTMLビルド出力
├── scripts/
│   └── generateMarkdownTable.ts  # 検索エンジン設定をMD変換。ここだけnode.js
├── src/
│   ├── components/               # Preactコンポーネント
│   │   ├── AddEngineModal.tsx    # 検索エンジン追加モーダル
│   │   ├── AddTabModal.tsx       # タブ追加モーダル
│   │   ├── ConfirmModal.tsx      # 確認ダイアログ
│   │   ├── DeleteTabModal.tsx    # タブ削除確認モーダル
│   │   ├── ScrollToTop.tsx       # フローティングアクションボタン
│   │   ├── SearchBox.tsx         # 検索ボックス
│   │   ├── SearchEngineCard.tsx  # 検索エンジンカード
│   │   ├── SearchResults.tsx     # 検索結果グリッド
│   │   ├── Settings.tsx          # 設定パネル
│   │   └── TabBar.tsx            # タブバー
│   ├── data/
│   │   └── searchEngines.json    # 検索エンジン設定 ※カスタムする場合は書き換える
│   ├── types/
│   │   └── index.ts              # 型定義
│   ├── utils/
│   │   ├── localStorage.ts       # ローカルストレージ操作ユーティリティ
│   │   └── searchUtils.ts        # 検索URL生成ユーティリティ
│   ├── App.tsx                   # メインアプリケーション
│   ├── index.html                # HTMLエントリーポイント
│   ├── main.tsx                  # JSエントリーポイント
│   └── style.css                 # グローバルスタイル
├── .gitattributes                # Git属性設定
├── .gitignore                    # Git除外設定
├── A2.png                        # スクリーンショット(一時)
├── A3.png                        # スクリーンショット(一時)
├── LICENSE                       # ライセンス
├── README.md                     # プロジェクト説明
├── ScreenShot.png                # スクリーンショット
├── ScreenShot2.png               # スクリーンショット
├── eslint.config.ts              # ESLint設定
├── package-lock.json             # 依存パッケージロックファイル
├── package.json                  # 依存パッケージとタスク
├── search-engines-table.md       # 検索エンジン一覧表(自動生成)
├── tsconfig.json                 # TypeScript基本設定
├── tsconfig.app.json             # TypeScript設定(クライアント)
├── tsconfig.node.json            # TypeScript設定(node.js)
├── vite.config.ts                # Vite設定
└── vite.config.offline.ts        # 単一HTMLビルド用のVite設定

```
  
<br>
  
# 検索エンジン初期設定に入れたサイトの一覧

## JSONの生データ  

`src/data/searchEngines.json`にあります。

↓このリンクを踏むと見れます。↓  
https://github.com/TweeTeaFOX223/world-dev-info-metasearcher/blob/main/src/data/searchEngines.json


## マークダウンの表データ(見やすい)  

`npm run generate-table`で`scripts/generateMarkdownTable.ts`を実行するとmdテーブルを`search-engines-table.md`に生成します。  
  
↓このリンクを踏むと見れます。↓  
https://github.com/TweeTeaFOX223/world-dev-info-metasearcher/blob/main/search-engines-table.md  
↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
  
<br>
  
# GitHub Pages(GitHub Actionsの設定)
`npm run build-offline`を実行して単一HTMLをビルドしてプッシュした時に、GitHub Pagesにビルド＆デプロイするようになっています。   
https://github.com/TweeTeaFOX223/world-dev-info-metasearcher/blob/main/.github/workflows/main.yml  
  
# 開発参加  
  
プルリクエストは大歓迎です！。このアプリのアイディアを利用して全く別に新規作成することも大歓迎です！

訪問者の皆さんも何かしらの用途に特化したメタ検索エンジンを好きな技術スタックで作ってみると面白いのではないかと思います。
  
# ライセンス  
  
「MIT License」です。