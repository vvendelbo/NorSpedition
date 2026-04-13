(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
  const metaDesc = document.querySelector('meta[name="description"]');
  const navDropdown = document.querySelector(".nav-dropdown");

  let currentLang = "da";

  // Mobile nav toggle
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", currentLang === "en" ? (open ? "Close menu" : "Open menu") : open ? "Luk menu" : "Åbn menu");
    });
  }

  // Close <details> dropdown on outside click (desktop)
  if (navDropdown) {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (navDropdown.hasAttribute("open") && !navDropdown.contains(target)) {
        navDropdown.removeAttribute("open");
      }
    });
  }

  const translations = {
    da: {
      title: "NOR Spedition — Spedition & logistik",
      description: "NOR Spedition er et speditionsfirma der håndterer courier, sø, jernbane, luft og vej — inkl. express.",
      "nav.products": "Produkter",
      "nav.niceToKnow": "Nice to know",
      "nav.convert": "Omregning",
      "nav.insurance": "Transportforsikring",
      "nav.customs": "Told",
      "nav.incoterms": "Incoterms",
      "nav.road": "Landevej",
      "nav.sea": "Søfragt",
      "nav.air": "Luftfragt",
      "nav.rail": "Jernbane",
      "nav.news": "Nyheder",
      "nav.who": "Hvem er vi",
      "nav.contact": "Kontakt",
      "home.latestLabel": "Nyheder",
      "home.latestH2": "Seneste indlæg",
      "home.latestBody": "Her er et par eksempelindlæg (lorem ipsum), så I kan se opsætningen. Erstat dem med jeres egne nyheder eller cases.",
      "footer.contactLabel": "Kontakt",
      "footer.phone": "Telefon",
      "footer.email": "E-mail",
    },
    en: {
      title: "NOR Spedition — Freight Forwarding & Logistics",
      description: "NOR Spedition handles courier, sea, rail, air and road shipments — including express deliveries.",
      "nav.products": "Products",
      "nav.niceToKnow": "Nice to know",
      "nav.convert": "Conversion",
      "nav.insurance": "Cargo insurance",
      "nav.customs": "Customs",
      "nav.incoterms": "Incoterms",
      "nav.road": "Road",
      "nav.sea": "Sea",
      "nav.air": "Air",
      "nav.rail": "Rail",
      "nav.news": "News",
      "nav.who": "Who we are",
      "nav.contact": "Contact",
      "home.latestLabel": "News",
      "home.latestH2": "Latest posts",
      "home.latestBody": "A few placeholder posts (lorem ipsum) to show the layout. Replace them with your own news or cases.",
      "footer.contactLabel": "Contact",
      "footer.phone": "Phone",
      "footer.email": "Email",
    },
  };

  function applyLang(lang) {
    const dict = translations[lang] || translations.da;
    currentLang = lang;

    document.documentElement.lang = lang;
    document.title = dict.title;
    if (metaDesc) metaDesc.setAttribute("content", dict.description);

    const nodes = Array.from(document.querySelectorAll("[data-i18n]"));
    for (const el of nodes) {
      const key = el.getAttribute("data-i18n") || "";
      const val = dict[key];
      if (typeof val !== "string") continue;
      if (val.includes("<br")) el.innerHTML = val;
      else el.textContent = val;
    }

    for (const b of langButtons) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    }

    if (btn) {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-label", lang === "en" ? (expanded ? "Close menu" : "Open menu") : expanded ? "Luk menu" : "Åbn menu");
    }
  }

  for (const b of langButtons) {
    b.addEventListener("click", () => applyLang(b.getAttribute("data-lang") || "da"));
  }

  // Default language
  applyLang("da");
})();

