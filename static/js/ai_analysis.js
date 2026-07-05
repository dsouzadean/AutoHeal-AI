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
        // Failure Prediction
        // ===============================

        document.getElementById("failureProbability").textContent =
            data.failure_probability + "%";

        document.getElementById("riskLevel").textContent =
            data.risk_level;

        // ===============================
        // Process Analysis
        // ===============================

        document.getElementById("suspectProcess").textContent =
            data.suspect_process;

        document.getElementById("suspectPid").textContent =
            data.pid;

        document.getElementById("processMemory").textContent =
            (data.top_memory || 0) + "%";

        document.getElementById("processCpu").textContent =
            (data.top_cpu || 0) + "%";

        // ===============================
        // Explainable AI
        // ===============================

        if (data.contributions) {

            document.getElementById("cpuContribution").textContent =
                data.contributions.CPU + "%";

            document.getElementById("memoryContribution").textContent =
                data.contributions.Memory + "%";

            document.getElementById("diskContribution").textContent =
                data.contributions.Disk + "%";

            document.getElementById("processContribution").textContent =
                data.contributions.Processes + "%";

        }

        document.getElementById("primaryCause").textContent =
            data.primary_cause || "Unknown";

    }

    catch (err) {

        console.error("AI Analysis Error:", err);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    loadAI();

    setInterval(loadAI, 5000);

});