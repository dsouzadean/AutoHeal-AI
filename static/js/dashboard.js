/* ======================================================
   AutoHeal-AI Dashboard
   dashboard.js
====================================================== */

// ===============================
// Chart Data
// ===============================

let labels = [];

let cpuHistory = [];
let memoryHistory = [];
let diskHistory = [];
let networkHistory = [];

let graphsInitialized = false;

// ===============================
// Dashboard Refresh
// ===============================

async function refreshDashboard() {

    // Refresh only live metrics
    await loadMetrics();

}

// ===============================
// Load Live Metrics
// ===============================

async function loadMetrics() {

    try {

        const response = await fetch("/api/metrics");

        if (!response.ok) {
            throw new Error("Unable to fetch metrics");
        }

        const data = await response.json();

        // ===============================
        // Dashboard Cards
        // ===============================

        document.getElementById("cpu").textContent =
            Number(data.cpu).toFixed(1) + "%";

        document.getElementById("memory").textContent =
            Number(data.memory).toFixed(1) + "%";

        document.getElementById("disk").textContent =
            Number(data.disk).toFixed(1) + "%";

        document.getElementById("processes").textContent =
            data.processes;

        // ===============================
        // System Health
        // ===============================

        const health = document.getElementById("health");

        if (health) {

            if (data.cpu > 85 || data.memory > 85) {

                health.textContent = "🔴 High Load";
                health.style.color = "#dc2626";

            } else {

                health.textContent = "🟢 Healthy";
                health.style.color = "#16a34a";

            }

        }

        // ===============================
        // AI Status
        // ===============================

        const ai = document.getElementById("aiStatus");

        if (ai) {

            if (data.ai_status === "Anomaly") {

                ai.textContent = "🚨 Anomaly Detected";
                ai.style.color = "#dc2626";

            } else {

                ai.textContent = "🤖 Normal";
                ai.style.color = "#16a34a";

            }

        }

        // ===============================
        // AI Details
        // ===============================

        const confidence =
            document.getElementById("confidence");

        if (confidence) {

            confidence.textContent =
                data.confidence + "%";

        }

        const rootCause =
            document.getElementById("rootCause");

        if (rootCause) {

            rootCause.textContent =
                data.root_cause;

        }

        const recommended =
            document.getElementById("recommendedAction");

        if (recommended) {

            recommended.textContent =
                data.recommended_action;

        }

        // ===============================
        // Prediction
        // ===============================

        const prediction =
            document.getElementById("prediction");

        if (prediction) {

            if (data.cpu > 90) {

                prediction.textContent =
                    "⚠ CPU Overload Possible";

                prediction.style.color = "#dc2626";

            }

            else if (data.memory > 90) {

                prediction.textContent =
                    "⚠ Memory Exhaustion Possible";

                prediction.style.color = "#dc2626";

            }

            else {

                prediction.textContent =
                    "✅ No Failure Predicted";

                prediction.style.color = "#16a34a";

            }

        }

        // ===============================
        // Alerts
        // ===============================

        const alerts =
            document.getElementById("alerts");

        if (alerts) {

            alerts.innerHTML = "";

            if (data.cpu > 85)
                alerts.innerHTML += "<li>🔥 High CPU Usage</li>";

            if (data.memory > 85)
                alerts.innerHTML += "<li>💾 High Memory Usage</li>";

            if (data.disk > 90)
                alerts.innerHTML += "<li>📀 Disk Almost Full</li>";

            if (alerts.innerHTML === "")
                alerts.innerHTML = "<li>✅ No Active Alerts</li>";

        }

        // ===============================
        // Store Graph Data
        // ===============================

        labels.push(
            new Date().toLocaleTimeString("en-IN")
        );

        cpuHistory.push(Number(data.cpu));
        memoryHistory.push(Number(data.memory));
        diskHistory.push(Number(data.disk));

        networkHistory.push(
            (
                Number(data.network_sent) +
                Number(data.network_received)
            ) / 1000000
        );

        while (labels.length > 20) {

            labels.shift();

            cpuHistory.shift();

            memoryHistory.shift();

            diskHistory.shift();

            networkHistory.shift();

        }

                // ===============================
        // Initialize Charts
        // ===============================

        if (!graphsInitialized) {

            Plotly.newPlot("cpuChart", [{
                x: labels,
                y: cpuHistory,
                mode: "lines+markers",
                line: {
                    color: "#2563eb",
                    width: 3
                },
                marker: {
                    size: 5
                }
            }], {
                title: "CPU Usage (%)",
                margin: { t: 40 },
                responsive: true
            });

            Plotly.newPlot("memoryChart", [{
                x: labels,
                y: memoryHistory,
                mode: "lines+markers",
                line: {
                    color: "#16a34a",
                    width: 3
                },
                marker: {
                    size: 5
                }
            }], {
                title: "Memory Usage (%)",
                margin: { t: 40 },
                responsive: true
            });

            Plotly.newPlot("diskChart", [{
                x: labels,
                y: diskHistory,
                mode: "lines+markers",
                line: {
                    color: "#f59e0b",
                    width: 3
                },
                marker: {
                    size: 5
                }
            }], {
                title: "Disk Usage (%)",
                margin: { t: 40 },
                responsive: true
            });

            Plotly.newPlot("networkChart", [{
                x: labels,
                y: networkHistory,
                mode: "lines+markers",
                line: {
                    color: "#8b5cf6",
                    width: 3
                },
                marker: {
                    size: 5
                }
            }], {
                title: "Network Activity (MB)",
                margin: { t: 40 },
                responsive: true
            });

            graphsInitialized = true;

        }

        // ===============================
        // Update Existing Charts
        // ===============================

        else {

            Plotly.update("cpuChart", {
                x: [labels],
                y: [cpuHistory]
            });

            Plotly.update("memoryChart", {
                x: [labels],
                y: [memoryHistory]
            });

            Plotly.update("diskChart", {
                x: [labels],
                y: [diskHistory]
            });

            Plotly.update("networkChart", {
                x: [labels],
                y: [networkHistory]
            });

        }

    }

    catch (err) {

        console.error("Metrics Error:", err);

    }

}


