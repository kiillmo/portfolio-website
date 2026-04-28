const PATHS = {
  annual: "data/processed/annual_collocation_tone_by_source.csv",
  decades: "data/processed/nyt_decade_collocations.csv",
  dcGeo: "data/processed/dc_tract_density.min.geojson",
  nycGeo: "data/processed/nyc_tract_density.min.geojson",
  splat: "assets/splat/cher-ami.ksplat"
};

const FRAME_CONFIG = [
  { key: "heroic", label: "Heroic / utility", column: "heroic_rate", color: "--hero" },
  { key: "sport", label: "Sport / hobby", column: "sport_rate", color: "--sport" },
  { key: "culinary", label: "Culinary", column: "culinary_rate", color: "--culinary" },
  { key: "hunting", label: "Hunting", column: "hunting_rate", color: "--hunting" },
  { key: "nuisance", label: "Nuisance / disease", column: "nuisance_rate", color: "--nuisance" }
];

const FRAME_TERMS = {
  heroic: [
    "hero", "heroic", "heroism", "valiant", "gallant", "brave", "bravery", "loyal",
    "faithful", "decorated", "medal", "medaled", "honored", "saved", "rescued",
    "rescue", "carrier", "messenger", "message", "dispatch", "homing", "military",
    "army", "navy", "wartime", "service", "duty", "war", "feat", "record"
  ],
  nuisance: [
    "menace", "nuisance", "pest", "vermin", "infestation", "infest", "filthy",
    "filth", "dirty", "dirt", "diseased", "disease", "germ", "plague", "unsanitary",
    "contaminated", "droppings", "waste", "mess", "soiled", "exterminate",
    "eliminate", "cull", "poison", "control", "hazard", "problem", "swarm",
    "rat", "population", "invasion", "overrun"
  ],
  culinary: [
    "squab", "pie", "roasted", "roast", "cooked", "baked", "recipe", "dish",
    "stew", "broiled", "grilled", "delicacy", "feast", "dinner", "supper",
    "poultry", "egg", "farm", "farmer"
  ],
  sport: [
    "racing", "race", "racer", "fancier", "loft", "club", "flight", "show",
    "champion", "prize", "trained", "training", "breeder", "breeding", "raising"
  ],
  hunting: [
    "shoot", "shooting", "shot", "hunt", "hunter", "hunting", "kill", "killed",
    "killing", "gun", "rifle", "trap", "passenger", "extinct", "extinction"
  ]
};

const TERM_FRAME = new Map(
  Object.entries(FRAME_TERMS).flatMap(([frame, terms]) => terms.map((term) => [term, frame]))
);

// Manual Cher Ami splat tuning.
// Increase sceneScale or move pose position z values lower to zoom in.
// Change pose lookAt values to center the bird within the bounding sphere.
const CHER_AMI_CAMERA = {
  fov: 60,
  near: 0.1,
  far: 500,
  alphaRemovalThreshold: 5,
  scenePosition: [0, 0, 0],
  sceneRotation: [1, 0, 0, 0],
  sceneScale: [0.2, 0.2, 0.2],
  poses: [
    { position: [0.425, -0.535, -0.340], lookAt: [0.175, -0.585, -0.840] },
    { position: [0.275, -0.585, -0.500], lookAt: [0.175, -0.585, -0.840] },
    { position: [0.175, -0.585, -0.640], lookAt: [0.175, -0.585, -0.840] },
    { position: [0.175, -0.635, -0.600], lookAt: [0.175, -0.735, -0.940] },
    { position: [0.575, -0.485, -0.240], lookAt: [0.175, -0.650, -0.840] },
    { position: [-0.130, -0.255, 0.810], lookAt: [0.175, -0.585, -0.840] }
  ]
};

