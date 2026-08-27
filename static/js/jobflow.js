document.addEventListener("DOMContentLoaded", function () {

    console.log("JobFlow interface loaded successfully.");

});
/* =========================================================
   JOBFLOW — KANBAN DRAG & DROP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const cards =
            document.querySelectorAll(
                ".kanban-card"
            );

        const columns =
            document.querySelectorAll(
                ".kanban-column"
            );


        let draggedCard = null;


        cards.forEach(
            function (card) {

                card.addEventListener(
                    "dragstart",
                    function () {

                        draggedCard = this;

                        this.classList.add(
                            "dragging"
                        );

                    }
                );


                card.addEventListener(
                    "dragend",
                    function () {

                        this.classList.remove(
                            "dragging"
                        );

                        draggedCard = null;

                    }
                );

            }
        );


        columns.forEach(
            function (column) {

                column.addEventListener(
                    "dragover",
                    function (event) {

                        event.preventDefault();

                        this.classList.add(
                            "drag-over"
                        );

                    }
                );


                column.addEventListener(
                    "dragleave",
                    function () {

                        this.classList.remove(
                            "drag-over"
                        );

                    }
                );


                column.addEventListener(
                    "drop",
                    function (event) {

                        event.preventDefault();

                        this.classList.remove(
                            "drag-over"
                        );


                        if (!draggedCard) {
                            return;
                        }


                        const cardsContainer =
                            this.querySelector(
                                ".kanban-cards"
                            );


                        cardsContainer.appendChild(
                            draggedCard
                        );


                        const jobId =
                            draggedCard.dataset.jobId;

                        const newStatus =
                            this.dataset.status;


                        updateJobStatus(
                            jobId,
                            newStatus
                        );

                    }
                );

            }
        );

    }
);

/* =========================================================
   JOBFLOW KANBAN DRAG & DROP
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(
        ".pipeline-card"
    );

    const dropZones = document.querySelectorAll(
        ".pipeline-cards"
    );


    let draggedCard = null;


    /* -----------------------------------------------------
       DRAG START
       ----------------------------------------------------- */

    cards.forEach(function (card) {

        card.addEventListener(
            "dragstart",
            function () {

                draggedCard = card;

                card.classList.add(
                    "dragging"
                );

            }
        );


        card.addEventListener(
            "dragend",
            function () {

                card.classList.remove(
                    "dragging"
                );

                dropZones.forEach(
                    function (zone) {

                        zone.classList.remove(
                            "drag-over"
                        );

                    }
                );

            }
        );

    });


    /* -----------------------------------------------------
       DRAG OVER
       ----------------------------------------------------- */

    dropZones.forEach(function (zone) {

        zone.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                zone.classList.add(
                    "drag-over"
                );

            }
        );


        zone.addEventListener(
            "dragleave",
            function () {

                zone.classList.remove(
                    "drag-over"
                );

            }
        );


        /* -------------------------------------------------
           DROP
           ------------------------------------------------- */

        zone.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                zone.classList.remove(
                    "drag-over"
                );


                if (!draggedCard) {
                    return;
                }


                const jobId =
                    draggedCard.dataset.jobId;


                const newStatus =
                    zone.dataset.status;


                const oldStatus =
                    draggedCard
                        .closest(".pipeline-column")
                        .dataset.status;


                if (newStatus === oldStatus) {
                    return;
                }


                zone.appendChild(
                    draggedCard
                );


                updateJobStatus(
                    jobId,
                    newStatus,
                    draggedCard,
                    zone
                );

            }
        );

    });


    /* -----------------------------------------------------
       UPDATE DJANGO
       ----------------------------------------------------- */

    function updateJobStatus(
        jobId,
        newStatus,
        card,
        zone
    ) {

        const csrfToken =
            getCSRFToken();


        const formData =
            new FormData();

        formData.append(
            "status",
            newStatus
        );


        fetch(
            `/jobs/${jobId}/status/`,
            {
                method: "POST",

                headers: {
                    "X-CSRFToken":
                        csrfToken
                },

                body: formData
            }
        )

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Status update failed"
                );
            }

            return response.json();

        })

        .then(function (data) {

            if (data.success) {

                showJobFlowToast(
                    `Moved to ${data.status_label}`
                );

            }

        })

        .catch(function () {

            showJobFlowToast(
                "Could not update job status.",
                true
            );

            location.reload();

        });

    }


    /* -----------------------------------------------------
       CSRF TOKEN
       ----------------------------------------------------- */

    function getCSRFToken() {

        const cookies =
            document.cookie.split(";");


        for (
            let cookie of cookies
        ) {

            cookie =
                cookie.trim();


            if (
                cookie.startsWith(
                    "csrftoken="
                )
            ) {

                return decodeURIComponent(
                    cookie.substring(
                        "csrftoken=".length
                    )
                );

            }

        }


        return "";

    }


    /* -----------------------------------------------------
       TOAST NOTIFICATION
       ----------------------------------------------------- */

    function showJobFlowToast(
        message,
        error = false
    ) {

        const existing =
            document.querySelector(
                ".jobflow-toast"
            );


        if (existing) {
            existing.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "jobflow-toast";


        if (error) {

            toast.classList.add(
                "error"
            );

        }


        toast.innerHTML = `
            <span class="toast-icon">
                ${error ? "!" : "✓"}
            </span>

            <span>
                ${message}
            </span>
        `;


        document.body.appendChild(
            toast
        );


        setTimeout(
            function () {

                toast.classList.add(
                    "hide"
                );

                setTimeout(
                    function () {
                        toast.remove();
                    },
                    300
                );

            },
            2500
        );

    }

});
/* =========================================================
   JOBFLOW KANBAN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards =
        document.querySelectorAll(".job-card");

    const columns =
        document.querySelectorAll(".kanban-cards");


    let draggedCard = null;


    /* =====================================================
       DRAG START
       ===================================================== */

    cards.forEach(card => {

        card.addEventListener("dragstart", event => {

            draggedCard = card;

            card.classList.add("is-dragging");

            event.dataTransfer.effectAllowed = "move";

            event.dataTransfer.setData(
                "text/plain",
                card.dataset.jobId
            );

        });


        /* =================================================
           DRAG END
           ================================================= */

        card.addEventListener("dragend", () => {

            card.classList.remove(
                "is-dragging"
            );

            columns.forEach(column => {

                column.classList.remove(
                    "drag-over"
                );

            });

        });

    });


    /* =====================================================
       DRAG OVER
       ===================================================== */

    columns.forEach(column => {

        column.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                column.classList.add(
                    "drag-over"
                );

                event.dataTransfer.dropEffect =
                    "move";

            }
        );


        /* =================================================
           DRAG LEAVE
           ================================================= */

        column.addEventListener(
            "dragleave",
            event => {

                if (
                    !column.contains(
                        event.relatedTarget
                    )
                ) {

                    column.classList.remove(
                        "drag-over"
                    );

                }

            }
        );


        /* =================================================
           DROP
           ================================================= */

        column.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                column.classList.remove(
                    "drag-over"
                );


                if (!draggedCard) {
                    return;
                }


                const newStatus =
                    column.dataset.status;


                const oldStatus =
                    draggedCard
                        .closest(".kanban-cards")
                        ?.dataset.status;


                if (
                    !newStatus ||
                    newStatus === oldStatus
                ) {

                    return;

                }


                const statusUrl =
                    draggedCard.dataset.statusUrl;


                /* Move visually */

                column.appendChild(
                    draggedCard
                );


                /* Update database */

                updateJobStatus(
                    statusUrl,
                    newStatus,
                    draggedCard
                );

            }
        );

    });


    /* =====================================================
       UPDATE STATUS
       ===================================================== */

    async function updateJobStatus(
        url,
        status,
        card
    ) {

        const formData =
            new FormData();


        formData.append(
            "status",
            status
        );


        try {

            const response =
                await fetch(
                    url,
                    {
                        method: "POST",

                        headers: {
                            "X-CSRFToken":
                                getCSRFToken(),

                            "X-Requested-With":
                                "XMLHttpRequest"
                        },

                        body: formData
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to update job."
                );

            }


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.error ||
                    "Status update failed."
                );

            }


            showToast(
                `Application moved to ${data.status_label}`
            );


            updateColumnCounts();

        }


        catch (error) {

            console.error(error);


            showToast(
                "Could not update application.",
                true
            );


            /* Restore page state */

            setTimeout(
                () => {
                    window.location.reload();
                },
                800
            );

        }

    }


    /* =====================================================
       CSRF
       ===================================================== */

    function getCSRFToken() {

        const cookies =
            document.cookie.split(";");


        for (
            let cookie of cookies
        ) {

            cookie = cookie.trim();


            if (
                cookie.startsWith(
                    "csrftoken="
                )
            ) {

                return decodeURIComponent(
                    cookie.substring(
                        "csrftoken=".length
                    )
                );

            }

        }


        return "";

    }


    /* =====================================================
       UPDATE COLUMN COUNTS
       ===================================================== */

    function updateColumnCounts() {

        document
            .querySelectorAll(".kanban-column")
            .forEach(column => {

                const cards =
                    column.querySelectorAll(
                        ".job-card"
                    );


                const count =
                    column.querySelector(
                        ".kanban-count"
                    );


                if (count) {

                    count.textContent =
                        cards.length;

                }

            });

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(
        message,
        error = false
    ) {

        const oldToast =
            document.querySelector(
                ".jobflow-toast"
            );


        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "jobflow-toast";


        if (error) {

            toast.classList.add(
                "error"
            );

        }


        toast.innerHTML = `

            <span class="toast-icon">

                ${error ? "!" : "✓"}

            </span>

            <span>
                ${message}
            </span>

        `;


        document.body.appendChild(
            toast
        );


        setTimeout(
            () => {

                toast.classList.add(
                    "hide"
                );


                setTimeout(
                    () => toast.remove(),
                    300
                );

            },
            2500
        );

    }

});

