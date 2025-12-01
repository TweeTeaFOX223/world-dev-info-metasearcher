# world-dev-info-metasearcher
![screenshot](https://raw.githubusercontent.com/TweeTeaFOX223/world-dev-info-metasearcher/refs/heads/main/ScreenShot.png)
## アプリの概要
World Dev Info Searcher（WDIF）は、Claude Codeでサクッと開発した軽量メタ検索エンジンです。検索窓に単語を入力してエンターすると、開発技術＋αの情報収集に有用と思われる検索結果のURLのリストを表示します。


- `./src/data/searchEngines.json`を書き換えた後にビルドすることで、使用する検索エンジンをカスタムすることが可能です。
- サーバー不要でローカルのブラウザから直接開く(fileプロトコルで開く)だけで動作する、単一HTMLファイルにビルドすることが可能です。→`npm run build-offline`。LINEやDiscordやメールでHTMLファイルを送るだけでアプリの共有が可能です。
- アプリ(HTMLファイル)のサイズは50KB程度で非常に小さいです（Preactをフレームワークに採用しているため）。
- 検索結果URLを生成する処理はクライアント上(ブラウザ内)で行われます。単一HTMLファイルを開いて使用する場合だとプライバシー的に安全です。※GitHub PagesのやつだとGitHub側に検索クエリが記録される可能性があるので一応注意です。



## ★このアプリを今すぐ使用！
### 方法A：GitHub Pagesにアクセス
このリポジトリのGitHub Pagesにアクセスすると使えます**。初期状態では「Preact 2025」の検索結果のリストを表示します。  

**https://tweeteafox223.github.io/world-dev-info-metasearcher/?q=Preact+2025**

### 方法B：HTMLをDLしてブラウザで開く
下のリンクから単一HTMLファイルを、PCやスマホにダウンロード →適当なブラウザで開くのでも使えます！ 黄色い丸で囲ったボタンを押してください。  

**https://github.com/TweeTeaFOX223/world-dev-info-metasearcher/blob/main/dist-offline/index.html**
![screenshot2](https://raw.githubusercontent.com/TweeTeaFOX223/world-dev-info-metasearcher/refs/heads/main/ScreenShot2.png)

# 目次
- [world-dev-info-metasearcher](#world-dev-info-metasearcher)
  - [アプリの概要](#アプリの概要)
  - [★このアプリを今すぐ使用！](#このアプリを今すぐ使用)
    - [方法A：GitHub Pagesにアクセス](#方法agithub-pagesにアクセス)
    - [方法B：HTMLをDLしてブラウザで開く](#方法bhtmlをdlしてブラウザで開く)
- [目次](#目次)
- [技術スタック](#技術スタック)
- [アプリの動作＆改変方法](#アプリの動作改変方法)
  - [［0］:インストールが必要なもの](#0インストールが必要なもの)
  - [［1］：リポジトリをクローン](#1リポジトリをクローン)
  - [［2］：依存関係を入れると動かせる](#2依存関係を入れると動かせる)
  - [［3A］：httpプロトコルで動くやつをビルド(デフォルト)](#3ahttpプロトコルで動くやつをビルドデフォルト)
  - [［3B］：httpプロトコル＋fileプロトコルでも動くやつをビルド](#3bhttpプロトコルfileプロトコルでも動くやつをビルド)
  - [検索エンジンのカスタム方法](#検索エンジンのカスタム方法)
- [プロジェクトのファイル構成](#プロジェクトのファイル構成)
- [ライセンス](#ライセンス)
- [開発参加](#開発参加)
- [コラム](#コラム)
- [検索エンジン設定に入れたサイトの一覧](#検索エンジン設定に入れたサイトの一覧)
  - [各国検索](#各国検索)
  - [一般サイト](#一般サイト)
  - [開発技術（修正版）](#開発技術修正版)
  - [SNS関連](#sns関連)
  - [GitHub](#github)
  - [動画関係](#動画関係)
  - [ショッピング](#ショッピング)



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



## 検索エンジンのカスタム方法

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

# プロジェクトのファイル構成

```
project-root/
├── src/
│   ├── components/       # Preactコンポーネント
│   │   ├── TabBar.tsx
│   │   ├── SearchBox.tsx
│   │   ├── SearchResults.tsx
│   │   └── SearchEngineCard.tsx
│   ├── data/
│   │   └── searchEngines.json  # 検索エンジン設定 ※カスタムする場合は書き換える
│   ├── types/
│   │   └── index.ts      # 型定義
│   ├── utils/
│   │   └── searchUtils.ts  # ユーティリティ関数
│   ├── App.tsx           # メインアプリケーション
│   ├── main.tsx          # エントリーポイント
│   └── style.css         # スタイル
├── vite.config.ts        # Vite設定
├── vite.config.offline.ts # 単一HTMLビルド用のVite設定
├── tsconfig.json         # TypeScript設定
├── tsconfig.app.json     # TypeScript設定
├── tsconfig.node.json    # TypeScript設定
├── package.json #依存パッケージとタスク
└── index.html #エントリーポイント
```


# ライセンス

「MIT License」です。

# 開発参加

プルリクエストは大歓迎です！。このアプリのアイディアを利用して全く別に新規作成することも大歓迎です！

訪問者の皆さんも何かしらの用途に特化したメタ検索エンジンを好きな技術スタックで作ってみると面白いのではないかと思います。

# コラム


# 検索エンジン設定に入れたサイトの一覧

## 各国検索

| サイト名        | 説明                                     | URL                                                                        |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| Google          | アメリカの定番検索エンジン               | https://www.google.com/search?q={query}                                    |
| Yahoo! JAPAN    | 日本のヤフーの検索エンジン               | https://search.yahoo.co.jp/search?p={query}                                |
| Yahoo!          | アメリカのヤフーの検索エンジン           | https://search.yahoo.com/search?p={query}                                  |
| Bing            | アメリカのMicrosoftの検索エンジン        | https://www.bing.com/search?q={query}                                      |
| DuckDuckGo      | アメリカのプライバシー重視の検索エンジン | https://duckduckgo.com/?q={query}                                          |
| Startpage       | オランダのプライバシー重視の検索エンジン | https://www.startpage.com/do/dsearch?q={query}                             |
| Ecosia          | ドイツの環境重視の検索エンジン           | https://www.ecosia.org/search?method=index&q={query}                       |
| NAVER           | 韓国の検索エンジン                       | https://search.naver.com/search.naver?where=nexearch&ie=utf8&query={query} |
| Daum            | 韓国の検索エンジン                       | https://search.daum.net/search?w=tot&q={query}                             |
| WEB.DE          | ドイツの検索エンジン                     | https://suche.web.de/?origin=HP&q={query}                                  |
| FIREBALL        | ドイツの検索エンジン                     | https://fireball.com/search/?f=web&q={query}                               |
| Baidu(百度)     | 中国の検索エンジン                       | https://www.baidu.com/s?ie=utf-8&wd={query}                                |
| Sogou(搜狗搜索) | 中国の検索エンジン                       | https://www.sogou.com/web?query={query}                                    |
| Haosou(360搜索) | 中国の検索エンジン                       | https://www.so.com/s?ie=utf-8&q={query}                                    |
| Coc Coc         | ベトナムの検索エンジン                   | https://coccoc.com/search?query={query}                                    |
| Yandex          | ロシアの検索エンジン                     | https://yandex.ru/search/?text={query}                                     |
| Qmamu           | インドの検索エンジン                     | https://qmamu.com/ja/search?q={query}                                      |
| Seznam.cz       | チェコの検索エンジン                     | https://search.seznam.cz/?q={query}                                        |
| Entireweb.com   | スウェーデンの検索エンジン               | https://www.entireweb.com/search.php?q={query}                             |
| Walla!          | イスラエルの検索エンジン                 | https://search.walla.co.il/?q={query}                                      |
| search.ch       | スイスの検索エンジン                     | https://search.ch/tel/?all={query}                                         |

## 一般サイト

| サイト名            | 説明                                           | URL                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wikipedia(日本)     | 日本語wikipediaの記事検索                      | https://ja.wikipedia.org/w/index.php?title=%E7%89%B9%E5%88%A5:%E6%A4%9C%E7%B4%A2&ns0=1&search={query}                                                                                                                                                                                                                                                                                                                                             |
| wikipedia(英語)     | 英語wikipediaの記事検索                        | https://en.wikipedia.org/w/index.php?search={query}&title=Special%3ASearch&ns0=1                                                                                                                                                                                                                                                                                                                                                                  |
| note                | 日本のブログサービス                           | https://note.com/search?q={query}&context=note&mode=search                                                                                                                                                                                                                                                                                                                                                                                        |
| はてなブログ        | 日本のブログサービス。グーグルの検索クエリ使用 | https://www.google.com/search?q={query}+(site%3Ahatenablog.com+OR+site%3Ahatenablog.jp+OR+site%3Ahateblo.jp+OR+site%3Ahatenadiary.com+OR+site%3Ahatenadiary.jp)&client=firefox-b-d&sca_esv=d90e220b7d9405c9&ei=Zh0tabfIEdLf1e8Pl8qe2AI&ved=0ahUKEwi3k-iuypuRAxXSb_UHHRelBysQ4dUDCBE&uact=5&oq=%E3%83%86%E3%82%B9%E3%83%88+(site%3Ahatenablog.com+OR+site%3Ahatenablog.jp+OR+site%3Ahateblo.jp+OR+site%3Ahatenadiary.com+OR+site%3Ahatenadiary.jp) |
| Medium              | 英語のブログサービス。開発記事も多い           | https://medium.com/search?q={query}                                                                                                                                                                                                                                                                                                                                                                                                               |
| Amebaブログ         | 日本のブログサービス                           | https://search.ameba.jp/search/{query}.html                                                                                                                                                                                                                                                                                                                                                                                                       |
| ニコニコ大百科      | 日本語の百科事典サイト                         | https://dic.nicovideo.jp/s/al/t/{query}/rev_created/desc/1-?query_type=t                                                                                                                                                                                                                                                                                                                                                                          |
| ピクシブ百科事典    | 日本語の百科事典サイト                         | https://dic.pixiv.net/search?query={query}                                                                                                                                                                                                                                                                                                                                                                                                        |
| NAVER blog          | 韓国のブログサービス                           | https://section.blog.naver.com/Search/Post.naver?keyword={query}                                                                                                                                                                                                                                                                                                                                                                                  |
| Namu Wiki           | 韓国語の百科事典サイト                         | https://namu.wiki/Search?q={query}                                                                                                                                                                                                                                                                                                                                                                                                                |
| Baidu百科(百度百科) | 中国語の百科事典サイト                         | https://baike.baidu.com/search?word={query}                                                                                                                                                                                                                                                                                                                                                                                                       |
| Grokipedia          | Xの生成AI(Grok)により記事生成するwiki          | https://grokipedia.com/search?q={query}                                                                                                                                                                                                                                                                                                                                                                                                           |

## 開発技術（修正版）

| サイト名         | 説明                                     | URL                                                                   |
| ---------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| Zenn             | 日本語の開発情報共有コミュニティ         | https://zenn.dev/search?q={query}                                     |
| Qiita            | 日本語の開発情報共有コミュニティ         | https://qiita.com/search?q={query}                                    |
| dev.to           | 英語の開発者コミュニティ。英語以外もある | https://dev.to/search?q={query}                                       |
| HackerNoon       | 英語の開発者コミュニティ                 | https://hackernoon.com/search?query={query}                           |
| Stack Overflow   | **日本語の開発者QAコミュニティ**         | https://ja.stackoverflow.com/search?q={query}                         |
| HackerNews       | 英語のハッカーコミュニティ           | https://hn.algolia.com/?q={query}                                     |
| freeCodeCamp.org | 英語の開発者コミュニティ(投稿は要申請)   | https://www.freecodecamp.org/news/search/?query={query}               |
| CSDN             | 中国語の開発者コミュニティ               | https://so.csdn.net/so/search?q={query}                               |
| Juejin (掘金)    | 中国語の開発者コミュニティ               | https://juejin.cn/search?query={query}                                |
| Velog            | 韓国語の開発者コミュニティ               | https://velog.io/search?q={query}                                     |
| Teratail         | 日本語の開発者QAコミュニティ             | https://teratail.com/search?q={query}                                 |
| Google Scholar   | グーグルの論文検索エンジン               | https://scholar.google.com/scholar?hl=ja&as_sdt=0%2C5&q={query}&btnG= |


## SNS関連

| サイト名           | 説明                       | URL                                          |
| ------------------ | -------------------------- | -------------------------------------------- |
| X(旧Twitter)       | X(Twitter)、要ログイン     | https://x.com/search?q={query}               |
| はてなブックマーク | はてなのブックマークサイト | https://b.hatena.ne.jp/search/text?q={query} |
| Reddit             | 英語中心のフォーラム型SNS      | https://www.reddit.com/search/?q={query}     |
| BlueSky            | BlueSky、要ログイン        | https://bsky.app/search?q={query}            |

## GitHub

| サイト名     | 説明             | URL                                                   |
| ------------ | ---------------- | ----------------------------------------------------- |
| Repositories | リポジトリを検索 | https://github.com/search?q={query}&type=repositories |
| Code         | コードを検索     | https://github.com/search?q={query}&type=code         |
| Issues       | Issue を検索     | https://github.com/search?q={query}&type=issues       |
| Users        | ユーザーを検索   | https://github.com/search?q={query}&type=users        |

## 動画関係

| サイト名     | 説明                           | URL                                                    |
| ------------ | ------------------------------ | ------------------------------------------------------ |
| YouTube      | 最大の動画サイト。開発動画多い | https://www.youtube.com/results?search_query={query}   |
| bilibili     | 中国の動画サイト。開発動画多い | https://search.bilibili.com/all?keyword={query}        |
| ニコニコ動画 | 日本の動画サイト               | https://www.nicovideo.jp/search/{query}                |
| Dailymotion  | フランスの動画サイト           | https://www.dailymotion.com/search/{query}/top-results |
| VK Video     | ロシアの動画サイト             | https://vkvideo.ru/?q={query}                          |
| RUTUBE       | ロシアの動画サイト             | https://rutube.ru/search/?query={query}                |
| TikTok       | 中国のショート動画サイト       | https://www.tiktok.com/search?q={query}                |

## ショッピング

| サイト名           | 説明                             | URL                                                     |
| ------------------ | -------------------------------- | ------------------------------------------------------- |
| Zenn books         | Zennの電子書籍マーケット         | https://zenn.dev/search?q={query}&page=1&source=books   |
| 技術書典           | 技術書のマーケット               | https://techbookfest.org/market/search?q={query}        |
| Udemy              | 有料動画販売サイト。開発動画多い | https://www.udemy.com/courses/search/?src=ukw&q={query} |
| ドットインストール | サブスクの開発学習サイト         | https://dotinstall.com/search?q={query}&f=topbar         |
| BOOTH              | 創作物の総合マーケット           | https://booth.pm/ja/search/{query}                      |
| Amazon             | アマゾン                         | https://www.amazon.co.jp/s?k={query}                    |
| 楽天市場           | 楽天の通販                       | https://search.rakuten.co.jp/search/mall/{query}/       |
| Yahoo!ショッピング | Yahoo! ショッピング              | https://shopping.yahoo.co.jp/search?p={query}           |

