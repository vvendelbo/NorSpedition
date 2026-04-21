(() => {
  // ===================================================================
  // Image overrides via admin portal (localStorage)
  // ===================================================================
  const IMG_STORAGE_KEY = "nor-spedition.image-overrides.v1";
  function loadImageOverrides() {
    try {
      return JSON.parse(localStorage.getItem(IMG_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }
  function applyImageOverrides() {
    const overrides = loadImageOverrides();
    if (!overrides || typeof overrides !== "object") return;
    document.querySelectorAll("img[data-img-key]").forEach((el) => {
      const key = el.getAttribute("data-img-key");
      if (key && overrides[key]) {
        if (el instanceof HTMLImageElement) el.src = overrides[key];
      }
    });
  }
  applyImageOverrides();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===================================================================
  // Mobile nav toggle + dropdown close
  // ===================================================================
  const navBtn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  const navDropdown = document.querySelector(".nav-dropdown");

  if (navBtn && nav) {
    navBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navBtn.setAttribute("aria-expanded", String(open));
      navBtn.setAttribute("aria-label", open ? "Luk menu" : "Åbn menu");
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
  const transportContent = {
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
        {
          id: "road-curtain",
          name: "Trækker + 13,6 m curtain-trailer",
          specs: "24.000 kg · 33 EUR-paller · lift/ADR",
          lead: "Europas arbejdshest — åben/lukket presenning, læsbar fra side og bag.",
          details: [
            ["Indv. mål", "13,60 × 2,47 × 3,10 m"],
            ["Læssevægt", "op til 24.000 kg"],
            ["Paller", "33 EUR-paller (1 lag)"],
            ["Ekstra", "Lift, ADR, coil-well kan aftales"],
          ],
          goodFor: ["Stykgods og fuld last (LTL/FTL)", "Paller, kasser, ruller og lange emner", "Sidelæsning med truck eller kran"],
          notes: ["Højdebegrænsning ved bro-/tunnelpassager på visse ruter", "Ikke temperaturstyret"],
        },
        {
          id: "road-solo18",
          name: "Solobil 18 t",
          specs: "7.000 kg · 23 EUR-paller · lift/ADR",
          lead: "Kompakt enhedsvogn til by- og mellemdistancer uden trailer-kobling.",
          details: [
            ["Indv. mål", "9,40 × 2,45 × 2,90 m"],
            ["Læssevægt", "ca. 7.000 kg"],
            ["Paller", "23 EUR-paller"],
            ["Ekstra", "Lift, ADR"],
          ],
          goodFor: ["Leverancer i bymidter med pladsbegrænsning", "Distribution med flere stop", "Når der er behov for lift"],
          notes: ["Lavere nyttelast end semitrailer", "Kan kræve miljøzone-godkendelse i visse byer"],
        },
        {
          id: "road-solo75",
          name: "Solobil 7,5 t",
          specs: "3.500 kg · 15 EUR-paller · lift/ADR",
          lead: "Let distributionsbil — nem at manøvrere og oftest uden særlige certifikater.",
          details: [
            ["Indv. mål", "6,20 × 2,45 × 2,60 m"],
            ["Læssevægt", "ca. 3.500 kg"],
            ["Paller", "15 EUR-paller"],
            ["Ekstra", "Lift, ADR"],
          ],
          goodFor: ["Hurtig bydistribution", "Små til mellem forsendelser", "Trange gader og afhentningssteder"],
          notes: ["Ikke ideel til lange eller høje emner"],
        },
        {
          id: "road-van",
          name: "Varebil 3,5 t",
          specs: "700–1.200 kg · 5–10 EUR-paller · lift/ADR",
          lead: "Smidig og hurtig — velegnet til ekspres og mindre forsendelser.",
          details: [
            ["Typer", "Firanka 4,2–4,9 m · Box 3,85–4,70 m"],
            ["Højde", "2,00–2,60 m indvendig"],
            ["Læssevægt", "700–1.200 kg"],
            ["Paller", "5–10 EUR-paller"],
          ],
          goodFor: ["Ekspres- og samme-dags kørsel", "Tidskritiske pharma- og reservedelsforsendelser", "Dedikeret direkte kørsel"],
          notes: ["Begrænset kapacitet pr. enhed"],
        },
        {
          id: "road-reefer",
          name: "Køl-/frysetrailer",
          specs: "22.000 kg · 13,6 × 2,45 × 2,65 m · temp.styret · ADR",
          lead: "Temperaturstyret transport — fra dyb frost til pharma-vinduer.",
          details: [
            ["Indv. mål", "13,60 × 2,45 × 2,65 m"],
            ["Temperatur", "−25 °C til +25 °C"],
            ["Agregat", "Dieselagregat med monitorering"],
            ["Standarder", "ATP, FRC/FNA efter gods"],
          ],
          goodFor: ["Fødevarer, medicin, blomster", "Temperatur-kritiske forsendelser", "Multi-temp-opdelinger efter aftale"],
          notes: ["Højere drifts- og brændstofomkostninger", "Kræver ren kølekæde og dokumentation"],
        },
        {
          id: "road-platform",
          name: "Platform / flak",
          specs: "24.000 kg · 13,6 m · til stål, kontainere og byggemateriale",
          lead: "Åben platform — læs fra alle sider og ovenfra med kran eller truck.",
          details: [
            ["Længde", "13,60 m (standard)"],
            ["Læssevægt", "op til 24.000 kg"],
            ["Udstyr", "Pasning af stål-coils, pæle, pulver"],
            ["Sikring", "Stropper, kæder, spæntræ"],
          ],
          goodFor: ["Stål, rør, kontainere, byggemateriale", "Kran- eller sideløftning", "Overbrede emner med pilotbil"],
          notes: ["Ingen beskyttelse mod vejr — afhængig af emballage"],
        },
        {
          id: "road-tiefbett",
          name: "Tiefbett / lowbed",
          specs: "38.000 kg · niedrig bed · til høje maskiner og industrielementer",
          lead: "Sænket lad til ekstra højde — bygget til maskiner og industrielementer.",
          details: [
            ["Læssevægt", "op til 38.000 kg"],
            ["Nicke-højde", "ca. 0,85 m over vej"],
            ["Udvidelse", "Afkoblelig front, udskud til bredde"],
            ["Eskorte", "Pilotbil ved over-mål"],
          ],
          goodFor: ["Høje maskiner, tanke, industrielementer", "Ekstrem tung last", "Projekt- og anlægstransport"],
          notes: ["Tilladelser og ruteplanlægning er afgørende", "Tidsvinduer kan være restriktive"],
        },
        {
          id: "road-semi",
          name: "Semi-lowloader",
          specs: "28.000 kg · hydrauliske ramper · til gravemaskiner og tungt grej",
          lead: "Lavbed med hydraulisk indkøring — på og af på få minutter.",
          details: [
            ["Læssevægt", "op til 28.000 kg"],
            ["Ramper", "Hydrauliske med wirespil"],
            ["Udstyr", "Spæntræ, surringspunkter"],
            ["Eskorte", "Efter emnets mål"],
          ],
          goodFor: ["Gravemaskiner, entreprenørmateriel", "Bil- og maskintransport på hjul", "Relokering af tungt grej"],
          notes: ["Visse ruter kan kræve forhåndsgodkendelse"],
        },
        {
          id: "road-tele",
          name: "Tele / udtrækstrailer",
          specs: "22.000 kg · forlænges op til 21 m · til lange elementer",
          lead: "Udtrækstrailer til lange emner — skinner, mastesektioner, rotorblade.",
          details: [
            ["Længde", "Fra 13,6 m op til 21 m"],
            ["Læssevægt", "op til 22.000 kg"],
            ["Udstyr", "Oftest styreaksel til manøvrering"],
            ["Eskorte", "Pilotbil og sikkerhedskøretøj"],
          ],
          goodFor: ["Vindmøllevinger, master, skinner", "Lange præfabrikerede elementer", "Projektgods"],
          notes: ["Stor svingradius — krav til vejnet"],
        },
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
      equipmentIntro: "Vi booker og koordinerer alle gængse containertyper — og finder specialudstyr til det der ikke passer i en standard.",
      equipment: [
        {
          id: "sea-dry20",
          name: "20' Dry container",
          specs: "Indv. ca. 5,9 × 2,35 × 2,39 m · ~28 t · tørlast",
          lead: "Standard 20-fods container — arbejdshesten i FCL-verdenen.",
          details: [
            ["Indv. mål", "5,90 × 2,35 × 2,39 m"],
            ["Dør-åbning", "2,34 × 2,28 m"],
            ["Maks. last", "~28.000 kg (rute-afhængigt)"],
            ["Volumen", "~33 m³"],
          ],
          goodFor: ["Tungt, tæt stuvet gods", "Fuld container-last (FCL)", "Tørlast uden klimakrav"],
          notes: ["Lavere rumfang end 40'", "Ikke egnet til overhøjt gods"],
        },
        {
          id: "sea-dry40",
          name: "40' Dry container",
          specs: "Indv. ca. 12,03 × 2,35 × 2,39 m · ~28 t · tørlast",
          lead: "Dobbelt længden — optimal når volumen betyder mere end vægt.",
          details: [
            ["Indv. mål", "12,03 × 2,35 × 2,39 m"],
            ["Dør-åbning", "2,34 × 2,28 m"],
            ["Maks. last", "~28.000 kg"],
            ["Volumen", "~67 m³"],
          ],
          goodFor: ["Volumetunge laster", "Møbler, tekstil, non-food", "Fuld container-last (FCL)"],
          notes: ["Højde samme som 20' dry — ikke til overhøjt"],
        },
        {
          id: "sea-hc",
          name: "40' High cube (HC)",
          specs: "Ekstra højde 2,69 m indv. · til volumetungt gods",
          lead: "Samme bredde og længde som 40' dry, men ekstra højde til volumen.",
          details: [
            ["Indv. højde", "2,69 m (vs. 2,39 m på standard)"],
            ["Indv. længde/bredde", "12,03 × 2,35 m"],
            ["Maks. last", "~28.000 kg"],
            ["Volumen", "~76 m³"],
          ],
          goodFor: ["Letvægts- og volumetunge laster", "Høje emner op til 2,69 m", "Møbler, skum, isolering"],
          notes: ["Højdekrav på land-transport til/fra havn"],
        },
        {
          id: "sea-reefer",
          name: "Reefer 20'/40'",
          specs: "Temp.styret −30 °C til +30 °C · pharma, food, perishables",
          lead: "Temperaturstyret container — fra dyb frost til pharma-vinduer.",
          details: [
            ["Temperatur", "−30 °C til +30 °C"],
            ["Indv. mål 40' HC reefer", "11,56 × 2,29 × 2,56 m"],
            ["Strøm", "Ombord eller plug-in i havn"],
            ["Monitorering", "Datalogger og alarm"],
          ],
          goodFor: ["Frugt, grønt, fisk, kød", "Pharma og life science", "Temperatur-kritisk kemi"],
          notes: ["Plug-in-tid i havn skal bookes", "Kræver ren kølekæde"],
        },
        {
          id: "sea-opentop",
          name: "Open top",
          specs: "Åben top m/presenning · til overhøje emner og ovenfra-læsning",
          lead: "Container uden tag — læs fra oven med kran, sejl på som tag.",
          details: [
            ["Indv. mål 40'", "12,03 × 2,35 × 2,35 m"],
            ["Top", "Presenning-system med bøjler"],
            ["Maks. last", "~28.000 kg"],
            ["Ekstra højde", "Overhøjt kan aftales"],
          ],
          goodFor: ["Maskiner og emner med overhøjde", "Kranløft direkte i container", "Emner der ikke kan læsses fra døren"],
          notes: ["Vejr-udsathed uden hård top", "Kan kræve over-mål-godkendelse"],
        },
        {
          id: "sea-flatrack",
          name: "Flat rack",
          specs: "Uden sider/tag · til overbredt gods, maskiner og stål",
          lead: "Platform med gavlender — sider foldes ned, så ingen dimensions-grænse udover vægt.",
          details: [
            ["Standardlængder", "20' og 40'"],
            ["Maks. last", "op til 40.000 kg (40')"],
            ["Surring", "Stropper, kæder i platformen"],
            ["Gavlender", "Foldes ned for overlængde"],
          ],
          goodFor: ["Overbredde og overlange emner", "Bilfragt, maskiner, rør, stål", "Kranløft i/af havn"],
          notes: ["Ingen vejrbeskyttelse", "Surring er kritisk"],
        },
        {
          id: "sea-platform",
          name: "Platform",
          specs: "Fladt dæk uden ender · til særligt lange eller tunge emner",
          lead: "Helt fladt dæk uden sider og gavlender — kun til emner der ikke passer andre steder.",
          details: [
            ["Længder", "20' og 40'"],
            ["Maks. last", "Op til 40.000 kg"],
            ["Form", "Fladt — ingen gavle, ingen sider"],
            ["Surring", "Alle kanter"],
          ],
          goodFor: ["Ekstremt tunge/lange emner", "Industrielle komponenter", "Projekt- og anlægstransport"],
          notes: ["Bookes som over-dimensions (OOG)", "Kræver samme-høj stuvning i skib"],
        },
        {
          id: "sea-goh",
          name: "GOH (Garments on Hangers)",
          specs: "Integreret bøjlesystem · til konfektion uden ompakning",
          lead: "40' container med indbygget bøjle-system — tøj hænger færdigt fra fabrik til butik.",
          details: [
            ["Kapacitet", "op til 10.000–14.000 plagg"],
            ["System", "Faste/mobile stænger langs loftet"],
            ["Sikring", "Særlige bøjler og presenninger"],
            ["Basis", "40' dry eller HC"],
          ],
          goodFor: ["Fashion og konfektion", "High-end brands uden ompakning", "Direkte butiksleverance"],
          notes: ["Højere fragtpris pr. kg end standard", "Kun enkelte operatører tilbyder GOH"],
        },
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
        {
          id: "air-general",
          name: "General cargo",
          specs: "Stykgods på ULD-paller/containere · standard luftfragt",
          lead: "Grundlæggende luftfragt på rutefly — booket på faste afgange.",
          details: [
            ["Afgange", "Rutefly, dagligt på major hubs"],
            ["Transit", "Typisk 1–3 dage"],
            ["Booking", "Allocation eller spot"],
            ["Dokumenter", "Master/House AWB"],
          ],
          goodFor: ["Standard luftfragt", "Mellem-værdigt gods", "Ikke-tidskritiske hasteforsendelser"],
          notes: ["Cut-off typisk 4–8 timer før departure", "Screening kræves"],
        },
        {
          id: "air-priority",
          name: "Priority / Express",
          specs: "Øverste prioritet · hurtigste cut-off og første fly ud",
          lead: "Øverste prioritets-klasse — første om bord og første af.",
          details: [
            ["Prioritet", "Øverste serviceklasse"],
            ["Transit", "Typisk 24–48 timer"],
            ["Booking", "Garanteret space"],
            ["Tracking", "Milestones pr. handover"],
          ],
          goodFor: ["Kritiske reservedele", "Tidssensitiv pharma", "Højværdige hasteleverancer"],
          notes: ["Markant dyrere end general cargo", "Kræver klart cut-off-vindue"],
        },
        {
          id: "air-temp",
          name: "Temperature controlled",
          specs: "CRT/CFT-løsninger · pharma og perishables",
          lead: "Temperaturkontrolleret luftfragt — passive og aktive løsninger.",
          details: [
            ["Temperaturbånd", "+2/+8 °C · +15/+25 °C · CRT"],
            ["Udstyr", "Envirotainer, CSafe, thermocover"],
            ["Monitorering", "Datalogger, realtid via sensor"],
            ["Standarder", "GDP, IATA CEIV Pharma"],
          ],
          goodFor: ["Pharma og kliniske forsøg", "Food og perishables (blomster, fisk)", "Vaccine og biotek"],
          notes: ["Kræver certificeret håndtering end-to-end", "Booking tidligt for airside-ressourcer"],
        },
        {
          id: "air-dg",
          name: "Dangerous goods (DG)",
          specs: "IATA-certificeret håndtering · klasse 1–9 efter aftale",
          lead: "Farligt gods efter IATA DGR — korrekt klassificering er afgørende.",
          details: [
            ["Klasser", "1–9 (iht. IATA DGR)"],
            ["Dokumenter", "Shipper’s Declaration + MSDS"],
            ["Emballage", "UN-certificeret efter klasse/PG"],
            ["Restriktioner", "Pax/Cargo only varierer pr. stof"],
          ],
          goodFor: ["Kemi, lithium-batterier, aerosol", "Medicin-udstyr med fluid/li-ion", "Olie- og gas-reservedele"],
          notes: ["Fejl i klassificering stopper forsendelsen", "Ikke alle carriers accepterer alle klasser"],
        },
        {
          id: "air-charter",
          name: "Charter",
          specs: "Fuld maskine eller partial · projektlaster og hasteforsendelser",
          lead: "Fuld eller delvis charter — når rutefly ikke er nok.",
          details: [
            ["Typer", "Partial, Full, ACMI"],
            ["Flytyper", "Narrow-body til AN-124 (out-of-gauge)"],
            ["Rute", "Dør-til-dør efter behov"],
            ["Lead time", "Fra få timer ved AOG"],
          ],
          goodFor: ["AOG og nødsituationer", "Projekt-tungt/overhøjt gods", "Fuldladninger med én afsender"],
          notes: ["Omkostningstungt — kun for kritiske behov", "Luftrum/landingstilladelser skal koordineres"],
        },
        {
          id: "air-uld",
          name: "ULD-typer",
          specs: "PMC / PAG / AKE · tilpasses gods og flytype",
          lead: "Unit Load Device — container eller palle der passer direkte i flyet.",
          details: [
            ["PMC", "96×125\" pallet (main deck)"],
            ["PAG", "88×125\" pallet (main deck)"],
            ["AKE", "LD3 container (lower deck)"],
            ["AKN/AKH", "Øvrige standard lower-deck"],
          ],
          goodFor: ["Maksimal nyttelast pr. booking", "Mere effektiv stuvning", "Færre handling-risici pr. enhed"],
          notes: ["Gods skal passe indenfor ULD-dimensioner", "Kræver palletering og netting"],
        },
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
        {
          id: "rail-intermodal",
          name: "40'/45' container intermodal",
          specs: "Standard container på togvogn · kombineret med last-mile truck",
          lead: "Container på tog — samme container fra fabrik til modtager med pre- og on-carriage på lastbil.",
          details: [
            ["Typer", "40' dry, HC, 45' pallet-wide"],
            ["Afgange", "Faste på EU-korridorer"],
            ["Transit", "2–7 dage afhængigt af rute"],
            ["Handover", "På multimodal terminal"],
          ],
          goodFor: ["Mellem-lange distancer i Europa", "CO₂-optimerede flow", "Stabil kapacitet uden chaufførafhængighed"],
          notes: ["Pre-/on-carriage på lastbil lægges på transit", "Terminal-tider påvirker dør-til-dør-plan"],
        },
        {
          id: "rail-20ft",
          name: "20' container intermodal",
          specs: "Til tunge eller densitetskrævende laster",
          lead: "20-fods på tog — perfekt til tunge laster hvor max-vægt er vigtigst.",
          details: [
            ["Læssevægt", "op til ~28.000 kg"],
            ["Volumen", "~33 m³"],
            ["Afgange", "På udvalgte korridorer"],
            ["Handover", "Multimodal terminal"],
          ],
          goodFor: ["Tung industriel last", "Stål, papir, maskinkomponenter", "Korte/mellemlange afstande"],
          notes: ["Mindre volumen end 40'", "Pre-/on-carriage nødvendig"],
        },
        {
          id: "rail-block",
          name: "Block train",
          specs: "Dedikeret fuldtog på fast korridor · høj volumen og faste afgange",
          lead: "Hele toget går samme vej — faste tider og maksimal kapacitet.",
          details: [
            ["Kapacitet", "~80–90 TEU pr. tog"],
            ["Afgange", "Faste ugentlige slots"],
            ["Operatør", "Fast ift. lokomotiv og vogne"],
            ["Handover", "Fast terminal i hver ende"],
          ],
          goodFor: ["Faste produktions- og eksportflow", "Store volumen-kunder", "Automotive, kemi og papir"],
          notes: ["Kræver volumen-aftaler", "Low spot-flexibilitet"],
        },
        {
          id: "rail-swap",
          name: "Swap body / trailer-on-train",
          specs: "Trailer eller skifteladvogn · nem overlevering til truck",
          lead: "Trailer eller skiftelad direkte på togvogn — minimerer håndtering.",
          details: [
            ["Typer", "P400 trailer, C745 swap body"],
            ["Afgange", "På kombi-korridorer"],
            ["Transit", "Sammenlignelig med road"],
            ["Handover", "Kombi-terminal"],
          ],
          goodFor: ["Når trailer skal fortsætte direkte på vej", "Kombi-terminal-til-kombi-terminal", "CO₂-reduktion på lange strækninger"],
          notes: ["Trailer skal være P400-godkendt", "Kombi-terminal-kapacitet styrer plan"],
        },
        {
          id: "rail-reefer",
          name: "Reefer rail",
          specs: "Temperaturstyret via gen-set · food og pharma på udvalgte ruter",
          lead: "Reefer-container på tog med gen-set — kølekæde uden opbrud.",
          details: [
            ["Temperatur", "−25 °C til +25 °C"],
            ["Strøm", "Gen-set eller on-board-power"],
            ["Monitorering", "Remote-logger"],
            ["Ruter", "Begrænset til udvalgte korridorer"],
          ],
          goodFor: ["Fødevarer på lange afstande", "Pharma på udvalgte ruter", "CO₂-optimeret kølekæde"],
          notes: ["Ikke på alle korridorer", "Gen-set-fuel skal håndteres"],
        },
        {
          id: "rail-special",
          name: "Specialvogne",
          specs: "Flat wagon, bogie wagon, heavy-duty · til overbredt og tungt gods",
          lead: "Åbne og specialdesignede togvogne til det helt ekstreme.",
          details: [
            ["Typer", "Flat, bogie, heavy-haul"],
            ["Læssevægt", "op til ~90.000 kg"],
            ["Profil", "OOG kan aftales"],
            ["Eskorte", "Inspektion ved af-/pålæsning"],
          ],
          goodFor: ["Tunge industrielementer", "Skinnetransport, vindmøllevinger", "Store præfab-emner"],
          notes: ["Lange lead times", "Kræver ruteplanlægning og tilladelser"],
        },
      ],
    },
  };

  // Flatten equipment lookup: id -> item + parent transport meta
  const equipmentById = new Map();
  for (const [key, trans] of Object.entries(transportContent)) {
    for (const eq of trans.equipment) {
      equipmentById.set(eq.id, { ...eq, _transportKey: key, _transportTitle: trans.title });
    }
  }

  // ===================================================================
  // Transport modal
  // ===================================================================
  const transportDialog = document.getElementById("transport-modal");
  const equipmentDialog = document.getElementById("equipment-modal");
  const quoteDialog = document.getElementById("quote-modal");
  let lastTransportKey = null;

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
        cta.textContent = "Se detaljer →";
        btn.append(name, specs, cta);
        el.appendChild(btn);
      }
    }

    function openTransport(key) {
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
      transportDialog.showModal();
      dismissHints();
      const inner = transportDialog.querySelector(".modal-inner");
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

    function openEquipment(id) {
      const data = equipmentById.get(id);
      if (!data) return;
      const imgKey = `equipment-${data.id}`;
      if (imageEl instanceof HTMLImageElement) {
        imageEl.setAttribute("data-img-key", imgKey);
        const overrides = loadImageOverrides();
        imageEl.src = overrides[imgKey] || "assets/card-placeholder.svg";
        imageEl.alt = data.name;
      }
      if (captionEl) captionEl.textContent = `${data._transportTitle} · ${data.name}`;
      if (kickerEl) kickerEl.textContent = `${data._transportTitle} · Materieltype`;
      if (titleEl) titleEl.textContent = data.name;
      if (leadEl) leadEl.textContent = data.lead || "";
      setSpecs(specsEl, data.details || []);
      setList(goodEl, data.goodFor || []);
      setList(notesEl, data.notes || []);
      if (transportDialog && transportDialog.open) transportDialog.close();
      equipmentDialog.showModal();
      const inner = equipmentDialog.querySelector(".modal-inner");
      if (inner instanceof HTMLElement) inner.scrollTop = 0;
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

        // Read endpoint from data-endpoint (configured from admin.html or manually)
        const endpoint = form.getAttribute("data-endpoint") ||
          localStorage.getItem("nor-spedition.form-endpoint") || "";

        // If an endpoint is configured, POST to it (Formspree/Basin/Getform/Netlify etc.)
        if (endpoint) {
          try {
            setStatus("Sender…", "pending");
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Accept": "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({
                _subject: `Tilbudsforespørgsel — ${payload.transport || "NOR Spedition"}`,
                ...payload,
              }),
            });
            if (!res.ok) throw new Error(String(res.status));
            setStatus("Tak! Din forespørgsel er sendt. Vi vender tilbage hurtigst muligt.", "success");
            form.reset();
            return;
          } catch (err) {
            setStatus("Kunne ikke sende via formular-tjeneste. Åbner din e-mail i stedet…", "warn");
          }
        }

        // Fallback: mailto: with pre-filled body
        const subject = `Tilbudsforespørgsel — ${payload.transport || "NOR Spedition"}`;
        const body = [
          `Navn: ${payload.name || ""}`,
          `Firma: ${payload.company || ""}`,
          `E-mail: ${payload.email || ""}`,
          `Telefon: ${payload.phone || ""}`,
          "",
          `Transportform: ${payload.transport || ""}`,
          "",
          "— Gods —",
          `Mål: ${payload.dimensions || ""}`,
          `Vægt: ${payload.weight || ""}`,
          "",
          "— Afhentning & levering —",
          `Afhentning: ${payload.loadingPlace || ""}  (${payload.loadingDate || "dato ikke angivet"})`,
          `Levering:   ${payload.unloadingPlace || ""}  (${payload.unloadingDate || "dato ikke angivet"})`,
          "",
          "— Yderligere oplysninger —",
          `${payload.notes || ""}`,
        ].join("\n");
        const mailto = `mailto:contact@norspedition.dk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus("Åbner dit e-mailprogram med forudfyldt forespørgsel…", "success");
        window.location.href = mailto;
      });
    }
  }
})();
