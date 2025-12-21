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
        config: false, // Hidden from settings menu, toggled via UI
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

    game.settings.register("dh-improved-countdowns", "displayMode", {
        name: "Display Mode",
        hint: "Choose how the countdown value is displayed.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "number": "Number Only",
            "visual": "Visual Only",
            "both": "Visual + Number"
        },
        default: "number",
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

    game.settings.register("dh-improved-countdowns", "numberColor", {
        name: "Number Color",
        hint: "Color for the numerical text.",
        scope: "client",
        config: true,
        type: String,
        default: "#ffffff",
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

    game.settings.register("dh-improved-countdowns", "enableVisualOverlay", {
        name: "Enable Fill Overlay",
        hint: "Show the filled progress overlay (Bar or Clock).",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "fillType", {
        name: "Fill Type",
        hint: "Choose between a color overlay or a grayscale filter method.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "color": "Color Overlay",
            "grayscale": "Grayscale Filter"
        },
        default: "color",
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "invertProgress", {
        name: "Invert Fill Overlay",
        hint: "Fill the empty space instead of the current value.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "fillColor", {
        name: "Fill Overlay Color",
        hint: "Color for the filled progress overlay.",
        scope: "client",
        config: true,
        type: String,
        default: "#ffffff",
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

    game.settings.register("dh-improved-countdowns", "invertBorder", {
        name: "Invert Border Progress",
        hint: "Fill the empty space instead of the current value for the border.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "borderStyle", {
        name: "Border Style",
        hint: "Choose the style of the progress border (for square icons).",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "full": "Full Border",
            "edge": "Single Edge"
        },
        default: "full",
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "borderEdge", {
        name: "Border Edge",
        hint: "Choose which edge to display the border on.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "bottom": "Bottom",
            "top": "Top",
            "left": "Left",
            "right": "Right"
        },
        default: "bottom",
        onChange: () => CountdownTrackerApp.instance?.render()
    });

    game.settings.register("dh-improved-countdowns", "borderColor", {
        name: "Border Color",
        hint: "Color for the progress border.",
        scope: "client",
        config: true,
        type: String,
        default: "#ffffff",
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

Hooks.on('renderSettingsConfig', (app, html, data) => {
    // Ensure html is a jQuery object
    html = $(html);

    const moduleId = "dh-improved-countdowns";
    console.log("Improved Countdowns | Settings Config Rendered");

    // Helper to find the form group for a setting
    const getGroup = (settingName) => {
        const input = html.find(`[name="${moduleId}.${settingName}"]`);
        const group = input.closest(".form-group");
        if (!group.length) console.warn(`Improved Countdowns | Could not find form group for ${settingName}`);
        return group;
    };

    const enableOverlayInput = html.find(`[name="${moduleId}.enableVisualOverlay"]`);
    const enableBorderInput = html.find(`[name="${moduleId}.enableVisualBorder"]`);
    const displayModeInput = html.find(`[name="${moduleId}.displayMode"]`);

    // Debug findings
    if (!enableOverlayInput.length) console.warn("Improved Countdowns | Enable Overlay Input not found");
    // if (!displayModeInput.length) console.warn("Improved Countdowns | Display Mode Input not found");

    const fillTypeGroup = getGroup("fillType");
    const invertProgressGroup = getGroup("invertProgress");
    const fillColorGroup = getGroup("fillColor");
    const invertBorderGroup = getGroup("invertBorder");
    const borderColorGroup = getGroup("borderColor");
    const borderStyleGroup = getGroup("borderStyle");
    const borderEdgeGroup = getGroup("borderEdge");
    const barOrientationGroup = getGroup("barOrientation");

    // Number specific groups
    const numberColorGroup = getGroup("numberColor");
    // Visual specific groups - we already have them above
    const enableOverlayGroup = getGroup("enableVisualOverlay");
    const enableBorderGroup = getGroup("enableVisualBorder");

    const updateVisibility = () => {
        const displayMode = displayModeInput.val();
        const showVisualSettings = displayMode === "visual" || displayMode === "both";
        const showNumberSettings = displayMode === "number" || displayMode === "both";

        // Number Settings Visibility
        if (showNumberSettings) {
            numberColorGroup.show();
        } else {
            numberColorGroup.hide();
        }

        // Visual Settings Visibility
        if (showVisualSettings) {
            enableOverlayGroup.show();
            enableBorderGroup.show();

            // Nested visual settings logic
            const overlayEnabled = enableOverlayInput.prop("checked");
            const borderEnabled = enableBorderInput.prop("checked");
            const fillType = html.find(`[name="${moduleId}.fillType"]`).val();

            if (overlayEnabled) {
                fillTypeGroup.show();
                invertProgressGroup.show();
                barOrientationGroup.show();

                if (fillType === "grayscale") {
                    fillColorGroup.hide();
                } else {
                    fillColorGroup.show();
                }
            } else {
                fillTypeGroup.hide();
                invertProgressGroup.hide();
                fillColorGroup.hide();
                barOrientationGroup.hide();
            }

            if (borderEnabled) {
                invertBorderGroup.show();
                borderColorGroup.show();
                borderStyleGroup.show();

                const borderStyle = html.find(`[name="${moduleId}.borderStyle"]`).val();
                if (borderStyle === "edge") {
                    borderEdgeGroup.show();
                } else {
                    borderEdgeGroup.hide();
                }
            } else {
                invertBorderGroup.hide();
                borderColorGroup.hide();
                borderStyleGroup.hide();
                borderEdgeGroup.hide();
            }
        } else {
            // Hide all visual settings
            enableOverlayGroup.hide();
            enableBorderGroup.hide();
            fillTypeGroup.hide();
            invertProgressGroup.hide();
            fillColorGroup.hide();
            barOrientationGroup.hide();
            invertBorderGroup.hide();
            borderColorGroup.hide();
            borderStyleGroup.hide();
            borderEdgeGroup.hide();
        }
    };

    // Listeners
    displayModeInput.on("change", updateVisibility);
    if (enableOverlayInput.length && enableBorderInput.length) {
        html.find(`[name="${moduleId}.fillType"]`).on("change", updateVisibility);
        html.find(`[name="${moduleId}.borderStyle"]`).on("change", updateVisibility);
        enableOverlayInput.on("change", updateVisibility);
        enableBorderInput.on("change", updateVisibility);
        updateVisibility(); // Initial check
    }
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