/* =========================================================
   PIPELINE SEARCH & FILTERS
   ========================================================= */

const pipelineSearch =
    document.getElementById(
        "pipelineSearch"
    );


const pipelineFilters =
    document.querySelectorAll(
        ".pipeline-filter"
    );


let activePipelineFilter = "all";


function filterPipeline() {

    const search =
        pipelineSearch
            ? pipelineSearch.value
                .toLowerCase()
                .trim()
            : "";


    const cards =
        document.querySelectorAll(
            ".job-card"
        );


    cards.forEach(card => {

        const company =
            card.dataset.company || "";


        const position =
            card.dataset.position || "";


        const status =
            card
                .closest(".kanban-column")
                ?.dataset.status || "";


        const matchesSearch =
            !search ||
            company.includes(search) ||
            position.includes(search);


        const matchesFilter =
            activePipelineFilter === "all" ||
            status === activePipelineFilter;


        if (
            matchesSearch &&
            matchesFilter
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


if (pipelineSearch) {

    pipelineSearch.addEventListener(
        "input",
        filterPipeline
    );

}


pipelineFilters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            pipelineFilters.forEach(
                button => {
                    button.classList.remove(
                        "active"
                    );
                }
            );


            filter.classList.add(
                "active"
            );


            activePipelineFilter =
                filter.dataset.filter;


            filterPipeline();

        }
    );

});
