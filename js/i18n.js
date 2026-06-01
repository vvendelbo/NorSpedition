(() => {
  const STORAGE_KEY = "nor-spedition.lang.v1";
  const SUPPORTED = ["da", "en"];

  const STRINGS = {
    da: {
      "meta.title": "NOR Spedition — Spedition & logistik",
      "meta.description": "Spedition og logistik med klare aftaler og tæt opfølgning — road, sea, air og rail.",
      "meta.title.transport": "NOR Spedition — Transportformer",
      "meta.description.transport": "Et overblik over NOR Speditions transportformer.",
      "meta.title.contact": "NOR Spedition — Kontakt",
      "meta.description.contact": "Kontakt NOR Spedition.",
      "meta.title.news": "NOR Spedition — Nyheder",
      "meta.description.news": "Nyheder og opdateringer fra NOR Spedition.",

      "a11y.navMain": "Hovednavigation",
      "a11y.navOpen": "Åbn menu",
      "a11y.navClose": "Luk menu",
      "a11y.langSwitch": "Sprogvalg",
      "a11y.close": "Luk",
      "a11y.footer": "Footer",

      "nav.transportModes": "Transportformer",
      "nav.team": "Team",
      "nav.contact": "Kontakt",
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

      "hero.kicker": "Spedition & logistik",
      "hero.title": "Aftaler <em>der holder.</em>",
      "hero.lead": "Forudsigelighed, transparens og stærke partnerskaber — på tværs af landevej, sø, luft og rail.",
      "hero.contact": "Kontakt os",
      "hero.quote": "Spørg på pris",
      "hero.transport": "Se transportformer",

      "keypoints.label": "Hvorfor NOR Spedition",
      "keypoints.title": "Det får du, når vi rykker dit gods",
      "keypoints.overview.title": "Overblik",
      "keypoints.overview.text": "En fast kontaktperson og klare aftaler fra booking til levering.",
      "keypoints.tempo.title": "Tempo",
      "keypoints.tempo.text": "Hurtig respons og realistiske ETA'er — også når det haster.",
      "keypoints.structure.title": "Struktur",
      "keypoints.structure.text": "Dokumenter og opfølgning samlet, så intet falder mellem to stole.",
      "keypoints.network.title": "Netværk",
      "keypoints.network.text": "Stærke partnerskaber — vi finder kapaciteten, også på de vanskelige dage.",

      "transport.label": "De fire transportformer",
      "transport.title": "Én af fire — <em>altid med samme service.</em>",
      "transport.intro": "I bund og grund findes der fire transportformer: landevej, sø, luft og rail. Vi excellerer i alle fire gennem stærke partnerskaber og et bredt netværk — og hjælper dig med at vælge rigtigt ud fra tid, pris og robusthed. Klik på et kort for at se forcer, svagheder og hvilke materieltyper vi typisk anvender.",
      "transport.hint": "Tryk på et kort",
      "transport.road.badge": "01 · Landevej",
      "transport.road.title": "Landevej",
      "transport.road.desc": "Fleksibel distribution i Europa med høj frekvens og tydelig plan.",
      "transport.road.cta": "Se forcer, svagheder & materiel →",
      "transport.sea.badge": "02 · Sø",
      "transport.sea.title": "Sø",
      "transport.sea.desc": "Robust og omkostningseffektiv til volumen — FCL/LCL.",
      "transport.sea.cta": "Se forcer, svagheder & materiel →",
      "transport.air.badge": "03 · Luft",
      "transport.air.title": "Luft",
      "transport.air.desc": "Når tid er kritisk — plan, cut-offs og sikre handovers.",
      "transport.air.cta": "Se forcer, svagheder & materiel →",
      "transport.rail.badge": "04 · Rail",
      "transport.rail.title": "Rail",
      "transport.rail.desc": "Et stærkt alternativ på udvalgte korridorer med stabil kapacitet.",
      "transport.rail.cta": "Se forcer, svagheder & materiel →",

      "stats.modes": "Transportformer under ét tag",
      "stats.offices": "Kontorer — Hirtshals & København",
      "stats.traceability": "Sporbarhed og klare aftaler",
      "stats.contact": "Fast kontaktperson pr. kunde",

      "team.label": "Mennesker bag",
      "team.title": "Dem <em>du ringer til.</em>",
      "team.intro": "Hos NOR Spedition arbejder du altid med et menneske — ikke et ticket-system. Bag os står langvarige partnerskaber, faste aftaler og et bredt netværk af pålidelige samarbejdspartnere, og det er det, der giver os reel global rækkevidde.",
      "team.direct": "Direkte",
      "team.email": "E-mail",
      "team.role.partner": "Partner & speditør",
      "team.role.forwarder": "Speditør",
      "team.joiningSoon": "Tiltræder snart",
      "team.joiningNote": "Vi byder snart en ny kollega velkommen. Detaljer offentliggøres ved tiltrædelse.",
      "team.joiningCountdown": "Tiltræder om",
      "team.days": "dage",
      "team.hours": "timer",
      "team.mins": "min.",
      "team.secs": "sek.",
      "team.joinedDate": "1. juni 2026",
      "team.joined": "Tiltrådt",
      "team.welcome": "Velkommen ombord.",
      "team.mathias.welcome": "Velkommen til Mathias Bruse Kristensen — kollega hos NOR Spedition.",

      "modal.pros": "Forcer",
      "modal.cons": "Svagheder",
      "modal.equipment": "Materieltyper vi arbejder med",
      "modal.equipmentHint": "Klik på en materieltype for detaljer og visualisering.",
      "modal.equipmentCta": "Se detaljer →",
      "modal.contactAbout": "Kontakt os om denne løsning",
      "modal.equipmentType": "Materieltype",
      "modal.specs": "Specifikationer",
      "modal.goodFor": "Velegnet til",
      "modal.notes": "Vær opmærksom på",
      "modal.back": "← Tilbage til transportform",

      "quote.label": "Tilbud",
      "quote.title": "Spørg <em>på pris.</em>",
      "quote.intro": "For at modtage et individuelt tilbud på transport, udfyld formularen herunder. På baggrund af oplysningerne vender vi tilbage med et forslag tilpasset godstype, rute og ønsket leveringsdato.",
      "quote.transport": "Transportform",
      "quote.cargo": "Gods",
      "quote.cargoLabel": "Beskriv godset",
      "quote.cargoPlaceholder": "Angiv gerne: antal kolli/paller, mål (L×B×H), vægt, evt. ønsket materieltype (fx lift, køl, kran) og særlige krav…",
      "quote.notes": "Yderligere oplysninger",
      "quote.notesLabel": "Beskriv gerne særlige krav eller deadlines",
      "quote.notesPlaceholder": "Fx temperaturstyret, farligt gods, kranløft ved levering…",
      "quote.pickup": "Afhentning & levering",
      "quote.loadingPlace": "Afhentning (postnr. + by)",
      "quote.loadingPlacePlaceholder": "fx 9850 Hirtshals",
      "quote.unloadingPlace": "Leveringssted (postnr. + by)",
      "quote.unloadingPlacePlaceholder": "fx 1657 København V",
      "quote.loadingDate": "Dato for afhentning",
      "quote.unloadingDate": "Dato for levering",
      "quote.contactInfo": "Kontaktoplysninger",
      "quote.name": "Navn",
      "quote.namePlaceholder": "Fornavn og efternavn",
      "quote.company": "Firma",
      "quote.companyPlaceholder": "Firmanavn",
      "quote.email": "E-mail",
      "quote.emailPlaceholder": "dig@firma.dk",
      "quote.phone": "Telefon",
      "quote.phonePlaceholder": "+45 12 34 56 78",
      "quote.road": "Landevej",
      "quote.roadSub": "Road · LTL/FTL/special",
      "quote.sea": "Sø",
      "quote.seaSub": "Sea · FCL/LCL/reefer",
      "quote.air": "Luft",
      "quote.airSub": "Air · general/priority/charter",
      "quote.rail": "Rail",
      "quote.railSub": "Intermodal/korridor",
      "quote.submit": "Send forespørgsel",
      "quote.cancel": "Annuller",
      "quote.foot": "Vi svarer typisk inden for få arbejdstimer. Forespørgslen sendes til",

      "form.sending": "Sender…",
      "form.success": "Tak! Din forespørgsel er sendt. Vi vender tilbage hurtigst muligt.",
      "form.error": "Kunne ikke sende via formular-tjeneste. Åbner din e-mail i stedet…",
      "form.mailto": "Åbner dit e-mailprogram med forudfyldt forespørgsel…",
      "form.subject": "Tilbudsforespørgsel",
      "form.dateNotSet": "dato ikke angivet",

      "footer.subtitle": "Vi hedder NOR Spedition, fordi vi er forankret i Nordjylland — og fordi vi arbejder med en Nordic Spirit: ordentlighed, struktur og aftaler der holder.",
      "footer.top": "Til toppen",
      "footer.transport": "Transportformer",
      "footer.admin": "Admin",
      "footer.contactLabel": "Kontakt",
      "footer.phone": "Telefon",
      "footer.email": "E-mail",

      "transportPage.kicker": "Ydelser",
      "transportPage.title": "Transportformer",
      "transportPage.lead": "Et overblik over de transportformer vi typisk hjælper med.",
      "transportPage.home": "Til forsiden",
      "transportPage.overviewLabel": "Oversigt",
      "transportPage.overviewTitle": "Vælg den rigtige løsning",
      "transportPage.overviewIntro": "Road, sea, air og rail — samt courier/express, når det haster. Skriv eller ring, så finder vi den bedste løsning.",
      "transportPage.road.desc": "Stykgods og fullload med løbende status og aftalt leveringsplan.",
      "transportPage.sea.desc": "Container og stykgods — planlagt, robust og omkostningsbevidst.",
      "transportPage.air.desc": "Når tiden er vigtig — hurtig afgang og klar forventningsafstemning.",
      "transportPage.rail.desc": "Et stærkt alternativ på udvalgte korridorer, når det giver mening.",
      "transportPage.road.title": "Landevej",
      "transportPage.sea.title": "Sø",
      "transportPage.air.title": "Luft",
      "transportPage.rail.title": "Rail",
      "transportPage.courier.title": "Kurer",
      "transportPage.express.title": "Express",
      "transportPage.courier.desc": "Direkte levering med tæt opfølgning og sporbarhed.",
      "transportPage.express.desc": "Når det haster — hurtig afgang og klar forventningsafstemning.",
      "quote.introShort": "Udfyld formularen — vi vender tilbage med et tilbud tilpasset godstype, rute og ønsket leveringsdato.",
      "quote.dimensions": "Mål (L×B×H)",
      "quote.dimensionsPlaceholder": "fx 120×80×100 cm",
      "quote.weight": "Vægt",
      "quote.weightPlaceholder": "fx 500 kg",
      "quote.notesCargoLabel": "Beskriv gerne godstypen, særlige krav eller deadlines",
      "quote.footShort": "Forespørgslen sendes til",

      "home.latestLabel": "Nyheder",
      "home.latestH2": "Seneste indlæg",
      "home.latestBody": "Her er et par eksempelindlæg (lorem ipsum), så I kan se opsætningen. Erstat dem med jeres egne nyheder eller cases.",
      "home.readMore": "Læs mere",

      "news.label": "Nyheder",
      "news.title": "Indlæg",
      "news.intro": "Eksempelindlæg (lorem ipsum) så layoutet kan ses.",

      "contact.label": "Kontakt",
      "contact.title": "Kontakt os",
      "contact.intro": "Ring eller skriv. Hvis du sender få oplysninger (hvad, hvorfra, hvortil og hvornår), så vender vi hurtigt tilbage.",
      "contact.phone": "Telefon",
      "contact.email": "E-mail",
      "contact.address": "Adresse",
    },
    en: {
      "meta.title": "NOR Spedition — Freight forwarding & logistics",
      "meta.description": "Freight forwarding and logistics with clear agreements and close follow-up — road, sea, air and rail.",
      "meta.title.transport": "NOR Spedition — Transport modes",
      "meta.description.transport": "An overview of NOR Spedition's transport modes.",
      "meta.title.contact": "NOR Spedition — Contact",
      "meta.description.contact": "Contact NOR Spedition.",
      "meta.title.news": "NOR Spedition — News",
      "meta.description.news": "News and updates from NOR Spedition.",

      "a11y.navMain": "Main navigation",
      "a11y.navOpen": "Open menu",
      "a11y.navClose": "Close menu",
      "a11y.langSwitch": "Language selection",
      "a11y.close": "Close",
      "a11y.footer": "Footer",

      "nav.transportModes": "Transport modes",
      "nav.team": "Team",
      "nav.contact": "Contact",
      "nav.products": "Products",
      "nav.niceToKnow": "Nice to know",
      "nav.convert": "Conversion",
      "nav.insurance": "Cargo insurance",
      "nav.customs": "Customs",
      "nav.incoterms": "Incoterms",
      "nav.road": "Road freight",
      "nav.sea": "Sea freight",
      "nav.air": "Air freight",
      "nav.rail": "Rail freight",
      "nav.news": "News",
      "nav.who": "About us",

      "hero.kicker": "Freight forwarding & logistics",
      "hero.title": "Agreements <em>that hold.</em>",
      "hero.lead": "Predictability, transparency and strong partnerships — across road, sea, air and rail.",
      "hero.contact": "Contact us",
      "hero.quote": "Request a quote",
      "hero.transport": "View transport modes",

      "keypoints.label": "Why NOR Spedition",
      "keypoints.title": "What you get when we move your cargo",
      "keypoints.overview.title": "Overview",
      "keypoints.overview.text": "A dedicated contact and clear agreements from booking to delivery.",
      "keypoints.tempo.title": "Pace",
      "keypoints.tempo.text": "Fast response and realistic ETAs — even when time is tight.",
      "keypoints.structure.title": "Structure",
      "keypoints.structure.text": "Documents and follow-up in one place, so nothing falls through the cracks.",
      "keypoints.network.title": "Network",
      "keypoints.network.text": "Strong partnerships — we find capacity, even on the difficult days.",

      "transport.label": "The four transport modes",
      "transport.title": "One of four — <em>always the same service.</em>",
      "transport.intro": "At its core there are four transport modes: road, sea, air and rail. We excel in all four through strong partnerships and a wide network — and help you choose right based on time, price and reliability. Click a card to see strengths, weaknesses and the equipment types we typically use.",
      "transport.hint": "Tap a card",
      "transport.road.badge": "01 · Road",
      "transport.road.title": "Road",
      "transport.road.desc": "Flexible distribution across Europe with high frequency and a clear plan.",
      "transport.road.cta": "See strengths, weaknesses & equipment →",
      "transport.sea.badge": "02 · Sea",
      "transport.sea.title": "Sea",
      "transport.sea.desc": "Robust and cost-effective for volume — FCL/LCL.",
      "transport.sea.cta": "See strengths, weaknesses & equipment →",
      "transport.air.badge": "03 · Air",
      "transport.air.title": "Air",
      "transport.air.desc": "When time is critical — planning, cut-offs and secure handovers.",
      "transport.air.cta": "See strengths, weaknesses & equipment →",
      "transport.rail.badge": "04 · Rail",
      "transport.rail.title": "Rail",
      "transport.rail.desc": "A strong alternative on selected corridors with stable capacity.",
      "transport.rail.cta": "See strengths, weaknesses & equipment →",

      "stats.modes": "Transport modes under one roof",
      "stats.offices": "Offices — Hirtshals & Copenhagen",
      "stats.traceability": "Traceability and clear agreements",
      "stats.contact": "Dedicated contact per customer",

      "team.label": "The people behind",
      "team.title": "The ones <em>you call.</em>",
      "team.intro": "At NOR Spedition you always work with a person — not a ticket system. Behind us are long-term partnerships, fixed agreements and a wide network of reliable partners, and that is what gives us real global reach.",
      "team.direct": "Direct",
      "team.email": "Email",
      "team.role.partner": "Partner & freight forwarder",
      "team.role.forwarder": "Freight forwarder",
      "team.joiningSoon": "Joining soon",
      "team.joiningNote": "We will soon welcome a new colleague. Details will be published upon joining.",
      "team.joiningCountdown": "Joining in",
      "team.days": "days",
      "team.hours": "hours",
      "team.mins": "min.",
      "team.secs": "sec.",
      "team.joinedDate": "1 June 2026",
      "team.joined": "Joined",
      "team.welcome": "Welcome aboard.",
      "team.mathias.welcome": "Welcome Mathias Bruse Kristensen — colleague at NOR Spedition.",

      "modal.pros": "Strengths",
      "modal.cons": "Weaknesses",
      "modal.equipment": "Equipment types we work with",
      "modal.equipmentHint": "Click an equipment type for details and visualisation.",
      "modal.equipmentCta": "See details →",
      "modal.contactAbout": "Contact us about this solution",
      "modal.equipmentType": "Equipment type",
      "modal.specs": "Specifications",
      "modal.goodFor": "Suitable for",
      "modal.notes": "Please note",
      "modal.back": "← Back to transport mode",

      "quote.label": "Quote",
      "quote.title": "Request <em>a quote.</em>",
      "quote.intro": "To receive an individual transport quote, fill in the form below. Based on your details we will get back to you with a proposal tailored to cargo type, route and desired delivery date.",
      "quote.transport": "Transport mode",
      "quote.cargo": "Cargo",
      "quote.cargoLabel": "Describe the cargo",
      "quote.cargoPlaceholder": "Please include: number of packages/pallets, dimensions (L×W×H), weight, desired equipment type (e.g. tail lift, reefer, crane) and special requirements…",
      "quote.notes": "Additional information",
      "quote.notesLabel": "Please describe any special requirements or deadlines",
      "quote.notesPlaceholder": "E.g. temperature controlled, dangerous goods, crane lift on delivery…",
      "quote.pickup": "Collection & delivery",
      "quote.loadingPlace": "Collection (postcode + city)",
      "quote.loadingPlacePlaceholder": "e.g. 9850 Hirtshals",
      "quote.unloadingPlace": "Delivery location (postcode + city)",
      "quote.unloadingPlacePlaceholder": "e.g. 1657 Copenhagen V",
      "quote.loadingDate": "Collection date",
      "quote.unloadingDate": "Delivery date",
      "quote.contactInfo": "Contact details",
      "quote.name": "Name",
      "quote.namePlaceholder": "First and last name",
      "quote.company": "Company",
      "quote.companyPlaceholder": "Company name",
      "quote.email": "Email",
      "quote.emailPlaceholder": "you@company.com",
      "quote.phone": "Phone",
      "quote.phonePlaceholder": "+45 12 34 56 78",
      "quote.road": "Road",
      "quote.roadSub": "Road · LTL/FTL/special",
      "quote.sea": "Sea",
      "quote.seaSub": "Sea · FCL/LCL/reefer",
      "quote.air": "Air",
      "quote.airSub": "Air · general/priority/charter",
      "quote.rail": "Rail",
      "quote.railSub": "Intermodal/corridor",
      "quote.submit": "Send enquiry",
      "quote.cancel": "Cancel",
      "quote.foot": "We typically respond within a few business hours. The enquiry is sent to",

      "form.sending": "Sending…",
      "form.success": "Thank you! Your enquiry has been sent. We will get back to you as soon as possible.",
      "form.error": "Could not send via form service. Opening your email instead…",
      "form.mailto": "Opening your email client with a pre-filled enquiry…",
      "form.subject": "Quote enquiry",
      "form.dateNotSet": "date not specified",

      "footer.subtitle": "We are called NOR Spedition because we are rooted in North Jutland — and because we work with a Nordic Spirit: integrity, structure and agreements that hold.",
      "footer.top": "Back to top",
      "footer.transport": "Transport modes",
      "footer.admin": "Admin",
      "footer.contactLabel": "Contact",
      "footer.phone": "Phone",
      "footer.email": "Email",

      "transportPage.kicker": "Services",
      "transportPage.title": "Transport modes",
      "transportPage.lead": "An overview of the transport modes we typically help with.",
      "transportPage.home": "Back to homepage",
      "transportPage.overviewLabel": "Overview",
      "transportPage.overviewTitle": "Choose the right solution",
      "transportPage.overviewIntro": "Road, sea, air and rail — plus courier/express when time is tight. Write or call and we will find the best solution.",
      "transportPage.road.desc": "Part loads and full loads with ongoing status and agreed delivery plan.",
      "transportPage.sea.desc": "Container and breakbulk — planned, robust and cost-conscious.",
      "transportPage.air.desc": "When time matters — fast departure and clear expectation setting.",
      "transportPage.rail.desc": "A strong alternative on selected corridors when it makes sense.",
      "transportPage.road.title": "Road",
      "transportPage.sea.title": "Sea",
      "transportPage.air.title": "Air",
      "transportPage.rail.title": "Rail",
      "transportPage.courier.title": "Courier",
      "transportPage.express.title": "Express",
      "transportPage.courier.desc": "Direct delivery with close follow-up and traceability.",
      "transportPage.express.desc": "When it is urgent — fast departure and clear expectation setting.",
      "quote.introShort": "Fill in the form — we will get back to you with a quote tailored to cargo type, route and desired delivery date.",
      "quote.dimensions": "Dimensions (L×W×H)",
      "quote.dimensionsPlaceholder": "e.g. 120×80×100 cm",
      "quote.weight": "Weight",
      "quote.weightPlaceholder": "e.g. 500 kg",
      "quote.notesCargoLabel": "Please describe cargo type, special requirements or deadlines",
      "quote.footShort": "The enquiry is sent to",

      "home.latestLabel": "News",
      "home.latestH2": "Latest posts",
      "home.latestBody": "Here are a few sample posts (lorem ipsum) so you can see the layout. Replace them with your own news or case studies.",
      "home.readMore": "Read more",

      "news.label": "News",
      "news.title": "Posts",
      "news.intro": "Sample posts (lorem ipsum) to preview the layout.",

      "contact.label": "Contact",
      "contact.title": "Contact us",
      "contact.intro": "Call or write. If you send a few details (what, from where, to where and when), we will get back to you quickly.",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.address": "Address",
    },
  };

  const PAGE_META = {
    "index.html": { title: "meta.title", description: "meta.description" },
    "": { title: "meta.title", description: "meta.description" },
    "transportformer.html": { title: "meta.title.transport", description: "meta.description.transport" },
    "contact.html": { title: "meta.title.contact", description: "meta.description.contact" },
    "news.html": { title: "meta.title.news", description: "meta.description.news" },
    "home.html": { title: "meta.title", description: "meta.description" },
  };

  let currentLang = "da";

  function resolveKey(key) {
    const table = STRINGS[currentLang] || STRINGS.da;
    return table[key] ?? STRINGS.da[key] ?? key;
  }

  function detectPageMeta() {
    const path = window.location.pathname.split("/").pop() || "";
    return PAGE_META[path] || PAGE_META[""];
  }

  function applyMeta() {
    const meta = detectPageMeta();
    if (meta.title) document.title = resolveKey(meta.title);
    const desc = document.querySelector('meta[name="description"]');
    if (desc && meta.description) desc.setAttribute("content", resolveKey(meta.description));
  }

  function applyDom() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = resolveKey(key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = resolveKey(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", resolveKey(key));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      el.setAttribute("aria-label", resolveKey(key));
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const lang = btn.getAttribute("data-lang");
      btn.setAttribute("aria-pressed", String(lang === currentLang));
    });

    const navBtn = document.querySelector(".nav-toggle");
    if (navBtn) {
      const open = navBtn.getAttribute("aria-expanded") === "true";
      navBtn.setAttribute("aria-label", resolveKey(open ? "a11y.navClose" : "a11y.navOpen"));
    }

    applyMeta();
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    applyDom();
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  function init() {
    // Danish is always the default; English only when the user has chosen it before.
    currentLang = "da";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en") currentLang = "en";
    } catch {
      // ignore
    }

    applyDom();

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang) setLang(lang);
      });
    });
  }

  window.I18n = {
    init,
    setLang,
    getLang: () => currentLang,
    t: resolveKey,
    apply: applyDom,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
