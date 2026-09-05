/* =========================================================
   JOBFLOW — PROFESSIONAL APPLICATION JAVASCRIPT
   Version: 4.0
   =========================================================

   Features:
   - Global UI initialization
   - Toast notifications
   - CSRF protection
   - Kanban drag & drop
   - AJAX status updates
   - Pipeline search & filtering
   - Column counters
   - Delete confirmations
   - Loading states
   - Dashboard charts
   - Analytics charts
   - Responsive navigation
   - Accessibility helpers

   ========================================================= */


/* =========================================================
   1. GLOBAL JOBFLOW OBJECT
   ========================================================= */

const JobFlow = {

    /* -----------------------------------------------------
       STATE
       ----------------------------------------------------- */

    draggedCard: null,

    activePipelineFilter: "all",

    toastTimer: null,


    /* =====================================================
       INITIALIZE
       ===================================================== */

    init() {

        console.log(
            "JobFlow interface loaded successfully."
        );

        this.initKanban();

        this.initPipelineSearch();

        this.initDeleteConfirmation();

        this.initLoadingButtons();

        this.initDismissibleAlerts();

        this.initKeyboardShortcuts();

        this.initCharts();

        this.initMobileNavigation();

        this.initAutoFocus();

        this.initExternalLinks();

    },


    /* =====================================================
       2. CSRF TOKEN
       ===================================================== */

    getCSRFToken() {

        const cookieName = "csrftoken=";

        const cookies =
            document.cookie.split(";");

        for (let cookie of cookies) {

            cookie = cookie.trim();

            if (cookie.startsWith(cookieName)) {

                return decodeURIComponent(
                    cookie.substring(
                        cookieName.length
                    )
                );

            }

        }

        return "";

    },


    /* =====================================================
       3. TOAST SYSTEM
       ===================================================== */

    showToast(message, type = "success") {

        /* Remove existing toast */

        const existing =
            document.querySelector(
                ".jobflow-toast"
            );

        if (existing) {

            existing.classList.add("hide");

            setTimeout(() => {
                existing.remove();
            }, 200);

        }


        /* Clear previous timer */

        if (this.toastTimer) {

            clearTimeout(
                this.toastTimer
            );

        }


        /* Create toast */

        const toast =
            document.createElement("div");

        toast.className =
            "jobflow-toast";


        /* Toast types */

        if (type === "error") {

            toast.classList.add("error");

        }

        if (type === "warning") {

            toast.classList.add("warning");

        }

        if (type === "info") {

            toast.classList.add("info");

        }


        /* Icons */

        const icons = {

            success: "✓",

            error: "!",

            warning: "⚠",

            info: "i"

        };


        const icon =
            icons[type] || icons.success;


        toast.innerHTML = `

            <span class="toast-icon">
                ${icon}
            </span>

            <span class="toast-message">
                ${this.escapeHTML(message)}
            </span>

            <button
                type="button"
                class="toast-close"
                aria-label="Close notification"
            >
                ×
            </button>

        `;


        document.body.appendChild(
            toast
        );


        /* Close button */

        const close =
            toast.querySelector(
                ".toast-close"
            );

        if (close) {

            close.addEventListener(
                "click",
                () => this.removeToast(toast)
            );

        }


        /* Animate in */

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });


        /* Auto remove */

        this.toastTimer =
            setTimeout(() => {

                this.removeToast(toast);

            }, 3500);

    },


    /* -----------------------------------------------------
       REMOVE TOAST
       ----------------------------------------------------- */

    removeToast(toast) {

        if (!toast) {
            return;
        }

        toast.classList.add("hide");

        setTimeout(() => {

            if (toast.parentNode) {

                toast.remove();

            }

        }, 300);

    },


    /* =====================================================
       4. SAFE HTML ESCAPE
       ===================================================== */

    escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;

    },


    /* =====================================================
       5. KANBAN SYSTEM
       ===================================================== */

    initKanban() {

        const cards =
            document.querySelectorAll(
                ".job-card, .kanban-card, .pipeline-card"
            );


        const dropZones =
            document.querySelectorAll(
                ".kanban-cards, .pipeline-cards"
            );


        const columns =
            document.querySelectorAll(
                ".kanban-column, .pipeline-column"
            );


        /* Nothing to initialize */

        if (
            !cards.length &&
            !dropZones.length
        ) {

            return;

        }


        /* -------------------------------------------------
           MAKE CARDS DRAGGABLE
           ------------------------------------------------- */

        cards.forEach(card => {

            card.setAttribute(
                "draggable",
                "true"
            );


            /* DRAG START */

            card.addEventListener(
                "dragstart",
                event => {

                    this.draggedCard =
                        card;


                    card.classList.add(
                        "dragging",
                        "is-dragging"
                    );


                    event.dataTransfer.effectAllowed =
                        "move";


                    event.dataTransfer.setData(
                        "text/plain",
                        card.dataset.jobId || ""
                    );


                    document.body.classList.add(
                        "jobflow-dragging"
                    );

                }
            );


            /* DRAG END */

            card.addEventListener(
                "dragend",
                () => {

                    card.classList.remove(
                        "dragging",
                        "is-dragging"
                    );


                    this.clearDropZones();


                    this.draggedCard =
                        null;


                    document.body.classList.remove(
                        "jobflow-dragging"
                    );

                }
            );

        });


        /* -------------------------------------------------
           DROP ZONES
           ------------------------------------------------- */

        dropZones.forEach(zone => {


            /* DRAG OVER */

            zone.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();


                    if (
                        !this.draggedCard
                    ) {

                        return;

                    }


                    event.dataTransfer.dropEffect =
                        "move";


                    zone.classList.add(
                        "drag-over"
                    );

                }
            );


            /* DRAG ENTER */

            zone.addEventListener(
                "dragenter",
                event => {

                    event.preventDefault();

                    zone.classList.add(
                        "drag-over"
                    );

                }
            );


            /* DRAG LEAVE */

            zone.addEventListener(
                "dragleave",
                event => {

                    if (
                        !zone.contains(
                            event.relatedTarget
                        )
                    ) {

                        zone.classList.remove(
                            "drag-over"
                        );

                    }

                }
            );


            /* DROP */

            zone.addEventListener(
                "drop",
                event => {

                    event.preventDefault();


                    zone.classList.remove(
                        "drag-over"
                    );


                    const card =
                        this.draggedCard;


                    if (!card) {

                        return;

                    }


                    /* Determine new status */

                    const newStatus =
                        zone.dataset.status;


                    if (!newStatus) {

                        return;

                    }


                    /* Determine old status */

                    const oldContainer =
                        card.closest(
                            ".kanban-cards, .pipeline-cards"
                        );


                    const oldStatus =
                        oldContainer?.dataset.status ||
                        card.dataset.status ||
                        "";


                    /* Already in same column */

                    if (
                        oldStatus ===
                        newStatus
                    ) {

                        return;

                    }


                    /* Store original position */

                    const originalParent =
                        card.parentElement;

                    const originalNextSibling =
                        card.nextElementSibling;


                    /* Move visually */

                    zone.appendChild(
                        card
                    );


                    /* Update */

                    const statusUrl =
                        card.dataset.statusUrl ||
                        `/jobs/${card.dataset.jobId}/status/`;


                    this.updateJobStatus(

                        statusUrl,

                        newStatus,

                        card,

                        originalParent,

                        originalNextSibling

                    );

                }
            );

        });


        /* -------------------------------------------------
           COLUMN EVENTS
           ------------------------------------------------- */

        columns.forEach(column => {

            column.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();

                }
            );

        });


        /* Initial counts */

        this.updateColumnCounts();

        this.updateKanbanEmptyStates();

    },


    /* =====================================================
       6. UPDATE JOB STATUS
       ===================================================== */

    async updateJobStatus(
        url,
        newStatus,
        card,
        originalParent = null,
        originalNextSibling = null
    ) {

        if (!url || !newStatus) {

            return;

        }


        /* Prevent duplicate updates */

        if (
            card.dataset.updating ===
            "true"
        ) {

            return;

        }


        card.dataset.updating =
            "true";


        card.classList.add(
            "status-updating"
        );


        /* Form data */

        const formData =
            new FormData();

        formData.append(
            "status",
            newStatus
        );


        try {

            const response =
                await fetch(
                    url,
                    {
                        method: "POST",

                        headers: {

                            "X-CSRFToken":
                                this.getCSRFToken(),

                            "X-Requested-With":
                                "XMLHttpRequest",

                            "Accept":
                                "application/json"

                        },

                        body:
                            formData,

                        credentials:
                            "same-origin"
                    }
                );


            /* HTTP error */

            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            /* Django error */

            if (!data.success) {

                throw new Error(
                    data.error ||
                    "Status update failed."
                );

            }


            /* Update local status */

            card.dataset.status =
                newStatus;


            /* Update badge */

            this.updateCardStatusBadge(
                card,
                newStatus,
                data.status_label
            );


            /* Update counts */

            this.updateColumnCounts();

            this.updateKanbanEmptyStates();


            /* Re-run filters */

            this.filterPipeline();


            /* Success message */

            this.showToast(

                `Application moved to ${
                    data.status_label ||
                    this.formatStatus(newStatus)
                }`,

                "success"

            );

        }


        catch (error) {

            console.error(
                "JobFlow status update error:",
                error
            );


            /* Restore card */

            if (
                originalParent
            ) {

                if (
                    originalNextSibling &&
                    originalNextSibling.parentNode ===
                    originalParent
                ) {

                    originalParent.insertBefore(
                        card,
                        originalNextSibling
                    );

                } else {

                    originalParent.appendChild(
                        card
                    );

                }

            }


            this.showToast(
                "Could not update the application status. Please try again.",
                "error"
            );


            this.updateColumnCounts();

            this.updateKanbanEmptyStates();

        }


        finally {

            card.dataset.updating =
                "false";

            card.classList.remove(
                "status-updating"
            );

        }

    },


    /* =====================================================
       7. UPDATE STATUS BADGE
       ===================================================== */

    updateCardStatusBadge(
        card,
        status,
        label = null
    ) {

        const badge =
            card.querySelector(
                ".status, .status-badge"
            );


        if (!badge) {

            return;

        }


        /* Remove previous status classes */

        badge.classList.remove(

            "saved",
            "applied",
            "screening",
            "interview",
            "offer",
            "rejected",

            "status-saved",
            "status-applied",
            "status-screening",
            "status-interview",
            "status-offer",
            "status-rejected"

        );


        /* Add new status */

        badge.classList.add(
            status
        );


        /* Update text */

        if (label) {

            badge.textContent =
                label;

        }

    },


    /* =====================================================
       8. COLUMN COUNTS
       ===================================================== */

    updateColumnCounts() {

        const columns =
            document.querySelectorAll(
                ".kanban-column, .pipeline-column"
            );


        columns.forEach(column => {

            const container =
                column.querySelector(
                    ".kanban-cards, .pipeline-cards"
                );


            if (!container) {

                return;

            }


            const cards =
                container.querySelectorAll(
                    ".job-card, .kanban-card, .pipeline-card"
                );


            const count =
                column.querySelector(
                    ".kanban-count, .pipeline-count"
                );


            if (count) {

                count.textContent =
                    cards.length;

            }

        });

    },


    /* =====================================================
       9. EMPTY KANBAN COLUMNS
       ===================================================== */

    updateKanbanEmptyStates() {

        const columns =
            document.querySelectorAll(
                ".kanban-column, .pipeline-column"
            );


        columns.forEach(column => {

            const container =
                column.querySelector(
                    ".kanban-cards, .pipeline-cards"
                );


            if (!container) {

                return;

            }


            const cards =
                container.querySelectorAll(
                    ".job-card, .kanban-card, .pipeline-card"
                );


            let emptyState =
                container.querySelector(
                    ".kanban-empty.dynamic-empty"
                );


            if (!cards.length) {

                if (!emptyState) {

                    emptyState =
                        document.createElement(
                            "div"
                        );

                    emptyState.className =
                        "kanban-empty dynamic-empty";

                    emptyState.innerHTML = `
                        <span>
                            No applications here yet
                        </span>
                    `;

                    container.appendChild(
                        emptyState
                    );

                }

            } else {

                if (emptyState) {

                    emptyState.remove();

                }

            }

        });

    },


    /* =====================================================
       10. CLEAR DROP ZONES
       ===================================================== */

    clearDropZones() {

        document
            .querySelectorAll(
                ".drag-over"
            )
            .forEach(element => {

                element.classList.remove(
                    "drag-over"
                );

            });

    },


    /* =====================================================
       11. PIPELINE SEARCH
       ===================================================== */

    initPipelineSearch() {

        const searchInput =
            document.getElementById(
                "pipelineSearch"
            );


        const filters =
            document.querySelectorAll(
                ".pipeline-filter"
            );


        if (
            !searchInput &&
            !filters.length
        ) {

            return;

        }


        /* Search */

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                () => {

                    this.filterPipeline();

                }
            );

        }


        /* Filters */

        filters.forEach(filter => {

            filter.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    filters.forEach(
                        button => {

                            button.classList.remove(
                                "active"
                            );

                        }
                    );


                    filter.classList.add(
                        "active"
                    );


                    this.activePipelineFilter =
                        filter.dataset.filter ||
                        "all";


                    this.filterPipeline();

                }
            );

        });


        this.filterPipeline();

    },


    /* =====================================================
       12. FILTER PIPELINE
       ===================================================== */

    filterPipeline() {

        const searchInput =
            document.getElementById(
                "pipelineSearch"
            );


        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const cards =
            document.querySelectorAll(
                ".job-card, .kanban-card, .pipeline-card"
            );


        let visibleCount = 0;


        cards.forEach(card => {

            const company =
                (
                    card.dataset.company ||
                    card.querySelector(
                        ".job-company-name, .job-card-company, .company-name"
                    )?.textContent ||
                    ""
                )
                .toLowerCase();


            const position =
                (
                    card.dataset.position ||
                    card.querySelector(
                        ".job-position, .position-name"
                    )?.textContent ||
                    ""
                )
                .toLowerCase();


            const status =
                card.closest(
                    ".kanban-column, .pipeline-column"
                )?.dataset.status ||
                card.dataset.status ||
                "";


            const matchesSearch =

                !search ||

                company.includes(search) ||

                position.includes(search);


            const matchesFilter =

                this.activePipelineFilter ===
                "all" ||

                status ===
                this.activePipelineFilter;


            const visible =
                matchesSearch &&
                matchesFilter;


            card.style.display =
                visible ? "" : "none";


            if (visible) {

                visibleCount++;

            }

        });


        /* Search result indicator */

        const resultCount =
            document.querySelector(
                ".pipeline-result-count"
            );


        if (resultCount) {

            resultCount.textContent =
                `${visibleCount} ${
                    visibleCount === 1
                        ? "application"
                        : "applications"
                }`;

        }

    },


    /* =====================================================
       13. STATUS FORMATTER
       ===================================================== */

    formatStatus(status) {

        if (!status) {

            return "Updated";

        }


        return status
            .replace(/[-_]/g, " ")
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );

    },


    /* =====================================================
       14. DELETE CONFIRMATION
       ===================================================== */

    initDeleteConfirmation() {

        const deleteButtons =
            document.querySelectorAll(
                "[data-delete-confirm], .delete-job-btn"
            );


        deleteButtons.forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    const message =
                        button.dataset.deleteConfirm ||
                        "Are you sure you want to delete this application? This action cannot be undone.";


                    if (
                        !window.confirm(
                            message
                        )
                    ) {

                        event.preventDefault();

                    }

                }
            );

        });

    },


    /* =====================================================
       15. BUTTON LOADING STATES
       ===================================================== */

    initLoadingButtons() {

        const forms =
            document.querySelectorAll(
                "form[data-loading-form]"
            );


        forms.forEach(form => {

            form.addEventListener(
                "submit",
                () => {

                    const button =
                        form.querySelector(
                            "button[type='submit'], input[type='submit']"
                        );


                    if (!button) {

                        return;

                    }


                    button.disabled =
                        true;


                    button.classList.add(
                        "is-loading"
                    );


                    const originalText =
                        button.innerHTML;


                    button.dataset.originalText =
                        originalText;


                    button.innerHTML = `

                        <span
                            class="button-spinner"
                            aria-hidden="true"
                        ></span>

                        Processing...

                    `;

                }
            );

        });

    },


    /* =====================================================
       16. DISMISSIBLE ALERTS
       ===================================================== */

    initDismissibleAlerts() {

        const alerts =
            document.querySelectorAll(
                ".alert"
            );


        alerts.forEach(alert => {

            const closeButton =
                alert.querySelector(
                    ".alert-close"
                );


            if (closeButton) {

                closeButton.addEventListener(
                    "click",
                    () => {

                        alert.classList.add(
                            "alert-closing"
                        );


                        setTimeout(
                            () => {
                                alert.remove();
                            },
                            250
                        );

                    }
                );

            }

        });

    },


    /* =====================================================
       17. KEYBOARD SHORTCUTS
       ===================================================== */

    initKeyboardShortcuts() {

        document.addEventListener(
            "keydown",
            event => {

                /* Don't trigger while typing */

                const tag =
                    event.target.tagName
                        ?.toLowerCase();


                if (
                    tag === "input" ||
                    tag === "textarea" ||
                    tag === "select"
                ) {

                    return;

                }


                /* N = new job */

                if (
                    event.key.toLowerCase() ===
                    "n"
                ) {

                    const addJob =
                        document.querySelector(
                            "a[href*='/jobs/add/']"
                        );


                    if (addJob) {

                        window.location.href =
                            addJob.href;

                    }

                }


                /* Escape closes overlays */

                if (
                    event.key ===
                    "Escape"
                ) {

                    this.clearDropZones();

                    document
                        .querySelectorAll(
                            ".jobflow-toast"
                        )
                        .forEach(
                            toast =>
                                this.removeToast(
                                    toast
                                )
                        );

                }

            }
        );

    },


    /* =====================================================
       18. DASHBOARD & ANALYTICS CHARTS
       ===================================================== */

    initCharts() {

        /*
         * Chart.js is optional.
         *
         * If Chart.js isn't loaded, JobFlow
         * simply continues normally.
         */

        if (
            typeof Chart ===
            "undefined"
        ) {

            return;

        }


        this.initStatusChart();

        this.initPipelineChart();

        this.initTrendChart();

        this.initAnalyticsCharts();

    },


    /* =====================================================
       19. STATUS DOUGHNUT CHART
       ===================================================== */

    initStatusChart() {

        const canvas =
            document.getElementById(
                "statusDistributionChart"
            );


        if (!canvas) {

            return;

        }


        const dataElement =
            document.getElementById(
                "status-chart-data"
            );


        if (!dataElement) {

            return;

        }


        let chartData;


        try {

            chartData =
                JSON.parse(
                    dataElement.textContent
                );

        }

        catch (error) {

            console.error(
                "Unable to read status chart data.",
                error
            );

            return;

        }


        const ctx =
            canvas.getContext("2d");


        new Chart(
            ctx,
            {

                type: "doughnut",

                data: {

                    labels:
                        chartData.labels || [],

                    datasets: [

                        {

                            data:
                                chartData.values || [],

                            backgroundColor: [

                                "#6366f1",

                                "#3b82f6",

                                "#a855f7",

                                "#22c55e",

                                "#14b8a6",

                                "#ef4444"

                            ],

                            borderWidth: 0,

                            hoverOffset: 8

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "70%",

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            padding: 12,

                            cornerRadius: 10,

                            displayColors: true,

                            callbacks: {

                                label:
                                    context => {

                                        const
                                            value =
                                                context.raw;

                                        return ` ${context.label}: ${value}`;

                                    }

                            }

                        }

                    },

                    animation: {

                        duration: 900,

                        easing: "easeOutQuart"

                    }

                }

            }

        );

    },


    /* =====================================================
       20. PIPELINE BAR CHART
       ===================================================== */

    initPipelineChart() {

        const canvas =
            document.getElementById(
                "pipelineChart"
            );


        if (!canvas) {

            return;

        }


        const dataElement =
            document.getElementById(
                "pipeline-chart-data"
            );


        if (!dataElement) {

            return;

        }


        let chartData;


        try {

            chartData =
                JSON.parse(
                    dataElement.textContent
                );

        }

        catch (error) {

            console.error(
                "Unable to read pipeline chart data.",
                error
            );

            return;

        }


        const ctx =
            canvas.getContext("2d");


        new Chart(
            ctx,
            {

                type: "bar",

                data: {

                    labels:
                        chartData.labels || [],

                    datasets: [

                        {

                            label:
                                "Applications",

                            data:
                                chartData.values || [],

                            backgroundColor:
                                "#6366f1",

                            borderRadius: 8,

                            borderSkipped: false,

                            maxBarThickness: 42

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0,

                                color: "#94a3b8",

                                font: {

                                    size: 11

                                }

                            },

                            grid: {

                                color:
                                    "rgba(148, 163, 184, 0.14)",

                                drawBorder: false

                            }

                        },

                        x: {

                            ticks: {

                                color: "#64748b",

                                font: {

                                    size: 11,

                                    weight: "600"

                                }

                            },

                            grid: {

                                display: false

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            padding: 12,

                            cornerRadius: 10

                        }

                    },

                    animation: {

                        duration: 800,

                        easing: "easeOutQuart"

                    }

                }

            }

        );

    },


    /* =====================================================
       21. APPLICATION TREND CHART
       ===================================================== */

    initTrendChart() {

        const canvas =
            document.getElementById(
                "applicationTrendChart"
            );


        if (!canvas) {

            return;

        }


        const dataElement =
            document.getElementById(
                "trend-chart-data"
            );


        if (!dataElement) {

            return;

        }


        let chartData;


        try {

            chartData =
                JSON.parse(
                    dataElement.textContent
                );

        }

        catch (error) {

            console.error(
                "Unable to read trend chart data.",
                error
            );

            return;

        }


        const ctx =
            canvas.getContext("2d");


        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                320
            );


        gradient.addColorStop(
            0,
            "rgba(99, 102, 241, 0.20)"
        );


        gradient.addColorStop(
            1,
            "rgba(99, 102, 241, 0)"
        );


        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels:
                        chartData.labels || [],

                    datasets: [

                        {

                            label:
                                "Applications",

                            data:
                                chartData.values || [],

                            borderColor:
                                "#6366f1",

                            backgroundColor:
                                gradient,

                            fill: true,

                            tension: 0.4,

                            borderWidth: 3,

                            pointRadius: 4,

                            pointHoverRadius: 7,

                            pointBackgroundColor:
                                "#ffffff",

                            pointBorderColor:
                                "#6366f1",

                            pointBorderWidth: 2

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0,

                                color: "#94a3b8"

                            },

                            grid: {

                                color:
                                    "rgba(148, 163, 184, 0.12)",

                                drawBorder: false

                            }

                        },

                        x: {

                            ticks: {

                                color: "#64748b"

                            },

                            grid: {

                                display: false

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            padding: 12,

                            cornerRadius: 10,

                            displayColors: false

                        }

                    }

                }

            }

        );

    },


    /* =====================================================
       22. ANALYTICS CHARTS
       ===================================================== */

    initAnalyticsCharts() {

        const canvases =
            document.querySelectorAll(
                "[data-chart]"
            );


        canvases.forEach(canvas => {

            /*
             * Allows future analytics pages
             * to declare charts through:
             *
             * data-chart="bar"
             * data-chart="line"
             * data-chart="doughnut"
             */

            const type =
                canvas.dataset.chart;


            const dataId =
                canvas.dataset.chartData;


            if (
                !type ||
                !dataId
            ) {

                return;

            }


            const dataElement =
                document.getElementById(
                    dataId
                );


            if (!dataElement) {

                return;

            }


            let chartData;


            try {

                chartData =
                    JSON.parse(
                        dataElement.textContent
                    );

            }

            catch {

                return;

            }


            const ctx =
                canvas.getContext("2d");


            const config = {

                type: type,

                data: {

                    labels:
                        chartData.labels || [],

                    datasets:
                        chartData.datasets || []

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                usePointStyle: true,

                                padding: 18

                            }

                        }

                    }

                }

            };


            new Chart(
                ctx,
                config
            );

        });

    },


    /* =====================================================
       23. MOBILE NAVIGATION
       ===================================================== */

    initMobileNavigation() {

        const toggle =
            document.querySelector(
                "[data-sidebar-toggle]"
            );


        const sidebar =
            document.querySelector(
                ".jobflow-sidebar"
            );


        if (
            !toggle ||
            !sidebar
        ) {

            return;

        }


        toggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "sidebar-open"
                );

            }
        );


        /* Close sidebar after navigation */

        sidebar
            .querySelectorAll(
                "a"
            )
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        document.body.classList.remove(
                            "sidebar-open"
                        );

                    }
                );

            });

    },


    /* =====================================================
       24. AUTO FOCUS
       ===================================================== */

    initAutoFocus() {

        const autofocus =
            document.querySelector(
                "[autofocus]"
            );


        if (
            autofocus &&
            window.innerWidth > 650
        ) {

            setTimeout(
                () => {

                    autofocus.focus();

                },
                150
            );

        }

    },


    /* =====================================================
       25. EXTERNAL LINKS
       ===================================================== */

    initExternalLinks() {

        document
            .querySelectorAll(
                'a[target="_blank"]'
            )
            .forEach(link => {

                const currentRel =
                    link.getAttribute(
                        "rel"
                    ) || "";


                if (
                    !currentRel.includes(
                        "noopener"
                    )
                ) {

                    link.setAttribute(
                        "rel",
                        `${currentRel} noopener noreferrer`.trim()
                    );

                }

            });

    }

};


/* =========================================================
   26. DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        JobFlow.init();

    }
);


/* =========================================================
   27. GLOBAL HELPERS
   =========================================================

   These aliases allow existing templates or older
   scripts to continue working.

   ========================================================= */

function updateJobStatus(
    url,
    status,
    card = null
) {

    const targetCard =
        card ||
        JobFlow.draggedCard;


    if (!targetCard) {

        return;

    }


    JobFlow.updateJobStatus(
        url,
        status,
        targetCard
    );

}


function showJobFlowToast(
    message,
    error = false
) {

    JobFlow.showToast(
        message,
        error
            ? "error"
            : "success"
    );

}


function showToast(
    message,
    error = false
) {

    JobFlow.showToast(
        message,
        error
            ? "error"
            : "success"
    );

}


/* =========================================================
   28. PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            document.body.classList.add(
                "page-hidden"
            );

        } else {

            document.body.classList.remove(
                "page-hidden"
            );

        }

    }
);