// ===============================
// Load Metrics History
// ===============================

async function loadHistory() {

    try {

        const response = await fetch("/history");

        if (!response.ok) {
            throw new Error("Unable to fetch history");
        }

        const history = await response.json();

        const tbody =
            document.querySelector("#metricsTable tbody");

        if (tbody) {

            tbody.innerHTML = "";

            history.forEach(row => {

                tbody.innerHTML += `
                    <tr>
                        <td>${row.time}</td>
                        <td>${Number(row.cpu).toFixed(1)}%</td>
                        <td>${Number(row.memory).toFixed(1)}%</td>
                        <td>${Number(row.disk).toFixed(1)}%</td>
                        <td>${row.processes}</td>
                    </tr>
                `;

            });

        }

        // ===============================
        // Incident Timeline
        // ===============================
        const incidentBody = document.getElementById("incidentTable");

if (incidentBody) {

    const response = await fetch("/api/incidents");
    const incidents = await response.json();

    incidentBody.innerHTML = "";

    if (incidents.length === 0) {

        incidentBody.innerHTML = `
            <tr>
                <td colspan="3">No incidents detected</td>
            </tr>
        `;

    } else {

        incidents.slice(0, 3).forEach(row => {

            incidentBody.innerHTML += `
                <tr>
                    <td>${row.time}</td>
                    <td>${row.root_cause}</td>
                    <td>
    <span class="status detected">
        ${row.status}
    </span>
</td>
                </tr>
            `;

        });

    }

}

    }

    catch (err) {

        console.error("History Error:", err);

    }

}
// ===============================
// Load Recovery History
// ===============================

