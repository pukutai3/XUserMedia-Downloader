# XUserMedia-Downloader

[![Xメディア取得を起動](https://img.shields.io/badge/Run-X_Media_Downloader-2EA44F?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/pukutai3/XUserMedia-Downloader/actions/workflows/download-x-media.yml)

GitHub ActionsでXのユーザー名を入力すると、そのユーザー自身が投稿した画像・GIF・動画をZIPにまとめます。Xのプロフィールに表示される範囲だけで終わらせず、`gallery-dl`のメディアタイムラインと検索を使用します。ただし、検索索引に存在しない投稿、削除済み・非公開・閲覧権限外の投稿は取得できません。

## 初回のみ: X認証を設定

現在のXはユーザーのメディアタイムライン取得にもログインを要求します。GitHubの実行環境は手元のブラウザーCookieを直接読めないため、最初にWindows上で次を一度実行してください。

1. Firefox、Edge、Chromeのいずれかで `x.com` にログインします。
2. このリポジトリを取得し、PowerShellでセットアップを実行します。

```powershell
git clone https://github.com/pukutai3/XUserMedia-Downloader.git
cd XUserMedia-Downloader
powershell -ExecutionPolicy Bypass -File .\Setup-XAuthentication.ps1
```

スクリプトはログイン済みブラウザーからX用Cookieだけを一時取得し、GitHub Actions Secret `X_COOKIES_B64` へ直接登録します。Cookieの内容は画面に表示せず、リポジトリにも保存しません。GitHub CLIやPythonがない場合は、その旨を表示して停止します。

自動選択がうまくいかない場合はブラウザーを指定できます。

```powershell
.\Setup-XAuthentication.ps1 -Browser Firefox
.\Setup-XAuthentication.ps1 -Browser Edge
.\Setup-XAuthentication.ps1 -Browser Chrome
```

CookieはXアカウントへアクセスできる認証情報です。ワークフロー入力、Issue、Actions Variable、リポジトリ内のファイルには貼らないでください。Xからログアウトした場合や認証期限が切れた場合は、セットアップを再実行します。

## 使い方

1. 上の緑色の起動ボタンを押します。
2. `Run workflow` を押します。
3. `username` にXのユーザー名を入力します。`@username` やプロフィールURLも使用できます。
4. 実行完了後、ページ下部の `Artifacts` にある `x-media-実行ID` をクリックします。
5. 取得した画像・GIF・動画を含むZIPがブラウザーからダウンロードされます。

GitHub Actionsの仕様上、処理完了と同時にブラウザーへ自動ダウンロードを開始することはできません。Artifactを一度クリックする必要があります。Artifactの保存期間は14日です。

## 保存対象

- 対象ユーザー自身が投稿した画像、GIF、動画
- 任意で各メディアの投稿メタデータJSON

次は除外します。

- リポスト内のメディア
- 引用元ユーザーのメディア
- 削除済み、非公開、閲覧権限外の投稿

## 注意

対象者の権利とXの規約を守り、私的な調査・正当なアーカイブの範囲で使用してください。X側の仕様変更やアクセス制限により、取得が途中で停止する場合があります。
