// ==========================================
// AI Analysis Page
// ==========================================

async function loadAI() {

    try {

        const response = await fetch("/api/metrics");

        const data = await response.json();

        // ===============================
        // AI Status
        // ===============================

        document.getElementById("aiStatus").textContent =
            data.ai_status;

        document.getElementById("confidence").textContent =
            data.confidence + "%";

        document.getElementById("rootCause").textContent =
            data.root_cause;

        document.getElementById("recommendedAction").textContent =
            data.recommended_action;

        // ===============================
        // Process Analysis
        // ===============================

        document.getElementById("suspectProcess").textContent =
            data.suspect_process;

        document.getElementById("suspectPid").textContent =
            data.pid;

        document.getElementById("processMemory").textContent =
            data.top_memory + "%";

        document.getElementById("processCpu").textContent =
            data.top_cpu + "%";

    }

    catch (err) {

        console.error("AI Analysis Error:", err);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    loadAI();

    setInterval(loadAI, 5000);

});