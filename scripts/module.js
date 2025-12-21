import { CountdownTrackerApp } from './countdown-app.js';

Hooks.once('init', () => {
    // Register settings for position, locked state, and minimized state
    game.settings.register("dh-improved-countdowns", "position", {
        name: "Tracker Position",
        scope: "client",
        config: false,
        type: Object,
        default: { top: 100, left: 100 }
    });

    game.settings.register("dh-improved-countdowns", "locked", {
        name: "Lock Tracker Position",
        hint: "Prevents the countdown tracker from being dragged.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "minimized", {
        name: "Minimized View",
        scope: "client",
        config: false,
        type: Boolean,
        default: false,
        onChange: () => CountdownTrackerApp.instance?.render()
    });
});

Hooks.once('ready', () => {
    // Hide default countdown tracker via CSS (handled in countdown.css)

    // Initialize our improved tracker
    CountdownTrackerApp.initialize();
});

// Re-render when countdowns change in the system
Hooks.on('DhRefresh', (data) => {
    if (data.refreshType === "DhCoundownRefresh") {
        CountdownTrackerApp.instance?.render();
    }
});

// Inject "Create Countdown" button into Daggerheart GM Sidebar
Hooks.on('renderDaggerheartMenu', (app, html) => {
    if (!game.user.isGM) return;

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('dh-improved-countdowns-sidebar');
    fieldset.innerHTML = `
        <legend>${game.i18n.localize("DHIC.Countdowns")}</legend>
        <div class="menu-refresh-container">
            <button type="button" class="create-countdown-btn">
                <i class="fa-solid fa-clock"></i> ${game.i18n.localize("DHIC.CreateNewCountdown")}
            </button>
        </div>
    `;

    fieldset.querySelector('.create-countdown-btn').addEventListener('click', () => {
        if (game.system.api.applications.ui.CountdownEdit) {
            new game.system.api.applications.ui.CountdownEdit().render(true);
        }
    });

    html.appendChild(fieldset);
});
