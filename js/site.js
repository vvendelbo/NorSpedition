(() => {
  // ===================================================================
  // Image overrides
  // - local (admin portal): localStorage
  // - hosted (for all visitors): optional static JSON at assets/site-overrides.json
  // ===================================================================
  const IMG_STORAGE_KEY = "nor-spedition.image-overrides.v1";
  const IDB_DB_NAME = "nor-spedition";
  const IDB_STORE = "images";
  const IDB_PREFIX = "idb:";

  let publishedOverrides = {};
  let publishedFormEndpoint = "";
  const objectUrlCache = new Map();

  async function loadPublishedOverrides() {
    try {
      const res = await fetch("assets/site-overrides.json", { cache: "no-store" });
      if (!res.ok) return {};
      const json = await res.json();
      if (!json || typeof json !== "object") return {};
      const images = json.images && typeof json.images === "object" ? json.images : {};
      const formEndpoint = typeof json.formEndpoint === "string" ? json.formEndpoint : "";
      return { images, formEndpoint };
    } catch {
      return { images: {}, formEndpoint: "" };
    }
  }

  let dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function idbGet(key) {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  function loadLocalOverrides() {
    try {
      return JSON.parse(localStorage.getItem(IMG_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function getEffectiveOverrides() {
    // Local overrides win, so admin can still test locally without re-deploy
    return { ...publishedOverrides, ...loadLocalOverrides() };
  }

  async function resolveOverrideUrl(key, value) {
    if (typeof value !== "string") return null;
    if (!value) return null;
    if (!value.startsWith(IDB_PREFIX)) return value;

    if (objectUrlCache.has(key)) return objectUrlCache.get(key);
    try {
      const blob = await idbGet(key);
      if (!blob) return null;
      const url = URL.createObjectURL(blob);
      objectUrlCache.set(key, url);
      return url;
    } catch {
      return null;
    }
  }

  async function applyImageOverrides() {
    const overrides = getEffectiveOverrides();
    if (!overrides || typeof overrides !== "object") return;
    const imgs = Array.from(document.querySelectorAll("img[data-img-key]"));
    await Promise.all(imgs.map(async (el) => {
      const key = el.getAttribute("data-img-key");
      if (!key) return;
      const v = overrides[key];
      if (!v) return;
      const url = await resolveOverrideUrl(key, v);
      if (!url || !(el instanceof HTMLImageElement)) return;

      // Avoid "template flash" while the replacement image loads:
      // preload first, then swap + fade in once ready.
      const current = el.currentSrc || el.src || "";
      if (current === url) {
        el.classList.add("is-loaded");
        return;
      }

      el.classList.remove("is-loaded");

      const preloader = new Image();
      preloader.decoding = "async";
      preloader.onload = () => {
        el.src = url;
        // Next frame to ensure transition triggers reliably
        requestAnimationFrame(() => el.classList.add("is-loaded"));
      };
      preloader.onerror = () => {
        // Keep placeholder visible; don't swap src on error
        el.classList.add("is-loaded");
      };
      preloader.src = url;
    }));
  }

  async function applyVideoOverrides() {
    const overrides = getEffectiveOverrides();
    if (!overrides || typeof overrides !== "object") return;

    const cssEscape = (value) => {
      try {
        if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
      } catch {
        // ignore
      }
      return String(value).replace(/["\\]/g, "\\$&");
    };

    const videos = Array.from(document.querySelectorAll("video[data-video-key]"));
    await Promise.all(videos.map(async (el) => {
      const key = el.getAttribute("data-video-key");
      if (!key) return;
      const v = overrides[key];

      // optional fallback image key
      const fallbackImgKey = el.getAttribute("data-fallback-img-key") || "";
      const fallbackImg =
        fallbackImgKey ? document.querySelector(`img[data-img-key="${cssEscape(fallbackImgKey)}"]`) : null;

      if (!v) {
        el.hidden = true;
        if (fallbackImg instanceof HTMLImageElement) fallbackImg.hidden = false;
        el.removeAttribute("src");
        el.load();
        return;
      }

      const url = await resolveOverrideUrl(key, v);
      if (!url) return;

      // Ensure autoplay works reliably across browsers
      el.muted = true;
      el.playsInline = true;
      el.autoplay = true;
      el.loop = true;

      // Keep fallback visible until first frame is ready
      el.hidden = false;
      if (fallbackImg instanceof HTMLImageElement) fallbackImg.hidden = false;

      const onReady = () => {
        if (fallbackImg instanceof HTMLImageElement) fallbackImg.hidden = true;
        el.removeEventListener("loadeddata", onReady);
        el.removeEventListener("canplay", onReady);
      };
      const onError = () => {
        el.hidden = true;
        if (fallbackImg instanceof HTMLImageElement) fallbackImg.hidden = false;
        el.removeEventListener("error", onError);
      };

      el.addEventListener("loadeddata", onReady, { once: true });
      el.addEventListener("canplay", onReady, { once: true });
      el.addEventListener("error", onError, { once: true });

      el.src = url;
      el.load();
      el.play().catch(() => {});
    }));
  }

  // Apply overrides ASAP, then re-apply when published overrides load
  applyImageOverrides();
  applyVideoOverrides();
  (async () => {
    const published = await loadPublishedOverrides();
    publishedOverrides = (published && published.images) || {};
    publishedFormEndpoint = (published && published.formEndpoint) || "";
    applyImageOverrides();
    applyVideoOverrides();
  })();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===================================================================
  // Mobile nav toggle + dropdown close
  // ===================================================================
  const navBtn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  const navDropdown = document.querySelector(".nav-dropdown");

  const t = (key) => (window.I18n ? window.I18n.t(key) : key);

  if (navBtn && nav) {
    const setMobileNavOpen = (open) => {
      nav.classList.toggle("is-open", open);
      navBtn.setAttribute("aria-expanded", String(open));
      navBtn.setAttribute("aria-label", t(open ? "a11y.navClose" : "a11y.navOpen"));
      document.body.classList.toggle("nav-open", open);
    };

    navBtn.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      setMobileNavOpen(open);
    });

    nav.querySelectorAll("a[href]").forEach((a) => {
      a.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) setMobileNavOpen(false);
      });
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 769px)").matches && nav.classList.contains("is-open")) {
        setMobileNavOpen(false);
      }
    });
  }

  if (navDropdown) {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (navDropdown.hasAttribute("open") && !navDropdown.contains(target)) {
        navDropdown.removeAttribute("open");
      }
    });
  }

  // ===================================================================
  // Click-hint dismissal (after first click on any transport card)
  // ===================================================================
  const HINT_DISMISS_KEY = "nor-spedition.click-hint-dismissed.v1";
  if (localStorage.getItem(HINT_DISMISS_KEY) === "1") {
    document.body.classList.add("hints-dismissed");
  }
  function dismissHints() {
    localStorage.setItem(HINT_DISMISS_KEY, "1");
    document.body.classList.add("hints-dismissed");
  }

  // ===================================================================
  // Transport content (forces, weaknesses, equipment with rich detail)
  // ===================================================================
  let transportContent = {};
  let equipmentById = new Map();

  function rebuildTransportContent() {
    const lang = window.I18n ? window.I18n.getLang() : "da";
    transportContent = (window.TransportContent && window.TransportContent[lang]) || (window.TransportContent && window.TransportContent.da) || {};
    equipmentById = new Map();
    for (const [key, trans] of Object.entries(transportContent)) {
      for (const eq of trans.equipment || []) {
        equipmentById.set(eq.id, { ...eq, _transportKey: key, _transportTitle: trans.title });
      }
    }
  }

  rebuildTransportContent();
  window.addEventListener("langchange", rebuildTransportContent);

  // ===================================================================
  // Transport modal
  // ===================================================================
  const transportDialog = document.getElementById("transport-modal");
  const equipmentDialog = document.getElementById("equipment-modal");
  const quoteDialog = document.getElementById("quote-modal");
  let lastTransportKey = null;
  let lastEquipmentId = null;

  if (transportDialog instanceof HTMLDialogElement) {
    const titleEl = document.getElementById("modal-title");
    const leadEl = document.getElementById("modal-lead");
    const prosEl = document.getElementById("modal-pros");
    const consEl = document.getElementById("modal-cons");
    const equipIntroEl = document.getElementById("modal-equipment-intro");
    const equipEl = document.getElementById("modal-equipment");
    const kickerEl = document.getElementById("modal-kicker");

    function setList(el, items) {
      if (!(el instanceof HTMLElement)) return;
      el.innerHTML = "";
      for (const item of items) {
        const li = document.createElement("li");
        li.textContent = item;
        el.appendChild(li);
      }
    }

    function setEquipment(el, items) {
      if (!(el instanceof HTMLElement)) return;
      el.innerHTML = "";
      for (const item of items) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "equipment-item";
        btn.setAttribute("data-equipment-id", item.id);
        const name = document.createElement("span");
        name.className = "equipment-name";
        name.textContent = item.name;
        const specs = document.createElement("span");
        specs.className = "equipment-specs";
        specs.textContent = item.specs;
        const cta = document.createElement("span");
        cta.className = "equipment-cta";
        cta.textContent = t("modal.equipmentCta");
        btn.append(name, specs, cta);
        el.appendChild(btn);
      }
    }

    function openTransport(key, keepOpen) {
      const data = transportContent[key];
      if (!data) return;
      lastTransportKey = key;
      if (kickerEl) kickerEl.textContent = data.kicker;
      if (titleEl) titleEl.textContent = data.title;
      if (leadEl) leadEl.textContent = data.lead;
      if (equipIntroEl) equipIntroEl.textContent = data.equipmentIntro;
      setList(prosEl, data.pros);
      setList(consEl, data.cons);
      setEquipment(equipEl, data.equipment);
      if (equipmentDialog && equipmentDialog.open) equipmentDialog.close();
      if (!keepOpen) {
        transportDialog.showModal();
        dismissHints();
        const inner = transportDialog.querySelector(".modal-inner");
        if (inner instanceof HTMLElement) inner.scrollTop = 0;
      }
    }

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const openBtn = target.closest("[data-modal-open]");
      if (openBtn instanceof HTMLElement) {
        const key = openBtn.getAttribute("data-transport") || "";
        openTransport(key);
        return;
      }
    });

    transportDialog.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest("[data-modal-close]")) {
        transportDialog.close();
        return;
      }
      const rect = transportDialog.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) transportDialog.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && transportDialog.open) transportDialog.close();
    });

    window.addEventListener("langchange", () => {
      if (transportDialog.open && lastTransportKey) openTransport(lastTransportKey, true);
    });
  }

  // ===================================================================
  // Equipment detail modal (second layer)
  // ===================================================================
  if (equipmentDialog instanceof HTMLDialogElement) {
    const kickerEl = document.getElementById("equipment-kicker");
    const titleEl = document.getElementById("equipment-title");
    const leadEl = document.getElementById("equipment-lead");
    const imageEl = document.getElementById("equipment-image");
    const captionEl = document.getElementById("equipment-caption");
    const specsEl = document.getElementById("equipment-specs-list");
    const goodEl = document.getElementById("equipment-good");
    const notesEl = document.getElementById("equipment-notes");

    function setSpecs(el, rows) {
      if (!(el instanceof HTMLElement)) return;
      el.innerHTML = "";
      for (const [k, v] of rows) {
        const dt = document.createElement("dt");
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.textContent = v;
        el.append(dt, dd);
      }
    }
    function setList(el, items) {
      if (!(el instanceof HTMLElement)) return;
      el.innerHTML = "";
      for (const item of items || []) {
        const li = document.createElement("li");
        li.textContent = item;
        el.appendChild(li);
      }
    }

    function openEquipment(id, keepOpen) {
      const data = equipmentById.get(id);
      if (!data) return;
      lastEquipmentId = id;
      const imgKey = `equipment-${data.id}`;
      if (imageEl instanceof HTMLImageElement) {
        imageEl.setAttribute("data-img-key", imgKey);
        const overrides = getEffectiveOverrides();
        const raw = overrides[imgKey];
        if (raw) {
          resolveOverrideUrl(imgKey, raw).then((url) => {
            imageEl.src = url || "assets/card-placeholder.svg";
          });
        } else {
          imageEl.src = "assets/card-placeholder.svg";
        }
        imageEl.alt = data.name;
      }
      if (captionEl) captionEl.textContent = `${data._transportTitle} · ${data.name}`;
      if (kickerEl) kickerEl.textContent = `${data._transportTitle} · ${t("modal.equipmentType")}`;
      if (titleEl) titleEl.textContent = data.name;
      if (leadEl) leadEl.textContent = data.lead || "";
      setSpecs(specsEl, data.details || []);
      setList(goodEl, data.goodFor || []);
      setList(notesEl, data.notes || []);
      if (transportDialog && transportDialog.open) transportDialog.close();
      if (!keepOpen) {
        equipmentDialog.showModal();
        const inner = equipmentDialog.querySelector(".modal-inner");
        if (inner instanceof HTMLElement) inner.scrollTop = 0;
      }
    }

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const btn = target.closest("[data-equipment-id]");
      if (btn instanceof HTMLElement) {
        const id = btn.getAttribute("data-equipment-id") || "";
        openEquipment(id);
      }
    });

    equipmentDialog.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-equipment-back]")) {
        equipmentDialog.close();
        if (lastTransportKey) {
          const openBtn = document.querySelector(`[data-transport="${lastTransportKey}"]`);
          if (openBtn instanceof HTMLElement) openBtn.click();
        }
        return;
      }
      if (target.closest("[data-modal-close]")) {
        equipmentDialog.close();
        return;
      }
      const rect = equipmentDialog.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) equipmentDialog.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && equipmentDialog.open) equipmentDialog.close();
    });

    window.addEventListener("langchange", () => {
      if (equipmentDialog.open && lastEquipmentId) openEquipment(lastEquipmentId, true);
    });
  }

  // ===================================================================
  // Countdown widgets ([data-countdown-target] = ISO datetime)
  // ===================================================================
  const countdownEls = document.querySelectorAll("[data-countdown-target]");
  if (countdownEls.length) {
    const pad = (n) => String(n).padStart(2, "0");

    function tickCountdown(el) {
      const target = el.getAttribute("data-countdown-target");
      if (!target) return;
      const targetMs = Date.parse(target);
      if (Number.isNaN(targetMs)) return;

      const diff = targetMs - Date.now();
      const labelEl = el.querySelector(".team-countdown-label");
      const dateEl = el.querySelector(".team-countdown-date");

      if (diff <= 0) {
        el.setAttribute("data-countdown-state", "done");
        if (labelEl) labelEl.textContent = t("team.joined");
        if (dateEl) dateEl.textContent = t("team.welcome");

        // Reveal upcoming colleague card (if countdown is attached to it)
        const member = el.closest(".team-member--blackout");
        if (member instanceof HTMLElement) {
          member.classList.add("is-revealed");
          const revealedBody = member.querySelector(".team-body--revealed");
          if (revealedBody instanceof HTMLElement) revealedBody.removeAttribute("aria-hidden");
        }
        return;
      }

      el.setAttribute("data-countdown-state", "running");
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const map = { days: String(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
      el.querySelectorAll("[data-countdown-unit]").forEach((node) => {
        const unit = node.getAttribute("data-countdown-unit");
        if (unit && map[unit] !== undefined) node.textContent = map[unit];
      });
    }

    function tickAll() {
      countdownEls.forEach(tickCountdown);
    }
    tickAll();
    setInterval(tickAll, 1000);

    window.addEventListener("langchange", () => {
      countdownEls.forEach((el) => {
        const labelEl = el.querySelector(".team-countdown-label");
        const dateEl = el.querySelector(".team-countdown-date");
        const state = el.getAttribute("data-countdown-state");
        if (state === "done") {
          if (labelEl) labelEl.textContent = t("team.joined");
          if (dateEl) dateEl.textContent = t("team.welcome");
        } else if (state === "running" && labelEl) {
          labelEl.textContent = t("team.joiningCountdown");
        }
        el.querySelectorAll(".team-countdown-unit-label").forEach((node, idx) => {
          const keys = ["team.days", "team.hours", "team.mins", "team.secs"];
          if (keys[idx]) node.textContent = t(keys[idx]);
        });
        const dateLabel = el.querySelector(".team-countdown-date");
        if (dateLabel && state !== "done") dateLabel.textContent = t("team.joinedDate");
      });
    });
  }

  // ===================================================================
  // Quote modal + form submission
  // ===================================================================
  if (quoteDialog instanceof HTMLDialogElement) {
    const form = document.getElementById("quote-form");
    const statusEl = document.getElementById("quote-status");

    function openQuote() {
      if (transportDialog && transportDialog.open) transportDialog.close();
      if (equipmentDialog && equipmentDialog.open) equipmentDialog.close();
      quoteDialog.showModal();
      if (statusEl) statusEl.textContent = "";
      const inner = quoteDialog.querySelector(".modal-inner");
      if (inner instanceof HTMLElement) inner.scrollTop = 0;
    }

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-open-quote]")) {
        openQuote();
      }
    });

    quoteDialog.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-modal-close]")) {
        quoteDialog.close();
        return;
      }
      const rect = quoteDialog.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) quoteDialog.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && quoteDialog.open) quoteDialog.close();
    });

    if (form instanceof HTMLFormElement) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;

        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());

        const setStatus = (msg, tone) => {
          if (!statusEl) return;
          statusEl.textContent = msg;
          statusEl.dataset.tone = tone || "";
        };

        // Read endpoint from:
        // - data-endpoint (hardcoded)
        // - localStorage (admin test)
        // - published overrides (assets/site-overrides.json)
        const endpoint =
          form.getAttribute("data-endpoint") ||
          localStorage.getItem("nor-spedition.form-endpoint") ||
          publishedFormEndpoint ||
          "";

        // If an endpoint is configured, POST to it (Formspree/Basin/Getform/Netlify etc.)
        if (endpoint) {
          try {
            setStatus(t("form.sending"), "pending");
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Accept": "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({
                _subject: `${t("form.subject")} — ${payload.transport || "NOR Spedition"}`,
                ...payload,
              }),
            });
            if (!res.ok) throw new Error(String(res.status));
            setStatus(t("form.success"), "success");
            form.reset();
            return;
          } catch (err) {
            setStatus(t("form.error"), "warn");
          }
        }

        // Fallback: mailto: with pre-filled body
        const subject = `${t("form.subject")} — ${payload.transport || "NOR Spedition"}`;
        const body = [
          `${t("quote.name")}: ${payload.name || ""}`,
          `${t("quote.company")}: ${payload.company || ""}`,
          `${t("quote.email")}: ${payload.email || ""}`,
          `${t("quote.phone")}: ${payload.phone || ""}`,
          "",
          `${t("quote.transport")}: ${payload.transport || ""}`,
          "",
          `— ${t("quote.cargo")} —`,
          `${payload.cargo || ""}`,
          "",
          `— ${t("quote.notes")} —`,
          `${payload.notes || ""}`,
          "",
          `— ${t("quote.pickup")} —`,
          `${t("quote.loadingPlace")}: ${payload.loadingPlace || ""}  (${payload.loadingDate || t("form.dateNotSet")})`,
          `${t("quote.unloadingPlace")}: ${payload.unloadingPlace || ""}  (${payload.unloadingDate || t("form.dateNotSet")})`,
          "",
          `— ${t("quote.contactInfo")} —`,
          `${t("quote.name")}: ${payload.name || ""}`,
          `${t("quote.company")}: ${payload.company || ""}`,
          `${t("quote.email")}: ${payload.email || ""}`,
          `${t("quote.phone")}: ${payload.phone || ""}`,
        ].join("\n");
        const mailto = `mailto:contact@norspedition.dk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus(t("form.mailto"), "success");
        window.location.href = mailto;
      });
    }
  }
})();
