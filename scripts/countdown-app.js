const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CountdownTrackerApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static instance;

    constructor(options = {}) {
        super(options);
        this._dragData = {
            isDragging: false,
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0
        };
    }

    static DEFAULT_OPTIONS = {
        id: "dh-improved-countdowns-app",
        tag: "aside",
        classes: ["dh-improved-countdowns"],
        window: {
            frame: false,
            positioned: true,
        },
        position: {
            width: "auto",
            height: "auto",
        },
        actions: {
            increaseCountdown: CountdownTrackerApp.#onIncrease,
            decreaseCountdown: CountdownTrackerApp.#onDecrease,
            addCountdown: CountdownTrackerApp.#onAdd,
            toggleViewMode: CountdownTrackerApp.#onToggleView,
            toggleLock: CountdownTrackerApp.#onToggleLock
        }
    };

    static PARTS = {
        content: {
            template: "modules/dh-improved-countdowns/templates/countdown-tracker.hbs",
        },
    };

    static initialize() {
        this.instance = new CountdownTrackerApp();
        const pos = game.settings.get("dh-improved-countdowns", "position");
        this.instance.render(true, { position: pos });
    }

    async _prepareContext(options) {
        const isGM = game.user.isGM;
        const isMinimized = game.settings.get("dh-improved-countdowns", "minimized");
        const isLocked = game.settings.get("dh-improved-countdowns", "locked");

        // Fetch countdowns from system settings
        const systemCountdownSetting = game.settings.get("daggerheart", "countdowns");
        const countdowns = {};

        if (systemCountdownSetting && systemCountdownSetting.countdowns) {
            for (const [id, countdown] of Object.entries(systemCountdownSetting.countdowns)) {
                const ownership = this.#getPlayerOwnership(game.user, systemCountdownSetting, countdown);
                if (ownership !== CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE) {
                    countdowns[id] = {
                        ...countdown,
                        editable: isGM || ownership === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
                    };
                }
            }
        }

        return {
            countdowns,
            isGM,
            isMinimized,
            isLocked
        };
    }

    #getPlayerOwnership(user, setting, countdown) {
        const playerOwnership = countdown.ownership[user.id];
        return playerOwnership === undefined || playerOwnership === CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT
            ? setting.defaultOwnership
            : playerOwnership;
    }

    static async #onIncrease(event, target) {
        const id = target.dataset.id;
        Hooks.call("editCountdown", true, { id });
        // The Daggerheart system has a static method for this, let's try to use it if available
        if (typeof game.system.api.applications.ui.DhCountdowns?.editCountdown === "function") {
            await game.system.api.applications.ui.DhCountdowns.editCountdown(true, { id });
        }
    }

    static async #onDecrease(event, target) {
        const id = target.dataset.id;
        if (typeof game.system.api.applications.ui.DhCountdowns?.editCountdown === "function") {
            await game.system.api.applications.ui.DhCountdowns.editCountdown(false, { id });
        }
    }

    static async #onAdd(event, target) {
        if (!game.user.isGM) return;
        if (game.system.api.applications.ui.CountdownEdit) {
            new game.system.api.applications.ui.CountdownEdit().render(true);
        }
    }

    static async #onToggleView(event, target) {
        const current = game.settings.get("dh-improved-countdowns", "minimized");
        await game.settings.set("dh-improved-countdowns", "minimized", !current);
        this.instance.render();
    }

    static async #onToggleLock(event, target) {
        const current = game.settings.get("dh-improved-countdowns", "locked");
        await game.settings.set("dh-improved-countdowns", "locked", !current);
        this.instance.render();
    }

    _onRender(context, options) {
        this.#setupDragging();
    }

    #setupDragging() {
        if (game.settings.get("dh-improved-countdowns", "locked")) return;

        const dragHandle = this.element.querySelector('.drag-handle');
        if (!dragHandle) return;

        dragHandle.addEventListener('mousedown', this.#onDragStart.bind(this));
    }

    #onDragStart(e) {
        if (e.button !== 0) return;

        this._dragData.isDragging = true;
        this._dragData.startX = e.clientX;
        this._dragData.startY = e.clientY;

        const rect = this.element.getBoundingClientRect();
        this._dragData.startLeft = rect.left;
        this._dragData.startTop = rect.top;

        this.element.style.cursor = 'grabbing';

        window.addEventListener('mousemove', this.#onDragging.bind(this));
        window.addEventListener('mouseup', this.#onDragEnd.bind(this));
    }

    #onDragging(e) {
        if (!this._dragData.isDragging) return;

        const dx = e.clientX - this._dragData.startX;
        const dy = e.clientY - this._dragData.startY;

        const newLeft = this._dragData.startLeft + dx;
        const newTop = this._dragData.startTop + dy;

        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;
    }

    #onDragEnd() {
        if (!this._dragData.isDragging) return;
        this._dragData.isDragging = false;
        this.element.style.cursor = '';

        window.removeEventListener('mousemove', this.#onDragging.bind(this));
        window.removeEventListener('mouseup', this.#onDragEnd.bind(this));

        const rect = this.element.getBoundingClientRect();
        const pos = {
            top: rect.top,
            left: rect.left
        };

        this.position.top = pos.top;
        this.position.left = pos.left;

        game.settings.set("dh-improved-countdowns", "position", pos);
    }
}
