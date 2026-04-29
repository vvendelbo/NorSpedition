// NOTE: This is a lightweight frontend-only gate for a static site.
// It deters casual access but is not equivalent to server-side auth.
(async () => {
  const IMG_STORAGE_KEY = "nor-spedition.image-overrides.v1";
  const ENDPOINT_KEY = "nor-spedition.form-endpoint";
  const IDB_DB_NAME = "nor-spedition";
  const IDB_STORE = "images";
  const IDB_PREFIX = "idb:"; // stored in localStorage mapping as a lightweight pointer

  // Soft limit for conversion-to-dataURL exports (JSON export can get huge).
  // IndexedDB can store larger blobs, but exporting extremely large base64 JSON isn't very practical.
  const MAX_EXPORT_DATAURL_BYTES = 25_000_000; // ~25 MB (dataURL chars)
  const ADMIN_AUTH_KEY = "nor-spedition.admin-auth.v1";
  const ADMIN_PASSWORD_SHA256_HEX = "5ff9e8275cb3ebd51f92460c91c174fa0d6107ebd1238b26cead823bfa1673c3"; // "nor-admin-2026"

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

  async function idbSet(key, blob) {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.objectStore(IDB_STORE).put(blob, key);
    });
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

  async function idbDel(key) {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.objectStore(IDB_STORE).delete(key);
    });
  }

  async function sha256Hex(str) {
    const data = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function requireAdminPassword() {
    try {
      if (sessionStorage.getItem(ADMIN_AUTH_KEY) === "1") return true;
    } catch {
      // ignore
    }

    document.body.classList.add("admin-locked");

    const lockEl = document.getElementById("admin-lock");
    const form = document.getElementById("admin-lock-form");
    const input = document.getElementById("admin-password");
    const statusEl = document.getElementById("admin-lock-status");

    if (!(lockEl instanceof HTMLElement) || !(form instanceof HTMLFormElement) || !(input instanceof HTMLInputElement)) {
      return false;
    }

    lockEl.hidden = false;
    queueMicrotask(() => input.focus());

    const setStatus = (msg, tone) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.dataset.tone = tone || "";
    };

    return await new Promise((resolve) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const pw = input.value || "";
        if (!pw) return;
        try {
          const hex = await sha256Hex(pw);
          if (hex !== ADMIN_PASSWORD_SHA256_HEX) {
            setStatus("Forkert password. Prøv igen.", "warn");
            input.select();
            return;
          }
          try {
            sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
          } catch {
            // ignore
          }
          lockEl.hidden = true;
          document.body.classList.remove("admin-locked");
          resolve(true);
        } catch {
          setStatus("Kunne ikke validere password i denne browser.", "warn");
          resolve(false);
        }
      });
    });
  }

  const authed = await requireAdminPassword();
  if (!authed) return;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const slots = [
    { key: "logo", title: "Logo", desc: "Vises i header og footer. Transparent PNG eller SVG anbefales.", default: "assets/logo-nor-spedition.png" },
    { key: "hero", title: "Hero-baggrund (forsiden)", desc: "Stort billede bag overskriften. Bredformat (fx 2400×1350) virker bedst.", default: "assets/hero-placeholder.svg" },

    { key: "keypoint-overblik", title: "Keypoint: Overblik", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },
    { key: "keypoint-tempo", title: "Keypoint: Tempo", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },
    { key: "keypoint-struktur", title: "Keypoint: Struktur", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },
    { key: "keypoint-netvaerk", title: "Keypoint: Netværk", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },

    { key: "transport-road", title: "Transportkort: Landevej", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/transport-road.webp" },
    { key: "transport-sea", title: "Transportkort: Sø", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/transport-sea.webp" },
    { key: "transport-air", title: "Transportkort: Luft", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/transport-air.webp" },
    { key: "transport-rail", title: "Transportkort: Rail", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/transport-rail.webp" },

    { key: "team-mathias-anon", title: "Portræt: Kommende kollega (anonymt)", desc: "Anonymt/neutral billede (kvadratisk, fx 800×800). Vises indtil nedtællingen er slut.", default: "assets/team-mathias-anon.png" },
    { key: "team-mathias", title: "Portræt: Kommende kollega (offentlig)", desc: "Rigtigt portræt (kvadratisk, fx 800×800). Vises når nedtællingen er slut.", default: "assets/team-mathias-placeholder.svg" },
    { key: "team-viktor", title: "Portræt: Viktor Mejlvang", desc: "Kvadratisk portræt (fx 800×800).", default: "assets/team-viktor-placeholder.svg" },
    { key: "team-victor", title: "Portræt: Victor Vendelbo", desc: "Kvadratisk portræt (fx 800×800).", default: "assets/team-victor-placeholder.svg" },

    { key: "equipment-default", title: "Default for materiel-visualisering", desc: "Fallback-billede der vises når et specifikt materiel-id ikke har eget billede.", default: "assets/card-placeholder.svg" },

    { key: "equipment-road-curtain", title: "Materiel · Trækker + 13,6 m curtain", desc: "Vises i materiel-modal (16:10 anbefales).", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-solo18", title: "Materiel · Solobil 18 t", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-solo75", title: "Materiel · Solobil 7,5 t", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-van", title: "Materiel · Varebil 3,5 t", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-reefer", title: "Materiel · Køl-/frysetrailer", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-platform", title: "Materiel · Platform / flak", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-tiefbett", title: "Materiel · Tiefbett / lowbed", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-semi", title: "Materiel · Semi-lowloader", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-road-tele", title: "Materiel · Tele/udtræk", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },

    { key: "equipment-sea-dry20", title: "Materiel · 20' Dry container", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-sea-dry40", title: "Materiel · 40' Dry container", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-sea-hc", title: "Materiel · 40' High cube", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-sea-reefer", title: "Materiel · Reefer 20'/40'", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-sea-opentop", title: "Materiel · Open top", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-sea-flatrack", title: "Materiel · Flat rack", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-sea-platform", title: "Materiel · Platform (container)", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-sea-goh", title: "Materiel · GOH", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },

    { key: "equipment-air-general", title: "Materiel · Air general cargo", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-air-priority", title: "Materiel · Air priority/express", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-air-temp", title: "Materiel · Air temp. controlled", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-air-dg", title: "Materiel · Air dangerous goods", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-air-charter", title: "Materiel · Air charter", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-air-uld", title: "Materiel · Air ULD-typer", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },

    { key: "equipment-rail-intermodal", title: "Materiel · 40'/45' rail intermodal", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-rail-20ft", title: "Materiel · 20' rail intermodal", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-rail-block", title: "Materiel · Block train", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-rail-swap", title: "Materiel · Swap body / trailer-on-train", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-rail-reefer", title: "Materiel · Reefer rail", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
    { key: "equipment-rail-special", title: "Materiel · Rail specialvogne", desc: "Vises i materiel-modal.", default: "assets/card-placeholder.svg" },
  ];

  const statusEl = document.getElementById("admin-status");
  function setStatus(msg, tone) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.dataset.tone = tone || "";
  }

  function loadOverrides() {
    try {
      return JSON.parse(localStorage.getItem(IMG_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }
  function saveOverrides(obj) {
    localStorage.setItem(IMG_STORAGE_KEY, JSON.stringify(obj));
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  const grid = document.getElementById("admin-grid");
  const tpl = document.getElementById("admin-slot-template");
  if (!(grid instanceof HTMLElement) || !(tpl instanceof HTMLTemplateElement)) return;

  const slotNodes = new Map();
  const slotObjectUrls = new Map();

  function renderSlot(slot) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const img = node.querySelector("img");
    const titleEl = node.querySelector(".admin-slot-title");
    const descEl = node.querySelector(".admin-slot-desc");
    const keyEl = node.querySelector(".admin-slot-key code");
    const fileInput = node.querySelector("input[type=file]");
    const resetBtn = node.querySelector(".admin-reset-btn");

    titleEl.textContent = slot.title;
    descEl.textContent = slot.desc;
    keyEl.textContent = slot.key;

    img.alt = slot.title;

    async function refreshPreview() {
      const overrides = loadOverrides();
      const current = overrides[slot.key] || "";
      const prevUrl = slotObjectUrls.get(slot.key);
      if (prevUrl) URL.revokeObjectURL(prevUrl);

      if (typeof current === "string" && current.startsWith(IDB_PREFIX)) {
        const blob = await idbGet(slot.key);
        if (blob) {
          const url = URL.createObjectURL(blob);
          slotObjectUrls.set(slot.key, url);
          img.src = url;
          return;
        }
      }
      img.src = current || slot.default;
    }
    refreshPreview();

    fileInput.addEventListener("change", async (e) => {
      const f = e.target && e.target.files && e.target.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) {
        setStatus("Filen er ikke et billede.", "warn");
        return;
      }
      try {
        try {
          await idbSet(slot.key, f);
        } catch {
          setStatus("Kunne ikke gemme billedet i browserens storage (IndexedDB).", "warn");
          return;
        }
        const all = loadOverrides();
        all[slot.key] = `${IDB_PREFIX}${slot.key}`;
        saveOverrides(all);
        await refreshPreview();
        setStatus(`“${slot.title}” opdateret.`, "success");
      } catch {
        setStatus("Kunne ikke læse filen.", "warn");
      }
      fileInput.value = "";
    });

    resetBtn.addEventListener("click", () => {
      const all = loadOverrides();
      if (all[slot.key]) {
        delete all[slot.key];
        saveOverrides(all);
      }
      idbDel(slot.key).catch(() => {});
      img.src = slot.default;
      setStatus(`“${slot.title}” nulstillet.`, "success");
    });

    slotNodes.set(slot.key, img);
    return node;
  }

  for (const s of slots) grid.appendChild(renderSlot(s));

  document.getElementById("reset-all-btn").addEventListener("click", () => {
    if (!confirm("Sikker på du vil nulstille ALLE billeder til placeholders?")) return;
    localStorage.removeItem(IMG_STORAGE_KEY);
    for (const s of slots) {
      const img = slotNodes.get(s.key);
      if (img) img.src = s.default;
    }
    setStatus("Alle billeder nulstillet.", "success");
  });

  document.getElementById("export-btn").addEventListener("click", () => {
    (async () => {
      const images = loadOverrides();
      for (const [k, v] of Object.entries(images)) {
        if (typeof v === "string" && v.startsWith(IDB_PREFIX)) {
          const blob = await idbGet(k);
          if (!blob) continue;
          const dataUrl = await blobToDataURL(blob);
          if (dataUrl.length > MAX_EXPORT_DATAURL_BYTES) {
            setStatus(`“${k}” er meget stor til eksport (JSON). Komprimér billedet før eksport.`, "warn");
            return;
          }
          images[k] = dataUrl;
        }
      }
      const payload = {
        images,
        formEndpoint: localStorage.getItem(ENDPOINT_KEY) || "",
        exportedAt: new Date().toISOString(),
        version: 1,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nor-spedition-admin-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Indstillinger eksporteret.", "success");
    })().catch(() => setStatus("Kunne ikke eksportere indstillinger.", "warn"));
  });

  // Export file meant to be deployed with the static site (picked up by js/site.js)
  document.getElementById("export-hosted-btn").addEventListener("click", () => {
    (async () => {
      const images = loadOverrides();
      for (const [k, v] of Object.entries(images)) {
        if (typeof v === "string" && v.startsWith(IDB_PREFIX)) {
          const blob = await idbGet(k);
          if (!blob) continue;
          const dataUrl = await blobToDataURL(blob);
          if (dataUrl.length > MAX_EXPORT_DATAURL_BYTES) {
            setStatus(`“${k}” er meget stor til eksport (JSON). Komprimér billedet før eksport.`, "warn");
            return;
          }
          images[k] = dataUrl;
        }
      }
      const payload = {
        images,
        exportedAt: new Date().toISOString(),
        version: 1,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "site-overrides.json";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Eksporteret: upload 'assets/site-overrides.json' sammen med sitet.", "success");
    })().catch(() => setStatus("Kunne ikke eksportere til hosting.", "warn"));
  });

  document.getElementById("import-file").addEventListener("change", async (e) => {
    const f = e.target && e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      if (parsed.images && typeof parsed.images === "object") {
        saveOverrides(parsed.images);
        for (const s of slots) {
          const img = slotNodes.get(s.key);
          if (img) img.src = parsed.images[s.key] || s.default;
        }
      }
      if (typeof parsed.formEndpoint === "string") {
        if (parsed.formEndpoint) localStorage.setItem(ENDPOINT_KEY, parsed.formEndpoint);
        const input = document.getElementById("endpoint-input");
        if (input instanceof HTMLInputElement) input.value = parsed.formEndpoint;
      }
      setStatus("Indstillinger importeret.", "success");
    } catch {
      setStatus("Kunne ikke læse/parse filen.", "warn");
    }
    e.target.value = "";
  });

  // Endpoint configuration
  const endpointInput = document.getElementById("endpoint-input");
  if (endpointInput instanceof HTMLInputElement) {
    endpointInput.value = localStorage.getItem(ENDPOINT_KEY) || "";
  }
  document.getElementById("endpoint-save").addEventListener("click", () => {
    const v = (endpointInput instanceof HTMLInputElement ? endpointInput.value : "").trim();
    if (!v) {
      setStatus("Tilføj en gyldig URL før du gemmer.", "warn");
      return;
    }
    if (!/^https:\/\//.test(v)) {
      setStatus("Brug en HTTPS-URL.", "warn");
      return;
    }
    localStorage.setItem(ENDPOINT_KEY, v);
    setStatus("Endpoint gemt. Test ved at åbne forsiden og klikke 'Spørg på pris'.", "success");
  });
  document.getElementById("endpoint-clear").addEventListener("click", () => {
    localStorage.removeItem(ENDPOINT_KEY);
    if (endpointInput instanceof HTMLInputElement) endpointInput.value = "";
    setStatus("Endpoint fjernet. Formularen falder nu tilbage til mailto.", "success");
  });
})();
