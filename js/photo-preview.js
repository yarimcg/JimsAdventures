(function () {
  const KEY = "jims-preview-scroll";

  document.querySelectorAll(".photo-preview-bar a").forEach((link) => {
    link.addEventListener("click", () => {
      sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
    });
  });

  const saved = sessionStorage.getItem(KEY);
  if (saved == null) return;
  sessionStorage.removeItem(KEY);

  const y = Number(saved);
  if (!Number.isFinite(y)) return;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const restore = () => window.scrollTo(0, y);
  restore();
  window.addEventListener("load", restore);
  setTimeout(restore, 80);
  setTimeout(restore, 250);
})();
