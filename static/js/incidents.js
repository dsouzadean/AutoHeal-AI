/* ==========================================================
                    AutoHeal-AI
                    Incident Center
========================================================== */

async function loadIncidents(){

    try{

        const response = await fetch("/api/incidents");

        if(!response.ok){

            throw new Error("Unable to fetch incidents.");

        }

        const incidents = await response.json();

        const tbody =
            document.querySelector("#incidentTable tbody");

        if(!tbody) return;

        tbody.innerHTML = "";

        /* ==========================================
                    SUMMARY CARDS
        ========================================== */

        document.getElementById("totalIncidents").textContent =
            incidents.length;

        document.getElementById("cardIncidents").textContent =
            incidents.length;

        let critical = 0;

        incidents.forEach(item=>{

            const level =
                String(item.prediction || "")
                .toUpperCase();

            if(

                level.includes("CRITICAL") ||

                level.includes("HIGH")

            ){

                critical++;

            }

        });

        document.getElementById("criticalIncidents").textContent =
            critical;

        /* ==========================================
                    EMPTY TABLE
        ========================================== */

        if(incidents.length===0){

            tbody.innerHTML = `

                <tr>

                    <td colspan="6">

                        No incidents detected.

                    </td>

                </tr>

            `;

            return;

        }
                /* ==========================================
                    INCIDENT TABLE
        ========================================== */

        incidents.forEach(row=>{

            let badgeClass = "info";

            const status =
                String(row.status || "").toUpperCase();

            const prediction =
                String(row.prediction || "").toUpperCase();

            if(

                status.includes("RESOLVED")

            ){

                badgeClass = "success";

            }

            else if(

                prediction.includes("CRITICAL")

            ){

                badgeClass = "danger";

            }

            else if(

                prediction.includes("HIGH")

            ){

                badgeClass = "danger";

            }

            else if(

                prediction.includes("MEDIUM")

            ){

                badgeClass = "warning";

            }

            else{

                badgeClass = "info";

            }

            tbody.innerHTML += `

                <tr>

                    <td>

                        ${row.time}

                    </td>

                    <td>

                        ${row.prediction}

                    </td>

                    <td>

                        ${row.confidence}%

                    </td>

                    <td>

                        ${row.root_cause}

                    </td>

                    <td>

                        ${row.action}

                    </td>

                    <td>

                        <span class="status ${badgeClass}">

                            ${row.status}

                        </span>

                    </td>

                </tr>

            `;

        });

    }

    catch(error){

        console.error(

            "Incident Error:",

            error

        );

    }

}
/* ==========================================================
                    Initialize Page
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        /* Initial Load */

        await loadIncidents();

        /* ==========================================
                Refresh Every 5 Seconds
        ========================================== */

        setInterval(

            async()=>{

                await loadIncidents();

            },

            5000

        );

    }

);

/* ==========================================================
                    Page Visibility
========================================================== */

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            console.log(

                "Incident monitoring paused."

            );

        }

        else{

            loadIncidents();

        }

    }

);

/* ==========================================================
                    Utilities
========================================================== */

function updateElement(id,value){

    const element = document.getElementById(id);

    if(element){

        element.textContent = value;

    }

}

function formatPercentage(value){

    return Number(value).toFixed(1) + "%";

}

