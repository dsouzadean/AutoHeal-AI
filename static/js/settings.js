/* ==========================================================
                    AutoHeal-AI Settings
========================================================== */

let recoveryEnabled = false;

/* ==========================================================
                    Load Settings
========================================================== */

async function loadSettings(){

    try{

        const response = await fetch(

            "/api/recovery-status"

        );

        if(!response.ok){

            throw new Error(

                "Unable to fetch settings."

            );

        }

        const data = await response.json();

        recoveryEnabled = data.enabled;

        /* ==========================================
                    Recovery Status
        ========================================== */

        const statusText =

            document.getElementById(

                "autoRecoveryStatus"

            );

        statusText.textContent =

            recoveryEnabled

            ? "Enabled"

            : "Disabled";

        /* ==========================================
                    Configuration Table
        ========================================== */

        document.getElementById(

            "configRecovery"

        ).textContent =

            recoveryEnabled

            ? "Enabled"

            : "Disabled";

        /* ==========================================
                    Toggle Button
        ========================================== */

        const btn =

            document.getElementById(

                "toggleRecoveryBtn"

            );

        if(recoveryEnabled){

            btn.textContent =

                "Disable Recovery";

            btn.style.background =

                "linear-gradient(135deg,#DC2626,#EF4444)";

        }

        else{

            btn.textContent =

                "Enable Recovery";

            btn.style.background =

                "linear-gradient(135deg,#16A34A,#22C55E)";

        }

    }

    catch(error){

        console.error(

            "Settings Error:",

            error

        );

    }

}
/* ==========================================================
                    Toggle Recovery
========================================================== */

async function toggleRecovery(){

    try{

        const response = await fetch(

            "/api/toggle-recovery",

            {

                method:"POST"

            }

        );

        if(!response.ok){

            throw new Error(

                "Unable to toggle recovery."

            );

        }

        await loadSettings();

    }

    catch(error){

        console.error(

            "Toggle Error:",

            error

        );

    }

}

/* ==========================================================
                    Refresh Interval
========================================================== */

document.getElementById(

    "refreshInterval"

).addEventListener(

    "change",

    function(){

        document.getElementById(

            "configRefresh"

        ).textContent =

            this.value + " Seconds";

    }

);

/* ==========================================================
                    CPU Threshold
========================================================== */

document.getElementById(

    "cpuThreshold"

).addEventListener(

    "input",

    function(){

        document.getElementById(

            "configCPU"

        ).textContent =

            this.value + "%";

    }

);

/* ==========================================================
                    Memory Threshold
========================================================== */

document.getElementById(

    "memoryThreshold"

).addEventListener(

    "input",

    function(){

        document.getElementById(

            "configMemory"

        ).textContent =

            this.value + "%";

    }

);

/* ==========================================================
                    Button Event
========================================================== */

document.getElementById(

    "toggleRecoveryBtn"

).addEventListener(

    "click",

    toggleRecovery

);
/* ==========================================================
                    Update Status Circle
========================================================== */

function updateStatusCircle(){

    const circle = document.querySelector(".status-circle");

    if(!circle) return;

    if(recoveryEnabled){

        circle.style.background = `
            conic-gradient(
                #22C55E 0deg,
                #22C55E 320deg,
                rgba(255,255,255,.08) 320deg
            )
        `;

    }

    else{

        circle.style.background = `
            conic-gradient(
                #EF4444 0deg,
                #EF4444 320deg,
                rgba(255,255,255,.08) 320deg
            )
        `;

    }

}

/* ==========================================================
                    Initialize
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await loadSettings();

        updateStatusCircle();

        setInterval(

            async()=>{

                await loadSettings();

                updateStatusCircle();

            },

            5000

        );

    }

);

/* ==========================================================
                    End
========================================================== */