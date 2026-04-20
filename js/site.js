(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  const navDropdown = document.querySelector(".nav-dropdown");

  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Luk menu" : "Åbn menu");
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

  const dialog = document.getElementById("transport-modal");
  if (dialog instanceof HTMLDialogElement) {
    const titleEl = document.getElementById("modal-title");
    const leadEl = document.getElementById("modal-lead");
    const prosEl = document.getElementById("modal-pros");
    const consEl = document.getElementById("modal-cons");
    const equipIntroEl = document.getElementById("modal-equipment-intro");
    const equipEl = document.getElementById("modal-equipment");
    const kickerEl = document.getElementById("modal-kicker");

    const content = {
      road: {
        kicker: "01 · Landevej",
        title: "Landevej",
        lead: "Fleksibel distribution i Europa — dør-til-dør med høj frekvens og klar plan.",
        pros: [
          "Dør-til-dør uden omlastning — lav håndteringsrisiko",
          "Høj frekvens og korte forløb på opstartstiden",
          "Bred materielvifte fra varebil til specialtrailer",
          "Stærk på kortere og mellemlange europæiske strækninger",
          "Nem at tilpasse, hvis planen ændrer sig undervejs",
        ],
        cons: [
          "Afhængig af kørsels-/hviletid, trafik og vejr",
          "Begrænset kapacitet pr. enhed (typisk 24 t / 33 paller)",
          "Højere CO₂-aftryk pr. ton-km end sø og rail",
          "Grænsekontrol og specialgods kan kræve ADR/tilladelser",
        ],
        equipmentIntro: "Fra standard 13,6 m curtain-trailer til specialtrailere til projektgods og tungt maskinel.",
        equipment: [
          { name: "Trækker + 13,6 m curtain-trailer", specs: "24.000 kg · 33 EUR-paller · lift/ADR" },
          { name: "Solobil 18 t", specs: "7.000 kg · 23 EUR-paller · lift/ADR" },
          { name: "Solobil 7,5 t", specs: "3.500 kg · 15 EUR-paller · lift/ADR" },
          { name: "Varebil 3,5 t", specs: "700–1.200 kg · 5–10 EUR-paller · lift/ADR" },
          { name: "Køl-/frysetrailer", specs: "22.000 kg · 13,6 × 2,45 × 2,65 m · temp.styret · ADR" },
          { name: "Platform / flak", specs: "24.000 kg · 13,6 m · til stål, kontainere og byggemateriale" },
          { name: "Tiefbett / lowbed", specs: "38.000 kg · niedrig bed · til høje maskiner og industrielementer" },
          { name: "Semi-lowloader", specs: "28.000 kg · hydrauliske ramper · til gravemaskiner og tungt grej" },
          { name: "Tele / udtrækstrailer", specs: "22.000 kg · forlænges op til 21 m · til lange elementer" },
        ],
      },
      sea: {
        kicker: "02 · Sø",
        title: "Sø",
        lead: "Robust og omkostningseffektiv til volumen — FCL, LCL og specialcontainere.",
        pros: [
          "Lavest pris pr. ton på volumen og lange distancer",
          "Global kapacitet og ruter til stort set alle markeder",
          "Specialløsninger til overbredt, højt, tungt og temperaturstyret gods",
          "Lavt CO₂-aftryk pr. ton-km",
          "Skalerer fra stykgods (LCL) til fulde containere (FCL)",
        ],
        cons: [
          "Lang transittid — ofte uger frem for dage",
          "Stramme cut-offs og dokumentkrav før afgang",
          "ETA-variation pga. vejr, havne og kaj-kapacitet",
          "Specialgods kræver korrekt stuvning og emballage",
        ],
        equipmentIntro: "Vi booker og koordinerer alle gængse containertyper — og finder specialudstyr til det der ikke passer i en standard-container.",
        equipment: [
          { name: "20' Dry container", specs: "Indv. ca. 5,9 × 2,35 × 2,39 m · ~28 t · tørlast, paller, kasser" },
          { name: "40' Dry container", specs: "Indv. ca. 12,03 × 2,35 × 2,39 m · ~28 t · tørlast, volumen" },
          { name: "40' High cube (HC)", specs: "Ekstra højde 2,69 m indv. · til volumetungt gods" },
          { name: "Reefer 20'/40'", specs: "Temperaturstyret −30 °C til +30 °C · pharma, food, perishables" },
          { name: "Open top", specs: "Åben top m/presenning · til overhøje emner og ovenfra-læsning" },
          { name: "Flat rack", specs: "Uden sider/tag · til overbredt gods, maskiner og stål" },
          { name: "Platform", specs: "Fladt dæk uden ender · til særligt lange eller tunge emner" },
          { name: "GOH (Garments on Hangers)", specs: "Integreret bøjlesystem · til konfektion uden ompakning" },
        ],
      },
      air: {
        kicker: "03 · Luft",
        title: "Luft",
        lead: "Når tid er kritisk — hurtige afgange, cut-offs og sikre handovers globalt.",
        pros: [
          "Hurtigst over lange afstande — typisk 1–3 dage dør-til-dør",
          "Høj frekvens og global rækkevidde via major hubs",
          "Stabil tidsplan og stramme SLA’er",
          "Velegnet til højværdigt, temperaturfølsomt og hastegods",
          "Lav lagerbinding pga. kort transittid",
        ],
        cons: [
          "Højeste pris pr. kg blandt transportformerne",
          "Volumenvægt (chargeable weight) kan fordyre let/volumetungt gods",
          "Stramme sikkerhedsregler og screening",
          "Farligt gods (DG) har omfattende IATA-restriktioner",
        ],
        equipmentIntro: "Fra general cargo på ULD-paller til fuld charter, når der skal skrues helt op for tempo eller kapacitet.",
        equipment: [
          { name: "General cargo", specs: "Stykgods på ULD-paller/containere · standard luftfragt" },
          { name: "Priority / Express", specs: "Øverste prioritet · hurtigste cut-off og første fly ud" },
          { name: "Temperature controlled", specs: "CRT/CFT-løsninger · pharma og perishables (+2/+8 °C, +15/+25 °C)" },
          { name: "Dangerous goods (DG)", specs: "IATA-certificeret håndtering · klasse 1–9 efter aftale" },
          { name: "Charter", specs: "Fuld maskine eller partial · projektlaster og hasteforsendelser" },
          { name: "ULD-typer", specs: "PMC / PAG / AKE · tilpasses gods og flytype" },
        ],
      },
      rail: {
        kicker: "04 · Rail",
        title: "Rail",
        lead: "Stærkt alternativ på udvalgte korridorer — stabil kapacitet og lavt CO₂-aftryk.",
        pros: [
          "God balance mellem pris og transit på etablerede korridorer",
          "Stabil kapacitet — mindre udsat for trafik og chaufførmangel",
          "Lavt CO₂-aftryk pr. ton-km",
          "Vejr-uafhængig fremdrift sammenlignet med vej og sø",
          "Stærk på bulk, containere og intermodale enheder",
        ],
        cons: [
          "Rute- og terminalafhængig frekvens",
          "Kræver næsten altid last-mile trucking",
          "Specialmål/-vægte kræver forhåndsplanlægning",
          "Færre direkte forbindelser end vej",
        ],
        equipmentIntro: "Intermodale containere på korridorer plus specialløsninger, når gods skal længere end et enkelt tog rækker.",
        equipment: [
          { name: "40'/45' container intermodal", specs: "Standard container på togvogn · kombineret med last-mile truck" },
          { name: "20' container intermodal", specs: "Til tunge eller densitetskrævende laster" },
          { name: "Block train", specs: "Dedikeret fuldtog på fast korridor · høj volumen og faste afgange" },
          { name: "Swap body / trailer-on-train", specs: "Trailer eller skifteladvogn · nem overlevering til truck" },
          { name: "Reefer rail", specs: "Temperaturstyret via gen-set · food og pharma på udvalgte ruter" },
          { name: "Specialvogne", specs: "Flat wagon, bogie wagon, heavy-duty · til overbredt og tungt gods" },
        ],
      },
    };

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
        const li = document.createElement("li");
        li.className = "equipment-item";
        const name = document.createElement("span");
        name.className = "equipment-name";
        name.textContent = item.name;
        const specs = document.createElement("span");
        specs.className = "equipment-specs";
        specs.textContent = item.specs;
        li.append(name, specs);
        el.appendChild(li);
      }
    }

    function openTransport(key) {
      const data = content[key];
      if (!data) return;
      if (kickerEl) kickerEl.textContent = data.kicker;
      if (titleEl) titleEl.textContent = data.title;
      if (leadEl) leadEl.textContent = data.lead;
      if (equipIntroEl) equipIntroEl.textContent = data.equipmentIntro;
      setList(prosEl, data.pros);
      setList(consEl, data.cons);
      setEquipment(equipEl, data.equipment);
      dialog.showModal();
      const inner = dialog.querySelector(".modal-inner");
      if (inner instanceof HTMLElement) inner.scrollTop = 0;
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

      const closeBtn = target.closest("[data-modal-close]");
      if (closeBtn) {
        dialog.close();
      }
    });

    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dialog.open) dialog.close();
    });
  }
})();
