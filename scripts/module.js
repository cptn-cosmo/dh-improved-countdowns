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

    game.settings.register("dh-improved-countdowns", "iconShape", {
        name: "Icon Shape",
        hint: "Choose the shape of the countdown icons.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "rounded": "Rounded Square",
            "circle": "Circle"
        },
        default: "rounded",
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "displayMode", {
        name: "Display Mode",
        hint: "Choose how the countdown value is displayed.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "number": "Number",
            "visual": "Visual (Bar/Clock)"
        },
        default: "number",
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "barOrientation", {
        name: "Bar Orientation",
        hint: "Choose the orientation of the progress bar (for square icons).",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "vertical": "Vertical",
            "horizontal": "Horizontal"
        },
        default: "vertical",
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "visualColor", {
        name: "Visual Color",
        hint: "Choose the color for the progress overlay and border.",
        scope: "client",
        config: true,
        type: String,
        default: "#ffffff",
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "enableVisualOverlay", {
        name: "Enable Fill Overlay",
        hint: "Show the filled progress overlay (Bar or Clock).",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "enableVisualBorder", {
        name: "Enable Border Progress",
        hint: "Show a progress border around the icon.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "gmAlwaysShowNumbers", {
        name: "GM Always Shows Numbers",
        hint: "If enabled, the GM will always see the numerical value even if Display Mode is set to Visual.",
        scope: "client", // This should be client-scoped as it's a preference for the GM user
        config: true,
        type: Boolean,
        default: true,
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
