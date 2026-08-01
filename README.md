# XUserMedia-Downloader

GitHub Actionsの画面でXのユーザー名を入力し、そのユーザー自身が投稿した画像・GIF・動画をZIPで取得します。

Xのプロフィールにあるメディア欄だけで終了せず、`gallery-dl` のメディアタイムラインと検索を使用します。ただし、Xの検索索引に存在しない投稿、削除済み・非公開・閲覧権限外の投稿は取得できません。

## 使い方

1. リポジトリ上部の `Actions` を開きます。
2. 左側から `Download X media` を選択します。
3. `Run workflow` を押します。
4. `username` にXのユーザー名を入力して実行します。`@username` やプロフィールURLも使用できます。
5. 完了した実行結果を開き、ページ下部の `Artifacts` にある `x-media-実行ID` をクリックします。
6. 取得した画像・GIF・動画がZIPでダウンロードされます。

GitHub Actionsの仕様上、処理完了と同時にブラウザーへ自動ダウンロードを開始することはできません。Artifactをクリックする操作が一度必要です。Artifactの保存期間は14日です。

## Xのログインが必要な場合

公開範囲だけを取得する場合、追加設定は不要です。センシティブ設定などログインが必要な投稿も対象にする場合は、Netscape形式のX用 `cookies.txt` をBase64化し、Actions Secretとして登録します。

Windows PowerShellでBase64をクリップボードへコピーする例:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("x-cookies.txt")) | Set-Clipboard
```

リポジトリの `Settings > Secrets and variables > Actions` で、次のRepository Secretを作成します。

```text
Name: X_COOKIES_B64
Secret: クリップボードへコピーした文字列
```

CookieはXアカウントへアクセスできる認証情報です。リポジトリのファイル、Issue、Actions Variableには貼らないでください。Secretの上限は48 KBなので、X以外のドメインを含まないCookieファイルを使用してください。Cookieを使う場合は非公開リポジトリを推奨します。

## 保存対象

- 対象ユーザー自身が投稿した画像、GIF、動画
- 任意で各メディアの投稿メタデータJSON

次は除外します。

- リポスト内のメディア
- 引用元ユーザーのメディア
- 削除済み、非公開、閲覧権限外の投稿

取得ファイルやCookieはリポジトリへcommitしません。実行環境は毎回破棄されるため、この構成は一括取得向けです。

## 注意

対象者の権利とXの規約を守り、私的な調査・正当なアーカイブの範囲で使用してください。X側の仕様変更やアクセス制限により、取得が途中で停止する場合があります。