const ACT3_STEPS = [
  {
    frames: ["heroic"],
    decade: "1910-1919",
    termFrames: ["heroic"],
    annotations: [{ year: 1918, text: "Cher Ami era", frame: "heroic" }],
    clips: [
      {
        src: "assets/newspaper-clippings/wounded-hero-birds-1919.png",
        alt: "Newspaper clipping about wounded hero birds from 1919",
        position: "100% -15%",
        scale: 1.5
      }
    ]
  },
  {
    frames: ["heroic"],
    decade: "1940-1949",
    termFrames: ["heroic"],
    annotations: [
      { year: 1918, text: "WWI", frame: "heroic" },
      { year: 1943, text: "WWII peak", frame: "heroic" }
    ],
    clips: [
      {
        src: "assets/newspaper-clippings/war-pigeon-hero-1937.jpg",
        alt: "Newspaper clipping about a war pigeon hero from 1937",
        position: "50% 0%"
      },
      {
        src: "assets/newspaper-clippings/carrier-pigeons-heroes-1923.png",
        alt: "Newspaper clipping about carrier pigeons as heroes from 1923",
        position: "50% 0%"
      }
    ]
  },
  {
    frames: ["heroic", "sport", "hunting"],
    decade: "1880-1889",
    termFrames: ["sport", "hunting"],
    annotations: [
      { year: 1888, text: "sport and trap shooting", frame: "sport" },
      { year: 1918, text: "WWI", frame: "heroic" },
      { year: 1943, text: "WWII", frame: "heroic" }
    ],
    clips: [
      {
        src: "assets/newspaper-clippings/carrier-pigeons-heroes-1923.png",
        alt: "Newspaper clipping about carrier pigeons as heroes from 1923"
      },
      {
        src: "assets/newspaper-clippings/war-pigeon-hero-1937.jpg",
        alt: "Newspaper clipping about a war pigeon hero from 1937"
      }
    ]
  },
  {
    frames: ["heroic", "sport", "hunting", "nuisance"],
    decade: "1960-1969",
    termFrames: ["nuisance", "heroic"],
    annotations: [
      { year: 1963, text: "pest vocabulary rises", frame: "nuisance" },
      { year: 1966, text: "Hoving", frame: "nuisance" }
    ],
    clips: [
      {
        src: "assets/newspaper-clippings/pigeons-deaths-1963.png",
        alt: "Newspaper clipping about pigeon deaths from 1963"
      },
      {
        src: "assets/newspaper-clippings/rats-with-wings-1966.png",
        alt: "Newspaper clipping using rats with wings in 1966"
      }
    ]
  },
  {
    frames: ["heroic", "sport", "culinary", "hunting", "nuisance"],
    decade: "1990-1999",
    termFrames: ["nuisance", "heroic", "sport", "hunting"],
    annotations: [
      { year: 1943, text: "wartime high", frame: "heroic" },
      { year: 1992, text: "lower-volume pest era", frame: "nuisance" }
    ],
    clips: [
      {
        src: "assets/newspaper-clippings/pigeons-deaths-1963.png",
        alt: "Newspaper clipping about pigeon deaths from 1963"
      },
      {
        src: "assets/newspaper-clippings/rats-with-wings-1966.png",
        alt: "Newspaper clipping using rats with wings in 1966"
      }
    ]
  }
];

const PIVOT_ANNOTATIONS = [
  { year: 1918, title: "Cher Ami era", text: "heroic wartime language", frame: "heroic" },
  { year: 1958, title: "The language flips", text: "crossover zone", frame: "nuisance" },
  { year: 1963, title: "The panic forms", text: "1963-64 spike", frame: "nuisance" },
  { year: 1966, title: "Hoving named parks commissioner", text: "amplification", frame: "nuisance" },
  { year: 1992, title: "Second wave", text: "1990s pest vocabulary", frame: "nuisance" }
];

const QUINTILE_COLORS = ["--q1", "--q2", "--q3", "--q4", "--q5"];

const state = {
  textData: null,
  mapData: null,
  act3Step: 0,
  act4Step: 0,
  activeQuintile: null,
  activeTooltipLayer: null,
  cher: null,
  cherPromise: null,
  textDataPromise: null,
  textVisualsReady: false,
  mapDataPromise: null,
  mapReady: false,
  mapLayers: [],
  mapScatterData: []
};

document.addEventListener("DOMContentLoaded", () => {
  boot();
});

async function boot() {
  try {
    await waitForGlobals(["gsap", "ScrollTrigger"]);
    gsap.registerPlugin(ScrollTrigger);
    setupScrollProgress();
    setupNavObserver();
    setupStepObserver();
    setupScrollScenes();
    setupHashCorrection();
    initLegend();
    setupLazySections();
    window.addEventListener("resize", debounce(() => {
      if (state.textVisualsReady) {
        renderAct3();
        renderAct4();
      }
      if (state.mapReady) renderCityScatter();
      ScrollTrigger.refresh();
    }, 180));
  } catch (error) {
    console.error(error);
    document.documentElement.classList.add("js-error");
  }
}

function setupLazySections() {
  runWhenNear("#act2", () => requestCherAmiSoon(), "0px 0px -18% 0px");
  runWhenNear("#act3", () => requestTextVisuals(), "1100px 0px");
  runWhenNear("#act4", () => requestTextVisuals(), "1100px 0px");
  runWhenNear("#act5", () => requestMaps(), "1200px 0px");
  requestSectionPayload(window.location.hash.slice(1));
}

