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
