[CmdletBinding()]
param(
    [ValidateSet("Auto", "Firefox", "Edge", "Chrome")]
    [string]$Browser = "Auto",

    [ValidatePattern("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")]
    [string]$Repository = "pukutai3/XUserMedia-Downloader"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Test-Command {
    param([Parameter(Mandatory)][string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Get-BrowserName {
    param([Parameter(Mandatory)][string]$RequestedBrowser)

    if ($RequestedBrowser -ne "Auto") {
        return $RequestedBrowser.ToLowerInvariant()
    }

    $candidates = @(
        @{ Name = "firefox"; Path = Join-Path $env:APPDATA "Mozilla\Firefox\Profiles" },
        @{ Name = "edge"; Path = Join-Path $env:LOCALAPPDATA "Microsoft\Edge\User Data" },
        @{ Name = "chrome"; Path = Join-Path $env:LOCALAPPDATA "Google\Chrome\User Data" }
    )

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate.Path) {
            return $candidate.Name
        }
    }

    throw "Firefox、Edge、Chrome のログイン済みプロファイルが見つかりません。"
}

if (-not (Test-Command "gh")) {
    throw "GitHub CLI (gh) が必要です。https://cli.github.com/ からインストールして再実行してください。"
}

$repoRoot = $PSScriptRoot
$venvPython = Join-Path $repoRoot ".venv\Scripts\python.exe"

if (-not (Test-Path -LiteralPath $venvPython)) {
    if (-not (Test-Command "py")) {
        throw "Python 3 が必要です。https://www.python.org/downloads/ からインストールして再実行してください。"
    }

    Write-Host "初回用のPython環境を準備しています..."
    & py -3 -m venv (Join-Path $repoRoot ".venv")
    if ($LASTEXITCODE -ne 0) { throw "Python仮想環境の作成に失敗しました。" }

    & $venvPython -m pip install --disable-pip-version-check -r (Join-Path $repoRoot "requirements.txt")
    if ($LASTEXITCODE -ne 0) { throw "依存パッケージのインストールに失敗しました。" }
}

& gh auth status --hostname github.com 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "GitHubへのログインを開始します。ブラウザーの案内に従ってください。"
    & gh auth login --hostname github.com --web --git-protocol https
    if ($LASTEXITCODE -ne 0) { throw "GitHubへのログインに失敗しました。" }
}

$selectedBrowser = Get-BrowserName -RequestedBrowser $Browser
$tempBase = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$tempDir = Join-Path $tempBase ("x-user-media-auth-" + [Guid]::NewGuid().ToString("N"))
$cookieFile = Join-Path $tempDir "x-cookies.txt"

New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    Write-Host "$selectedBrowser からXの認証情報を一時取得しています..."
    & $venvPython -m gallery_dl `
        --cookies-from-browser "$selectedBrowser/x.com" `
        --cookies-export $cookieFile `
        --get-urls "https://x.com/OpenAI" *> $null

    if (-not (Test-Path -LiteralPath $cookieFile)) {
        throw "Cookieを取得できませんでした。Xへログイン済みか確認し、ブラウザーを終了して再実行してください。"
    }

    $cookieNames = Get-Content -LiteralPath $cookieFile | ForEach-Object {
        if ($_ -and -not $_.StartsWith("#")) {
            $columns = $_ -split "`t"
            if ($columns.Count -ge 7) { $columns[5] }
        }
    }

    if (($cookieNames -notcontains "auth_token") -or ($cookieNames -notcontains "ct0")) {
        throw "XのログインCookie (auth_token/ct0) が見つかりません。x.comへログインしてから再実行してください。"
    }

    $encodedCookies = [Convert]::ToBase64String([IO.File]::ReadAllBytes($cookieFile))
    $encodedCookies | & gh secret set X_COOKIES_B64 --repo $Repository
    if ($LASTEXITCODE -ne 0) { throw "GitHub Actions Secretの登録に失敗しました。リポジトリ権限を確認してください。" }

    Write-Host "完了: $Repository に X_COOKIES_B64 を安全に登録しました。"
    Write-Host "以後はREADMEの起動ボタンからユーザー名だけを入力して実行できます。"
}
finally {
    $resolvedTempDir = [IO.Path]::GetFullPath($tempDir)
    if ($resolvedTempDir.StartsWith($tempBase, [StringComparison]::OrdinalIgnoreCase) -and
        (Split-Path -Leaf $resolvedTempDir).StartsWith("x-user-media-auth-")) {
        Remove-Item -LiteralPath $resolvedTempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