function runWhenNear(selector, callback, rootMargin = "900px 0px") {
  const target = document.querySelector(selector);
  if (!target) return;
  if (!("IntersectionObserver" in window)) {
    callback();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  }, { rootMargin, threshold: 0.01 });
  observer.observe(target);
}

function requestSectionPayload(id) {
  if (id === "act2") requestCherAmi();
  if (id === "act3" || id === "act4") requestTextVisuals();
  if (id === "act5") requestMaps();
}

function requestCherAmi() {
  if (!state.cherPromise) {
    state.cherPromise = initCherAmi();
  }
  return state.cherPromise;
}

function requestCherAmiSoon() {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => requestCherAmi(), { timeout: 900 });
  } else {
    window.setTimeout(() => requestCherAmi(), 160);
  }
}

function requestTextVisuals() {
  if (state.textVisualsReady) return Promise.resolve(state.textData);
  if (!state.textDataPromise) {
    state.textDataPromise = loadTextData();
  }
  return state.textDataPromise.then((textData) => {
    state.textData = textData;
    if (!state.textVisualsReady) {
      initAct3(textData);
      initAct4(textData);
      state.textVisualsReady = true;
    }
    return textData;
  }).catch((error) => {
    showBoxMessage("#act3-chart", `Text data could not load: ${error.message}`);
    showBoxMessage("#act4-chart", `Text data could not load: ${error.message}`);
  });
}

function requestMaps() {
  if (state.mapReady) return Promise.resolve(state.mapData);
  if (!state.mapDataPromise) {
    state.mapDataPromise = loadMapData();
  }
  return state.mapDataPromise.then((mapData) => {
    state.mapData = mapData;
    if (!state.mapReady) {
      initAct5(mapData);
      state.mapReady = true;
    }
    return mapData;
  }).catch((error) => {
    showBoxMessage("#city-scatter", `Map data could not load: ${error.message}`);
  });
}

function waitForGlobals(names, timeout = 9000) {
  const started = performance.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const ready = names.every((name) => Boolean(globalThis[name]));
      if (ready) {
        resolve();
        return;
      }
      if (performance.now() - started > timeout) {
        reject(new Error(`Timed out waiting for ${names.join(", ")}`));
        return;
      }
      window.requestAnimationFrame(tick);
    };
    tick();
  });
}

async function loadTextData() {
  await waitForGlobals(["d3", "Plot"]);
  const [annual, decades] = await Promise.all([
    d3.csv(PATHS.annual, d3.autoType),
    d3.csv(PATHS.decades, d3.autoType)
  ]);
  return { annual, decades };
}

async function loadMapData() {
  await ensureLeaflet();
  const [dc, nyc] = await Promise.all([
    fetch(PATHS.dcGeo).then(assertJson),
    fetch(PATHS.nycGeo).then(assertJson)
  ]);
  return { dc, nyc };
}

async function assertJson(response) {
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function ensureLeaflet() {
  loadStylesheet("https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css", "leaflet-css");
  return Promise.all([
    loadScript("https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js", "leaflet-js"),
    loadScript("https://cdn.jsdelivr.net/npm/proj4@2.12.1/dist/proj4.js", "proj4-js")
  ]).then(() => waitForGlobals(["L", "proj4"]));
}

function loadScript(src, id) {
  const existing = document.getElementById(id);
  if (existing?.dataset.loaded === "true") return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = existing || document.createElement("script");
    script.id = id;
    script.src = src;
    script.defer = true;
    script.dataset.loaded = script.dataset.loaded || "false";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), { once: true });
    if (!existing) document.head.appendChild(script);
  });
}

function loadStylesheet(href, id) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function setupScrollProgress() {
  const fill = document.querySelector("#scroll-progress-fill");
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      fill.style.width = `${(self.progress * 100).toFixed(2)}%`;
    }
  });
}

function setupNavObserver() {
  const links = new Map(
    Array.from(document.querySelectorAll("[data-nav-link]")).map((link) => [link.dataset.navLink, link])
  );
  const sections = Array.from(document.querySelectorAll(".act"));
  const setActive = (id) => {
    links.forEach((link) => link.classList.remove("is-active"));
    const active = links.get(id);
    if (active) active.classList.add("is-active");
  };
  const updateFromViewport = () => {
    const probe = window.scrollY + window.innerHeight * 0.42;
    const current = sections
      .slice()
      .reverse()
      .find((section) => section.offsetTop <= probe);
    if (current) setActive(current.id);
  };
  let scheduled = false;
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      updateFromViewport();
    });
  };
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  updateFromViewport();
}

