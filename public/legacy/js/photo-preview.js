(function () {
  const PAGES = [
    { href: "index.html", label: "Live" },
    { href: "preview-recommended.html", label: "Recommended" },
    { href: "preview-hero-smile.html", label: "Hero: smile" },
    { href: "preview-hero-above.html", label: "Hero: from above" },
    { href: "preview-hero-bay.html", label: "Hero: bay" },
    { href: "preview-alt-takes.html", label: "Alt takes" },
    { href: "preview-gallery.html", label: "Gallery all" }
  ];
  const KEY = "jims-preview-scroll";
  const note = document.body.dataset.previewNote;
  if (note == null) return;

  const file = location.pathname.split("/").pop() || "index.html";
  const nav = document.createElement("nav");
  nav.className = "photo-preview-bar";
  nav.setAttribute("aria-label", "Photo layout previews");

  const title = document.createElement("strong");
  title.textContent = "Photo previews";
  nav.appendChild(title);

  PAGES.forEach((page) => {
    const link = document.createElement("a");
    link.href = page.href;
    link.textContent = page.label;
    if (page.href === file) link.setAttribute("aria-current", "page");
    link.addEventListener("click", () => {
      sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
    });
    nav.appendChild(link);
  });

  const noteEl = document.createElement("span");
  noteEl.className = "photo-preview-note";
  noteEl.textContent = note;
  nav.appendChild(noteEl);

  const lightbox = document.getElementById("lightbox");
  document.body.insertBefore(nav, lightbox);

  const saved = sessionStorage.getItem(KEY);
  if (saved == null) return;
  sessionStorage.removeItem(KEY);

  const y = Number(saved);
  if (!Number.isFinite(y)) return;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const restore = () => window.scrollTo(0, y);
  restore();
  window.addEventListener("load", restore);
})();
