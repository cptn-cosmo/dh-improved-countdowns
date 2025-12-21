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
Hooks.on('daggerheart.refresh', (data) => {
    if (data.refreshType === "countdown" || data.refreshType === 4) { // 4 is RefreshType.Countdown in Daggerheart
        CountdownTrackerApp.instance?.render();
    }
});

// Generic socket refresh if system refresh doesn't catch everything
Hooks.on('refresh', (data) => {
    if (data.refreshType === "countdown") {
        CountdownTrackerApp.instance?.render();
    }
});
