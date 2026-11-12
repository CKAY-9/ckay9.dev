// ---------- DOM ----------
const container = document.getElementById("container");
const homeView = document.getElementById("home-view");
const projectsView = document.getElementById("projects-view");
const homeAvatar = document.getElementById("home-avatar");
const homeLink = document.getElementById("home-link");
const slider = document.getElementById("slider");
const gridPanel = document.getElementById("grid-panel");
const detailPanel = document.getElementById("detail-panel");
const grid = document.getElementById("project-grid");
const backBtn = document.getElementById("back-btn");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// ---------- Project data ----------
// Project content lives in index.html as plain markup (a .project-card in the grid and a
// .project-article for the detail) so it can be indexed. To add a project, add both there.
const projects = [...grid.querySelectorAll(".project-card")].map(card => {
    const icon = card.querySelector(".project-icon");
    return {
        id: card.dataset.id,
        name: card.querySelector("h3").textContent.trim(),
        icon: icon ? icon.getAttribute("src") : null,
        article: document.getElementById("project-" + card.dataset.id),
    };
});

// ---------- Home ----------
function changeBackground() {
    const colors = [
        "rgb(5, 12, 18)",
        "rgb(10, 14, 26)",
        "rgb(5, 10, 22)",
        "rgb(16, 10, 22)"
    ];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}

// ---------- Detail ----------
// Show one article (or none). Hidden articles have any playing video stopped.
function showArticle(project) {
    for (const p of projects) {
        const show = p === project;
        if (p.article.hidden !== show) continue;
        p.article.hidden = !show;
        if (!show) stopMedia(p.article);
    }
}

function stopMedia(article) {
    article.querySelectorAll("video").forEach(v => v.pause());
    // An iframe keeps playing while display:none; swapping in a clone (lazy, so it
    // doesn't load until shown again) stops it.
    article.querySelectorAll("iframe").forEach(f => f.replaceWith(f.cloneNode()));
}

// Keep the slider as tall as whichever panel is showing
function syncHeight(instant) {
    if (projectsView.hidden) return;
    const active = slider.classList.contains("open") ? detailPanel : gridPanel;
    if (instant) slider.style.transition = "none";
    slider.style.height = active.offsetHeight + "px";
    if (instant) {
        slider.offsetHeight; // flush so the height lands without animating
        slider.style.transition = "";
    }
}
new ResizeObserver(() => syncHeight()).observe(gridPanel);
new ResizeObserver(() => syncHeight()).observe(detailPanel);

// ---------- Icon backdrop ----------
const TILE = 160; // keep in sync with --tile in styles.css
const ICON_SIZE = 36;
const tileUrls = {};
const bgLayers = [...document.querySelectorAll(".bg-tiles")];
const bgPans = bgLayers.map(l => l.querySelector(".bg-tiles-pan"));
let bgActive = 0;
let openId = null;
let hoverId = null;
let focusId = null;

// Draw each icon into a padded, staggered tile once, so it repeats with breathing room
function buildTile(p) {
    if (!p.icon) return;
    const img = new Image();
    img.onload = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const c = document.createElement("canvas");
        c.width = c.height = TILE * dpr;
        const ctx = c.getContext("2d");
        ctx.scale(dpr, dpr);
        const w = img.naturalWidth || ICON_SIZE;
        const h = img.naturalHeight || ICON_SIZE;
        const s = ICON_SIZE / Math.max(w, h);
        for (const [x, y] of [[0.25, 0.25], [0.75, 0.75]]) {
            ctx.save();
            ctx.translate(x * TILE, y * TILE);
            ctx.rotate(-0.2);
            ctx.drawImage(img, -w * s / 2, -h * s / 2, w * s, h * s);
            ctx.restore();
        }
        try {
            tileUrls[p.id] = `url(${c.toDataURL()})`;
            updateBg();
        } catch { /* tainted canvas: skip the backdrop for this one */ }
    };
    img.src = p.icon;
}
projects.forEach(buildTile);