function setupScrollScenes() {
  const matcher = gsap.matchMedia();
  matcher.add("(min-width: 901px)", () => {
    const triggers = [];
    triggers.push(ScrollTrigger.create({
      trigger: "#act2 .scrolly-grid",
      start: "top 84px",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (state.cher) state.cher.setProgress(self.progress);
      }
    }));
    return () => triggers.forEach((trigger) => trigger.kill());
  });
}

function setupHashCorrection() {
  const scrollToId = (id, behavior = "auto") => {
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    requestSectionPayload(id);
    window.setTimeout(() => {
      const offset = 86;
      const top = Math.max(0, target.offsetTop - offset);
      window.scrollTo({ top, behavior });
      ScrollTrigger.update();
    }, 80);
  };
  const scrollToHash = () => scrollToId(window.location.hash.slice(1));

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      history.pushState(null, "", `#${id}`);
      scrollToId(id, "smooth");
    });
  });

  window.addEventListener("hashchange", scrollToHash);
  window.requestAnimationFrame(scrollToHash);
}

function setupStepObserver() {
  document.querySelectorAll(".story-step").forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 58%",
      end: "bottom 42%",
      onEnter: () => activateStep(step),
      onEnterBack: () => activateStep(step)
    });
  });
}

function activateStep(step) {
  const container = step.closest(".story-steps");
  if (container) {
    container.querySelectorAll(".story-step").forEach((item) => item.classList.remove("is-active"));
  }
  step.classList.add("is-active");

  if (step.dataset.act3Step !== undefined) {
    const nextStep = Number(step.dataset.act3Step);
    if (state.act3Step !== nextStep) {
      state.act3Step = nextStep;
      renderAct3();
    }
  }
  if (step.dataset.act4Step !== undefined) {
    const nextStep = Number(step.dataset.act4Step);
    if (state.act4Step !== nextStep) {
      state.act4Step = nextStep;
      renderAct4();
    }
  }
}

