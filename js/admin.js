(() => {
  const IMG_STORAGE_KEY = "nor-spedition.image-overrides.v1";
  const ENDPOINT_KEY = "nor-spedition.form-endpoint";
  const MAX_DATAURL_BYTES = 2_500_000; // ~2.5 MB — safe ceiling for localStorage

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const slots = [
    { key: "logo", title: "Logo", desc: "Vises i header og footer. Transparent PNG eller SVG anbefales.", default: "assets/logo-nor-spedition.png" },
    { key: "hero", title: "Hero-baggrund (forsiden)", desc: "Stort billede bag overskriften. Bredformat (fx 2400×1350) virker bedst.", default: "assets/hero-placeholder.svg" },

    { key: "keypoint-overblik", title: "Keypoint: Overblik", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },
    { key: "keypoint-tempo", title: "Keypoint: Tempo", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },
    { key: "keypoint-struktur", title: "Keypoint: Struktur", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },
    { key: "keypoint-netvaerk", title: "Keypoint: Netværk", desc: "Kvadratisk ikon/billede (128×128 eller større).", default: "assets/card-placeholder.svg" },

    { key: "transport-road", title: "Transportkort: Landevej", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/card-placeholder.svg" },
    { key: "transport-sea", title: "Transportkort: Sø", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/card-placeholder.svg" },
    { key: "transport-air", title: "Transportkort: Luft", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/card-placeholder.svg" },
    { key: "transport-rail", title: "Transportkort: Rail", desc: "Portræt-orienteret (3:4). Bruges på forsiden.", default: "assets/card-placeholder.svg" },

    { key: "team-mathias", title: "Portræt: Mathias Bruse Kristensen", desc: "Kvadratisk portræt (fx 800×800).", default: "assets/team-mathias-placeholder.svg" },
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

  const grid = document.getElementById("admin-grid");
  const tpl = document.getElementById("admin-slot-template");
  if (!(grid instanceof HTMLElement) || !(tpl instanceof HTMLTemplateElement)) return;

  const slotNodes = new Map();

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

    const overrides = loadOverrides();
    const current = overrides[slot.key] || slot.default;
    img.src = current;
    img.alt = slot.title;

    fileInput.addEventListener("change", async (e) => {
      const f = e.target && e.target.files && e.target.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) {
        setStatus("Filen er ikke et billede.", "warn");
        return;
      }
      try {
        const dataUrl = await fileToDataURL(f);
        if (dataUrl.length > MAX_DATAURL_BYTES) {
          setStatus(`Billedet er for stort (${Math.round(dataUrl.length / 1024)} KB). Prøv at komprimere eller skalere ned.`, "warn");
          return;
        }
        const all = loadOverrides();
        all[slot.key] = dataUrl;
        try {
          saveOverrides(all);
        } catch {
          setStatus("Browserens localStorage er fuld. Nulstil nogle billeder eller brug mindre filer.", "warn");
          return;
        }
        img.src = dataUrl;
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
    const payload = {
      images: loadOverrides(),
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
