from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


USERNAME_PATTERN = re.compile(r"^[A-Za-z0-9_]{1,15}$")


def normalize_username(value: str) -> str:
    username = value.strip()
    username = re.sub(r"^https?://(?:www\.)?(?:x|twitter)\.com/", "", username)
    username = username.removeprefix("@")
    username = re.split(r"[/?#]", username, maxsplit=1)[0]
    if not USERNAME_PATTERN.fullmatch(username):
        raise ValueError(f"Invalid X username: {value!r}")
    return username


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download media posted by one X user with gallery-dl."
    )
    parser.add_argument("username", help="X username, @username, or profile URL")
    parser.add_argument("--output", type=Path, default=Path("downloads"))
    parser.add_argument("--cookies", type=Path)
    parser.add_argument("--write-metadata", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        username = normalize_username(args.username)
    except ValueError as exc:
        print(exc, file=sys.stderr)
        return 2

    if args.cookies is not None and not args.cookies.is_file():
        print(f"Cookie file not found: {args.cookies}", file=sys.stderr)
        return 2

    output_directory = args.output.resolve() / username
    output_directory.mkdir(parents=True, exist_ok=True)
    archive_file = output_directory / ".download-archive.sqlite3"

    command = [
        sys.executable,
        "-m",
        "gallery_dl",
        "--no-input",
        "--destination",
        str(output_directory),
        "--download-archive",
        str(archive_file),
        "--mtime",
        "date",
        "--option",
        "extractor.twitter.timeline.strategy=media",
        "--option",
        "extractor.twitter.search-results=media",
        "--option",
        "extractor.twitter.search-pagination=max_id",
        "--option",
        "extractor.twitter.search-stop=5",
        "--option",
        "extractor.twitter.ratelimit=wait",
        "--option",
        "extractor.twitter.replies=true",
        "--option",
        "extractor.twitter.retweets=false",
        "--option",
        "extractor.twitter.quoted=false",
    ]

    if args.write_metadata:
        command.append("--write-metadata")
    if args.cookies is not None:
        command.extend(("--cookies", str(args.cookies.resolve())))

    command.append(f"https://x.com/{username}")
    print(f"Target: @{username}")
    print(f"Output: {output_directory}")
    return subprocess.run(command, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