async function initCherAmi() {
  const root = document.querySelector("#cher-splat");
  const status = document.querySelector("#splat-status");
  if (!root || !status) return;

  try {
    const [{ default: ThreeNamespace }, GaussianSplats3D] = await Promise.all([
      import("three").then((module) => ({ default: module })),
      import("@mkkellogg/gaussian-splats-3d")
    ]);
    const THREE = ThreeNamespace;
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(1);
    root.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      CHER_AMI_CAMERA.fov,
      1,
      CHER_AMI_CAMERA.near,
      CHER_AMI_CAMERA.far
    );
    camera.up = new THREE.Vector3(0, 1, 0);

    const viewer = new GaussianSplats3D.Viewer({
      selfDrivenMode: false,
      renderer,
      camera,
      useBuiltInControls: false,
      ignoreDevicePixelRatio: true,
      gpuAcceleratedSort: false,
      sharedMemoryForWorkers: false,
      integerBasedSort: false,
      sceneRevealMode: GaussianSplats3D.SceneRevealMode.Gradual,
      renderMode: GaussianSplats3D.RenderMode.Always,
      webXRMode: GaussianSplats3D.WebXRMode.None,
      logLevel: GaussianSplats3D.LogLevel.None,
      sphericalHarmonicsDegree: 0
    });

    const poses = CHER_AMI_CAMERA.poses;
    let rafId = null;
    let shouldRender = false;

    const controller = {
      progress: 0,
      setProgress(progress) {
        this.progress = clamp(progress, 0, 1);
        updateCameraFromProgress();
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(420, Math.floor(rect.height));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const renderOnce = () => {
      viewer.update();
      viewer.render();
    };

    const renderLoop = () => {
      if (!shouldRender) {
        rafId = null;
        return;
      }
      renderOnce();
      rafId = window.requestAnimationFrame(renderLoop);
    };

    const startRendering = () => {
      if (shouldRender) return;
      shouldRender = true;
      if (!rafId) rafId = window.requestAnimationFrame(renderLoop);
    };

    const stopRendering = () => {
      shouldRender = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const updateCameraFromProgress = () => {
      const scaled = controller.progress * (poses.length - 1);
      const index = Math.min(poses.length - 2, Math.floor(scaled));
      const local = scaled - index;
      const from = poses[index];
      const to = poses[index + 1];
      const eased = easeInOutCubic(local);
      const pos = interpolateArray(from.position, to.position, eased);
      const target = interpolateArray(from.lookAt, to.lookAt, eased);
      camera.position.set(pos[0], pos[1], pos[2]);
      camera.lookAt(target[0], target[1], target[2]);
      camera.updateProjectionMatrix();
    };

    state.cher = controller;
    resize();
    updateCameraFromProgress();
    window.addEventListener("resize", debounce(resize, 150));

    status.textContent = "Loading Cher Ami model";
    await viewer.addSplatScene(PATHS.splat, {
      splatAlphaRemovalThreshold: CHER_AMI_CAMERA.alphaRemovalThreshold,
      showLoadingUI: false,
      progressiveLoad: false,
      position: CHER_AMI_CAMERA.scenePosition,
      rotation: CHER_AMI_CAMERA.sceneRotation,
      scale: CHER_AMI_CAMERA.sceneScale
    });
    root.classList.add("is-live");
    status.textContent = "Cher Ami splat loaded";

    const renderObserver = new IntersectionObserver((entries) => {
      const isNearViewport = entries.some((entry) => entry.isIntersecting);
      if (isNearViewport) {
        resize();
        updateCameraFromProgress();
        startRendering();
      } else {
        stopRendering();
      }
    }, { rootMargin: "360px 0px", threshold: 0 });
    renderObserver.observe(root);
  } catch (error) {
    console.error(error);
    status.textContent = "Splat fallback image shown";
  }
}

function initAct3({ annual, decades }) {
  state.act3Long = makeLongAnnual(annual);
  state.decades = decades;
  renderAct3();
  renderTerms(ACT3_STEPS[0], "#act3-terms");
  renderClips(ACT3_STEPS[0]);
}

function renderAct3() {
  if (!state.act3Long || !state.decades) return;
  const step = ACT3_STEPS[state.act3Step] || ACT3_STEPS[0];
  const container = document.querySelector("#act3-chart");
  if (!container) return;
  const visible = new Set(step.frames);
  const data = state.act3Long.filter((d) => visible.has(d.frame));
  const allY = d3.max(state.act3Long, (d) => d.rate) || 1;
  const width = plotWidth(container);
  const colors = frameColors();
  const annotations = step.annotations.map((annotation, index) => ({
    ...annotation,
    y: allY * (0.9 - index * 0.12),
    color: colors[annotation.frame] || "currentColor"
  }));

  const chart = Plot.plot({
    width,
    height: 370,
    marginTop: 26,
    marginRight: 24,
    marginBottom: 42,
    marginLeft: 54,
    style: { background: "transparent", color: cssVar("--ink") },
    x: {
      domain: [1880, 2000],
      tickFormat: (d) => String(d),
      label: null
    },
    y: {
      domain: [0, allY * 1.08],
      grid: true,
      label: "frame hits per article"
    },
    color: {
      domain: FRAME_CONFIG.map((d) => d.label),
      range: FRAME_CONFIG.map((d) => colors[d.key])
    },
    marks: [
      Plot.ruleY([0], { stroke: cssVar("--line") }),
      Plot.lineY(data, {
        x: "year",
        y: "rate",
        stroke: "label",
        strokeWidth: (d) => (d.frame === "heroic" || d.frame === "nuisance" ? 3 : 2.2),
        curve: "catmull-rom"
      }),
      Plot.dot(data.filter((d) => d.year % 10 === 0 || d.year === 1918 || d.year === 1943 || d.year === 1963), {
        x: "year",
        y: "rate",
        fill: "label",
        r: 3,
        title: (d) => `${d.year}\n${d.label}: ${formatRate(d.rate)}`
      }),
      Plot.ruleX(annotations, {
        x: "year",
        stroke: (d) => d.color,
        strokeWidth: 1.4,
        strokeDasharray: "4 4"
      }),
      Plot.text(annotations, {
        x: "year",
        y: "y",
        text: "text",
        fill: (d) => d.color,
        fontSize: 12,
        dy: -8,
        textAnchor: "middle"
      })
    ]
  });

  replacePlot(container, chart);
  renderTerms(step, "#act3-terms");
  renderClips(step);
}

function initAct4({ annual, decades }) {
  state.pivotLong = makeLongAnnual(annual).filter((d) => d.frame === "heroic" || d.frame === "nuisance");
  state.decades = decades;
  renderClouds(decades);
  renderAct4();
}

function renderAct4() {
  if (!state.pivotLong) return;
  const container = document.querySelector("#act4-chart");
  if (!container) return;
  const annotation = PIVOT_ANNOTATIONS[state.act4Step] || PIVOT_ANNOTATIONS[0];
  const width = plotWidth(container);
  const colors = frameColors();
  const maxY = d3.max(state.pivotLong, (d) => d.rate) || 1;
  const annotationRows = PIVOT_ANNOTATIONS.map((item, index) => ({
    ...item,
    y: maxY * (0.82 - (index % 2) * 0.12),
    active: item === annotation,
    color: colors[item.frame]
  }));
  const activeAnnotationRows = annotationRows.filter((item) => item.active);

  const title = document.querySelector("#pivot-title");
  if (title) title.textContent = annotation.title;

  const chart = Plot.plot({
    width,
    height: 340,
    marginTop: 28,
    marginRight: 24,
    marginBottom: 42,
    marginLeft: 54,
    style: { background: "transparent", color: cssVar("--ink") },
    x: { domain: [1880, 2000], tickFormat: (d) => String(d), label: null },
    y: { domain: [0, maxY * 1.1], grid: true, label: "frame hits per article" },
    color: {
      domain: ["Heroic / utility", "Nuisance / disease"],
      range: [colors.heroic, colors.nuisance]
    },
    marks: [
      Plot.ruleY([0], { stroke: cssVar("--line") }),
      Plot.lineY(state.pivotLong, {
        x: "year",
        y: "rate",
        stroke: "label",
        strokeWidth: 3,
        curve: "catmull-rom"
      }),
      Plot.dot(state.pivotLong.filter((d) => [1918, 1943, 1958, 1963, 1964, 1966, 1992].includes(d.year)), {
        x: "year",
        y: "rate",
        fill: "label",
        r: 3.4,
        title: (d) => `${d.year}\n${d.label}: ${formatRate(d.rate)}`
      }),
      Plot.ruleX(annotationRows, {
        x: "year",
        stroke: (d) => d.active ? d.color : cssVar("--line"),
        strokeWidth: (d) => d.active ? 2.4 : 1,
        strokeDasharray: "4 4",
        opacity: (d) => d.active ? 1 : 0.45
      }),
      Plot.text(activeAnnotationRows, {
        x: "year",
        y: "y",
        text: "text",
        fill: (d) => d.color,
        fontSize: 13,
        dy: -8,
        textAnchor: "middle"
      })
    ]
  });
  replacePlot(container, chart);
}

function initAct5({ dc, nyc }) {
  if (!globalThis.L || !globalThis.proj4) {
    showBoxMessage("#city-scatter", "Leaflet or proj4 did not load.");
    return;
  }

  defineProjections();
  annotateMapFeatures(dc, "DC");
  annotateMapFeatures(nyc, "NYC");

  const densities = [...dc.features, ...nyc.features]
    .map((feature) => number(feature.properties.pigeon_density))
    .filter((value) => Number.isFinite(value));
  const quantileScale = d3.scaleQuantile().domain(densities).range([0, 1, 2, 3, 4]);
  [...dc.features, ...nyc.features].forEach((feature) => {
    const density = number(feature.properties.pigeon_density);
    feature.properties.__quintile = Number.isFinite(density) ? quantileScale(density) : 0;
  });

  const dcLayer = makeCityMap("dc-map", dc, "EPSG:26985");
  const nycLayer = makeCityMap("nyc-map", nyc, "EPSG:2263");
  state.mapLayers = [dcLayer, nycLayer];
  state.mapScatterData = makeScatterData(dc, nyc);
  renderCityScatter();
}

function makeCityMap(elementId, geojson, sourceCrs) {
  const map = L.map(elementId, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: true,
    keyboard: false
  });
  L.control.zoom({ position: "bottomright" }).addTo(map);

  const layer = L.geoJSON(geojson, {
    coordsToLatLng: (coords) => projectCoords(sourceCrs, coords),
    style: tractStyle,
    onEachFeature: (feature, leafletLayer) => {
      const props = feature.properties;
      const showTract = () => {
        if (state.activeTooltipLayer && state.activeTooltipLayer !== leafletLayer) {
          state.activeTooltipLayer.closeTooltip();
        }
        state.activeTooltipLayer = leafletLayer;
        leafletLayer.openTooltip();
        setActiveQuintile(props.__quintile, props);
      };
      const hideTract = () => {
        if (state.activeTooltipLayer === leafletLayer) {
          leafletLayer.closeTooltip();
          state.activeTooltipLayer = null;
          setActiveQuintile(null);
        }
      };

      leafletLayer.bindTooltip(tooltipHtml(props), {
        direction: "auto",
        opacity: 0.95,
        permanent: false,
        sticky: false
      });
      leafletLayer.on("mouseover", showTract);
      leafletLayer.on("click", showTract);
      leafletLayer.on("focus", showTract);
      leafletLayer.on("mouseout", hideTract);
      leafletLayer.on("blur", hideTract);
    }
  }).addTo(map);

  map.fitBounds(layer.getBounds(), { padding: [10, 10] });
  return { map, layer };
}

function setActiveQuintile(quintile, props = null) {
  const changed = state.activeQuintile !== quintile;
  state.activeQuintile = quintile;
  if (changed) {
    state.mapLayers.forEach(({ layer }) => {
      layer.eachLayer((tractLayer) => {
        tractLayer.setStyle(tractStyle(tractLayer.feature));
        if (quintile !== null && tractLayer.feature.properties.__quintile === quintile) {
          tractLayer.bringToFront();
        }
      });
    });
    renderCityScatter();
  }
  updateTractDetail(quintile, props);
}

function tractStyle(feature) {
  const q = feature.properties.__quintile || 0;
  const active = state.activeQuintile !== null && q === state.activeQuintile;
  return {
    color: active ? cssVar("--ink") : "rgba(24, 32, 42, 0.24)",
    weight: active ? 1.8 : 0.45,
    fillColor: cssVar(QUINTILE_COLORS[q]),
    fillOpacity: active ? 0.9 : 0.62,
    opacity: 1
  };
}

function updateTractDetail(quintile, props) {
  const detail = document.querySelector("#tract-detail");
  if (!detail) return;
  if (quintile === null || !props) {
    detail.innerHTML = `
      <p class="mini-heading">Hovered density band</p>
      <strong>Move across either map</strong>
      <span>Matching quintiles will light up in both cities.</span>
    `;
    return;
  }

  detail.innerHTML = `
    <p class="mini-heading">Quintile ${quintile + 1} of 5</p>
    <strong>${escapeHtml(props.__label)}</strong>
    <span>${escapeHtml(props.__city)} tract, matched by pigeon-density band.</span>
    <dl>
      <div>
        <dt>Pigeon density</dt>
        <dd>${formatNumber(props.pigeon_density)} / km2</dd>
      </div>
      <div>
        <dt>Building density</dt>
        <dd>${formatNumber(props.building_density)} / km2</dd>
      </div>
      <div>
        <dt>Observed pigeons</dt>
        <dd>${formatNumber(props.n_pigeons)}</dd>
      </div>
    </dl>
  `;
}

function renderCityScatter() {
  const container = document.querySelector("#city-scatter");
  if (!container || !state.mapScatterData.length) return;
  const active = state.activeQuintile;
  const width = plotWidth(container);
  const chart = Plot.plot({
    width,
    height: 250,
    marginTop: 18,
    marginRight: 24,
    marginBottom: 48,
    marginLeft: 58,
    style: { background: "transparent", color: cssVar("--ink") },
    x: {
      type: "sqrt",
      label: "building density",
      grid: true
    },
    y: {
      label: "pigeon density",
      grid: true
    },
    color: {
      domain: ["DC", "NYC"],
      range: [cssVar("--dc"), cssVar("--nyc")]
    },
    marks: [
      Plot.dot(state.mapScatterData, {
        x: "buildingDensity",
        y: "pigeonDensity",
        fill: "city",
        r: 3.1,
        fillOpacity: (d) => active === null || d.quintile === active ? 0.72 : 0.12,
        stroke: (d) => active !== null && d.quintile === active ? cssVar("--ink") : "none",
        title: (d) => `${d.city}: ${d.label}\nPigeon density: ${formatNumber(d.pigeonDensity)}\nBuilding density: ${formatNumber(d.buildingDensity)}`
      })
    ]
  });
  replacePlot(container, chart);
}

function makeLongAnnual(annual) {
  return annual
    .filter((row) => row.source === "NYT" && row.year >= 1880 && row.year <= 2000)
    .flatMap((row) => FRAME_CONFIG.map((frame) => ({
      year: row.year,
      frame: frame.key,
      label: frame.label,
      rate: number(row[frame.column]),
      nArticles: row.n_articles
    })))
    .filter((row) => Number.isFinite(row.rate));
}

function renderTerms(step, selector) {
  const container = document.querySelector(selector);
  if (!container || !state.decades) return;
  const terms = topTermsForDecade(state.decades, step.decade, step.termFrames, 10);
  container.replaceChildren(...terms.map(makeTermNode));
}

function renderClips(step) {
  const container = document.querySelector("#act3-clips");
  if (!container) return;
  const clips = step.clips || [];
  container.dataset.count = String(clips.length);
  container.replaceChildren(...clips.map((clip) => {
    const frame = document.createElement("span");
    frame.className = "clip-frame";

    const img = document.createElement("img");
    img.src = clip.src;
    img.alt = clip.alt;
    img.loading = "lazy";
    img.style.objectFit = "cover";
    img.style.objectPosition = clip.position || "50% 50%";
    img.style.transform = `scale(${clip.scale || 1})`;
    frame.appendChild(img);
    return frame;
  }));
}

function renderClouds(decades) {
  const specs = [
    { key: "wwii", decade: "1940-1949", frames: ["heroic", "sport", "hunting"] },
    { key: "hoving", decade: "1960-1969", frames: ["nuisance", "hunting", "sport"] },
    { key: "wave", decade: "1990-1999", frames: ["nuisance", "heroic", "sport"] }
  ];
  specs.forEach((spec) => {
    const target = document.querySelector(`[data-cloud="${spec.key}"] div`);
    if (!target) return;
    const nodes = topTermsForDecade(decades, spec.decade, spec.frames, 12).map(makeTermNode);
    target.replaceChildren(...nodes);
  });
}

function topTermsForDecade(decades, decade, allowedFrames, limit) {
  const row = decades.find((item) => item.decade === decade);
  if (!row) return [];
  const allowed = new Set(allowedFrames);
  return Object.entries(row)
    .filter(([term, value]) => term !== "decade" && Number.isFinite(number(value)))
    .map(([term, value]) => ({ term, value: number(value), frame: TERM_FRAME.get(term) }))
    .filter((item) => item.frame && allowed.has(item.frame) && item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function makeTermNode(item) {
  const span = document.createElement("span");
  span.textContent = item.term;
  span.dataset.frame = item.frame;
  span.title = `${item.term}: ${formatNumber(item.value)}`;
  return span;
}

function initLegend() {
  const legend = document.querySelector("#map-legend-swatches");
  if (!legend) return;
  legend.replaceChildren(...QUINTILE_COLORS.map(() => document.createElement("span")));
}

function defineProjections() {
  proj4.defs("EPSG:26985", "+proj=lcc +lat_0=37.6666666666667 +lon_0=-77 +lat_1=38.3 +lat_2=39.45 +x_0=400000 +y_0=0 +datum=NAD83 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:2263", "+proj=lcc +lat_0=40.1666666666667 +lon_0=-74 +lat_1=40.6666666666667 +lat_2=41.0333333333333 +x_0=300000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs +type=crs");
}

function projectCoords(sourceCrs, coords) {
  const [lon, lat] = proj4(sourceCrs, "EPSG:4326", coords);
  return L.latLng(lat, lon);
}

function annotateMapFeatures(geojson, city) {
  geojson.features.forEach((feature) => {
    const props = feature.properties;
    props.__city = city;
    props.__label = city === "DC"
      ? `Census tract ${props.NAME || props.GEOID || "unknown"}`
      : `${props.boroname || "NYC"} tract ${props.ctlabel || props.geoid || "unknown"}`;
  });
}

function makeScatterData(dc, nyc) {
  return [
    ...dc.features.map((feature) => scatterPoint(feature.properties)),
    ...nyc.features.map((feature) => scatterPoint(feature.properties))
  ].filter((d) => Number.isFinite(d.pigeonDensity) && Number.isFinite(d.buildingDensity));
}

function scatterPoint(props) {
  return {
    city: props.__city,
    label: props.__label,
    pigeonDensity: number(props.pigeon_density),
    buildingDensity: number(props.building_density),
    quintile: props.__quintile
  };
}

function tooltipHtml(props) {
  return `
    <strong>${escapeHtml(props.__label)}</strong><br>
    Pigeon: ${formatNumber(props.pigeon_density)} / km2<br>
    Building: ${formatNumber(props.building_density)} / km2
  `;
}

function frameColors() {
  return Object.fromEntries(FRAME_CONFIG.map((frame) => [frame.key, cssVar(frame.color)]));
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function plotWidth(container) {
  return Math.max(330, Math.floor(container.getBoundingClientRect().width || 720));
}

function replacePlot(container, chart) {
  container.replaceChildren(chart);
}

function showBoxMessage(selector, message) {
  const container = document.querySelector(selector);
  if (!container) return;
  const p = document.createElement("p");
  p.className = "box-message";
  p.textContent = message;
  container.replaceChildren(p);
}

function number(value) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatRate(value) {
  return number(value).toFixed(3);
}

function formatNumber(value) {
  const parsed = number(value);
  if (!Number.isFinite(parsed)) return "NA";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: parsed >= 10 ? 0 : 1 }).format(parsed);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function interpolateArray(a, b, t) {
  return a.map((value, index) => value + (b[index] - value) * t);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function debounce(fn, wait) {
  let timeout = null;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), wait);
  };
}
