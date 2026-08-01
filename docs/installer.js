(() => {
  "use strict";

  const link = document.querySelector("#bookmarklet");
  const copyButton = document.querySelector("#copy-button");
  const help = document.querySelector("#bookmark-help");

  fetch("bookmarklet.min.js", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((source) => {
      // Firefox treats a raw # inside a javascript: URL as a fragment boundary.
      const bookmarkUrl = `javascript:${source.trim().replaceAll("#", "%23")}`;
      link.href = bookmarkUrl;
      link.classList.remove("is-loading");
      copyButton.disabled = false;

      link.addEventListener("click", (event) => {
        event.preventDefault();
        help.textContent = "このボタンをブックマークバーへドラッグしてから、X上で押してください。";
      });

      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(bookmarkUrl);
          copyButton.textContent = "コピーしました";
          setTimeout(() => { copyButton.textContent = "リンクをコピー"; }, 1800);
        } catch {
          help.textContent = "コピーできませんでした。ボタンを右クリックしてリンクをコピーしてください。";
        }
      });
    })
    .catch(() => {
      link.textContent = "読込に失敗しました";
      help.textContent = "ページを再読み込みしてください。";
    });
})();