async function loadRecoveryHistory() {

    try {

        const response = await fetch("/api/recovery-history");

        if (!response.ok) {
            throw new Error("Unable to fetch recovery history");
        }

        const history = await response.json();

        const tbody =
            document.querySelector("#recoveryTable tbody");

        if (!tbody) return;

        tbody.innerHTML = "";

        if (history.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No recovery actions yet.
                    </td>
                </tr>
            `;

            return;
        }

        history.forEach(row => {

            tbody.innerHTML += `
                <tr>
                    <td>${row.time}</td>
                    <td>${row.problem}</td>
                    <td>${row.action}</td>
                    <td>${row.process || "-"}</td>
                    <td>${row.pid || "-"}</td>
                    <td>${row.duration || 0}s</td>
                    <td>
    <span class="status-badge detected">
        ${row.status}
    </span>
</td>
                </tr>
            `;

        });

    }

    catch (err) {

        console.error("Recovery History Error:", err);

    }

}


// ===============================
// Auto Recovery Status
// ===============================

async function updateRecoveryStatus() {

    try {

        const response =
            await fetch("/api/recovery-status");

        if (!response.ok) {
            throw new Error("Unable to fetch recovery status");
        }

        const data = await response.json();

        const status =
            document.getElementById("autoRecoveryStatus");

        const button =
            document.getElementById("toggleRecoveryBtn");

        if (!status || !button) return;

        if (data.enabled) {

            status.textContent = "🟢 ON";
            status.style.color = "#16a34a";

            button.textContent =
                "Disable Auto Recovery";

        }

        else {

            status.textContent = "🔴 OFF";
            status.style.color = "#dc2626";

            button.textContent =
                "Enable Auto Recovery";

        }

    }

    catch (err) {

        console.error("Recovery Status Error:", err);

    }

}


// ===============================
// Toggle Auto Recovery
// ===============================

async function toggleRecovery() {

    try {

        const response =
            await fetch("/api/toggle-recovery", {

                method: "POST"

            });

        if (!response.ok) {

            throw new Error(
                "Unable to toggle recovery"
            );

        }

        await updateRecoveryStatus();

    }

    catch (err) {

        console.error(err);

    }

}


// ===============================
// Manual Recovery
// ===============================

async function runManualRecovery() {

    try {

        const response =
            await fetch("/api/manual-recovery", {

                method: "POST"

            });

        if (!response.ok) {

            throw new Error(
                "Manual recovery failed"
            );

        }

        const result =
            await response.json();

        alert(

            "Recovery Completed!\n\n" +

            "Problem: " + result.problem +

            "\nAction: " + result.action +

            "\nStatus: " + result.status +

            "\nVerification: " + result.verification

        );

        await loadMetrics();

        await loadRecoveryHistory();

    }

    catch (err) {

        console.error(err);

        alert("Recovery Failed.");

    }

}
// ===============================
// Dashboard Statistics
// ===============================

async function loadDashboardStats() {

    try {

        const response = await fetch("/api/dashboard-stats");

        if (!response.ok) {
            throw new Error("Unable to fetch dashboard statistics");
        }

        const stats = await response.json();

        document.getElementById("totalIncidents").textContent =
            stats.total_incidents;

        document.getElementById("totalRecoveries").textContent =
            stats.total_recoveries;

        document.getElementById("successfulRecoveries").textContent =
            stats.successful_recoveries;

        document.getElementById("failedRecoveries").textContent =
            stats.failed_recoveries;

    } catch (err) {

        console.error("Dashboard Stats Error:", err);

    }

}
// ===============================
// Initialize Dashboard
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

    // Load everything once
    await loadMetrics();
    await loadHistory();
    await loadRecoveryHistory();
    await loadDashboardStats();
    await updateRecoveryStatus();

    // Button Events
    const toggleButton =
        document.getElementById("toggleRecoveryBtn");

    if (toggleButton) {

        toggleButton.addEventListener(
            "click",
            toggleRecovery
        );

    }

    const manualButton =
        document.getElementById("manualRecoveryBtn");

    if (manualButton) {

        manualButton.addEventListener(
            "click",
            runManualRecovery
        );

    }

    // ======================================
    // Fast Refresh (Live Metrics)
    // ======================================

    setInterval(async () => {

        await loadMetrics();

    }, 5000);

    // ======================================
    // Slow Refresh (History Tables)
    // ======================================

 setInterval(async () => {

    await loadHistory();

    await loadRecoveryHistory();

    await loadDashboardStats();

}, 30000);

    // ======================================
    // Recovery Status
    // ======================================

    setInterval(async () => {

        await updateRecoveryStatus();

    }, 10000);

});