function updateBg() {
    const id = openId || hoverId || focusId;
    const current = bgLayers[bgActive];
    const wasOpen = current.classList.contains("open");

    if (!id) {
        current.classList.remove("peek", "open");
        if (wasOpen) startSurge();
        return;
    }

    // Different project: fade the current layer out and bring the other one in.
    // Same project (e.g. re-hovering mid fade-out) keeps its layer and just fades back.
    if (current.dataset.id !== id) {
        current.classList.remove("peek", "open");
        bgActive ^= 1;
    }

    const layer = bgLayers[bgActive];
    layer.dataset.id = id;
    bgPans[bgActive].style.backgroundImage = tileUrls[id] || "";
    layer.classList.toggle("open", !!openId);
    layer.classList.toggle("peek", !openId);

    // Opening or closing a project swoops the backdrop into a new direction
    if (!!openId !== wasOpen) startSurge();
    kickMotion();
}

// ---------- Backdrop motion ----------
// Velocity-based so the direction can change mid-flight without the pattern jumping.
// Position wraps per tile, which is seamless because the pattern repeats per tile.
const DRIFT_SPEED = 9;     // px/s, the slow constant drift
const SURGE_DIST = TILE;   // extra px travelled during a transition
const SURGE_MS = 1100;
const FADE_MS = 800;       // keep moving while a layer fades out
const pos = { x: 0, y: 0 };
let dir = { x: Math.SQRT1_2, y: Math.SQRT1_2 }; // drift direction, starts down-right
let surge = null;          // { start, from, to } (unit vectors)
let lastShown = 0;
let lastFrame = 0;
let frameReq = 0;

// On each transition, pick a new direction at least 45 degrees away from the current one
function startSurge() {
    if (reducedMotion.matches) return;
    const angle = Math.atan2(dir.y, dir.x) + Math.PI / 4 + Math.random() * Math.PI * 1.5;
    surge = { start: performance.now(), from: dir, to: { x: Math.cos(angle), y: Math.sin(angle) } };
    kickMotion();
}

function kickMotion() {
    if (frameReq || reducedMotion.matches) return;
    lastFrame = performance.now();
    frameReq = requestAnimationFrame(stepMotion);
}

function stepMotion(now) {
    const dt = Math.min(now - lastFrame, 50) / 1000;
    lastFrame = now;

    let vx = dir.x * DRIFT_SPEED;
    let vy = dir.y * DRIFT_SPEED;
    if (surge) {
        const u = Math.min((now - surge.start) / SURGE_MS, 1);
        // Drift velocity blends straight across to the new direction (no sweeping
        // rotation), plus a push along the new direction that swells and settles.
        const ease = u * u * (3 - 2 * u);
        const push = (SURGE_DIST * Math.PI / 2) / (SURGE_MS / 1000) * Math.sin(Math.PI * u);
        vx = (surge.from.x + (surge.to.x - surge.from.x) * ease) * DRIFT_SPEED + surge.to.x * push;
        vy = (surge.from.y + (surge.to.y - surge.from.y) * ease) * DRIFT_SPEED + surge.to.y * push;
        if (u >= 1) {
            dir = surge.to;
            surge = null;
        }
    }

    pos.x = (((pos.x + vx * dt) % TILE) + TILE) % TILE;
    pos.y = (((pos.y + vy * dt) % TILE) + TILE) % TILE;
    const t = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    bgPans.forEach(p => p.style.transform = t);

    if (bgLayers.some(l => l.classList.contains("peek") || l.classList.contains("open"))) lastShown = now;
    frameReq = (surge || now - lastShown < FADE_MS) ? requestAnimationFrame(stepMotion) : 0;
}

reducedMotion.addEventListener("change", () => {
    surge = null;
    if (reducedMotion.matches) {
        cancelAnimationFrame(frameReq);
        frameReq = 0;
    } else {
        kickMotion();
    }
});

// ---------- Routing ----------
// ""                -> home
// #projects         -> project grid
// #projects/<id>    -> project detail
let currentView = null;
let routedHash = null;
const homeTitle = document.title; // whatever index.html's <title> says

function parseRoute() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h === "projects") return { view: "projects", id: null };
    if (h.startsWith("projects/")) return { view: "projects", id: h.slice("projects/".length) };
    // Old links (projects.html#bmod) arrive as #bmod
    if (projects.some(p => p.id === h)) {
        history.replaceState(null, "", "#projects/" + h);
        routedHash = location.hash;
        return { view: "projects", id: h };
    }
    return { view: "home", id: null };
}

function setView(view) {
    currentView = view;
    const onProjects = view === "projects";
    homeView.hidden = onProjects;
    projectsView.hidden = !onProjects;
    document.body.classList.toggle("dark", onProjects);
    container.classList.toggle("wide", onProjects);
    if (onProjects) {
        syncHeight(true);
    } else {
        hoverId = focusId = null;
    }
}

function showProject(project) {
    openId = project ? project.id : null;
    if (project) {
        showArticle(project);
        slider.classList.add("open");
        gridPanel.inert = true;
        detailPanel.inert = false;
        hoverId = null;
        backBtn.focus({ preventScroll: true });
    } else {
        slider.classList.remove("open");
        gridPanel.inert = false;
        detailPanel.inert = true;
        // Hide the article once it has slid away so any playing video stops
        setTimeout(() => {
            if (!slider.classList.contains("open")) showArticle(null);
        }, 500);
    }
    updateBg();
    syncHeight();
}

function route() {
    // popstate and hashchange can both fire for one navigation
    if (location.hash === routedHash) return;
    routedHash = location.hash;

    const { view, id } = parseRoute();
    const project = projects.find(p => p.id === id) || null;
    const apply = () => {
        if (view !== currentView) setView(view);
        showProject(view === "projects" ? project : null);
        document.title = view === "home" ? homeTitle
            : project ? `${project.name} | CKAY9.dev`
            : "Projects | CKAY9.dev";
    };

    // Home <-> projects morphs the card; within projects the slider handles it
    const morph = currentView && view !== currentView
        && document.startViewTransition && !reducedMotion.matches;
    if (morph) {
        document.startViewTransition(apply);
    } else {
        apply();
    }
}

function goBack() {
    if (history.state && history.state.fromGrid) {
        history.back();
    } else {
        history.replaceState(null, "", "#projects");
        route();
    }
}

// ---------- Events ----------
homeAvatar.addEventListener("click", changeBackground);

homeLink.addEventListener("click", e => {
    e.preventDefault();
    if (!location.hash) return;
    history.pushState(null, "", location.pathname + location.search);
    route();
});

grid.addEventListener("click", e => {
    const card = e.target.closest(".project-card");
    if (!card) return;
    history.pushState({ fromGrid: true }, "", "#projects/" + card.dataset.id);
    route();
});

grid.addEventListener("pointerover", e => {
    if (e.pointerType === "touch") return;
    const card = e.target.closest(".project-card");
    hoverId = card ? card.dataset.id : null;
    updateBg();
});
grid.addEventListener("pointerout", e => {
    if (e.pointerType === "touch") return;
    if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".project-card")) return;
    hoverId = null;
    updateBg();
});
grid.addEventListener("focusin", e => {
    const card = e.target.closest(".project-card");
    focusId = card && card.matches(":focus-visible") ? card.dataset.id : null;
    updateBg();
});
grid.addEventListener("focusout", () => {
    focusId = null;
    updateBg();
});

backBtn.addEventListener("click", goBack);
window.addEventListener("popstate", route);
window.addEventListener("hashchange", route);
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && currentView === "projects" && slider.classList.contains("open")) goBack();
});

route();
