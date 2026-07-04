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

    await loadMetrics();

    await loadHistory();

    await loadRecoveryHistory();

}

// ===============================
// Load Live Metrics
// ===============================

async function loadMetrics() {

    try {

        const response = await fetch("/api/metrics");

        const data = await response.json();

        // ===============================
        // Update Cards
        // ===============================

        document.getElementById("cpu").innerHTML =
            data.cpu.toFixed(1) + "%";

        document.getElementById("memory").innerHTML =
            data.memory.toFixed(1) + "%";

        document.getElementById("disk").innerHTML =
            data.disk.toFixed(1) + "%";

        document.getElementById("processes").innerHTML =
            data.processes;

        // ===============================
        // System Health
        // ===============================

        const health =
            document.getElementById("health");

        if (data.cpu > 85 || data.memory > 85) {

            health.innerHTML = "🔴 High Load";
            health.style.color = "#dc2626";

        }

        else {

            health.innerHTML = "🟢 Healthy";
            health.style.color = "#16a34a";

        }

        // ===============================
        // AI Status
        // ===============================

        const ai =
            document.getElementById("aiStatus");

        if (data.ai_status === "Anomaly") {

            ai.innerHTML =
                "🚨 Anomaly Detected";

            ai.style.color = "#dc2626";

        }

        else if (data.ai_status === "Normal") {

            ai.innerHTML =
                "🤖 Normal";

            ai.style.color = "#16a34a";

        }

        else {

            ai.innerHTML =
                "⚠ Model Not Trained";

            ai.style.color = "#f59e0b";

        }

        // ===============================
// AI Details (Safe)
// ===============================

const confidence = document.getElementById("confidence");
if (confidence && data.score !== undefined) {
    confidence.innerHTML = (Math.abs(data.score) * 100).toFixed(1) + "%";
}

const rootCause = document.getElementById("rootCause");
if (rootCause) {
    rootCause.innerHTML =
        data.root_cause || "System Operating Normally";
}

const recommendedAction =
    document.getElementById("recommendedAction");

if (recommendedAction) {
    recommendedAction.innerHTML =
        data.recommended_action || "No Action Required";
}

        // ===============================
        // Prediction
        // ===============================

        const prediction =
            document.getElementById("prediction");

        if (data.cpu > 90) {

            prediction.innerHTML =
                "⚠ CPU Overload Possible";

            prediction.style.color =
                "#dc2626";

        }

        else if (data.memory > 90) {

            prediction.innerHTML =
                "⚠ Memory Exhaustion Possible";

            prediction.style.color =
                "#dc2626";

        }

        else {

            prediction.innerHTML =
                "✅ No Failure Predicted";

            prediction.style.color =
                "#16a34a";

        }

        // ===============================
        // Alerts
        // ===============================

        const alerts =
            document.getElementById("alerts");

        alerts.innerHTML = "";

        if (data.cpu > 85) {

            alerts.innerHTML +=
                "<li>🔥 High CPU Usage</li>";

        }

        if (data.memory > 85) {

            alerts.innerHTML +=
                "<li>💾 High Memory Usage</li>";

        }

        if (data.disk > 90) {

            alerts.innerHTML +=
                "<li>📀 Disk Almost Full</li>";

        }

        if (alerts.innerHTML === "") {

            alerts.innerHTML =
                "<li>✅ No Active Alerts</li>";

        }

        // ===============================
        // Store Graph Data
        // ===============================

        labels.push(
            new Date().toLocaleTimeString("en-IN")
        );

        cpuHistory.push(data.cpu);

        memoryHistory.push(data.memory);

        diskHistory.push(data.disk);

        networkHistory.push(
            (
                data.network_sent +
                data.network_received
            ) / 1000000
        );

        while (labels.length > 20) {

            labels.shift();

            cpuHistory.shift();

            memoryHistory.shift();

            diskHistory.shift();

            networkHistory.shift();

        }

        console.log("Points:", labels.length);

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
                    size: 6
                }
            }], {
                title: "CPU Usage (%)",
                margin: {
                    t: 40
                }
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
                    size: 6
                }
            }], {
                title: "Memory Usage (%)",
                margin: {
                    t: 40
                }
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
                    size: 6
                }
            }], {
                title: "Disk Usage (%)",
                margin: {
                    t: 40
                }
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
                    size: 6
                }
            }], {
                title: "Network Activity (MB)",
                margin: {
                    t: 40
                }
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
        const history = await response.json();

        // ===============================
        // Recent Metrics Table
        // ===============================

        const tbody = document.querySelector("#metricsTable tbody");

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
        // Dashboard Incident Timeline
        // ===============================

        const incidentBody = document.getElementById("incidentTable");

        if (incidentBody) {

            incidentBody.innerHTML = "";

            history
                .slice()
                .reverse()
                .slice(0, 5)
                .forEach(row => {

                    let incident = "No incidents detected";
                    let status = "✅ Stable";

                    if (Number(row.cpu) > 85) {

                        incident = "High CPU Usage";
                        status = "🚨 Alert";

                    }
                    else if (Number(row.memory) > 85) {

                        incident = "High Memory Usage";
                        status = "🚨 Alert";

                    }
                    else if (Number(row.disk) > 90) {

                        incident = "Disk Almost Full";
                        status = "🚨 Alert";

                    }

                    incidentBody.innerHTML += `
                        <tr>
                            <td>${row.time}</td>
                            <td>${incident}</td>
                            <td>${status}</td>
                        </tr>
                    `;

                });

            // Show a default row if there is no history
            if (history.length === 0) {

                incidentBody.innerHTML = `
                    <tr>
                        <td>--</td>
                        <td>No incidents detected</td>
                        <td>✅ Stable</td>
                    </tr>
                `;

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

        const tbody = document.querySelector("#recoveryTable tbody");

        tbody.innerHTML = "";

        if (history.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
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
                    <td>${row.status}</td>
                </tr>
            `;

        });

    }

    catch (err) {

        console.error("Recovery History Error:", err);

    }

}

// ===============================
// Recovery Controls
// ===============================

async function updateRecoveryStatus() {

    try {

        const response = await fetch("/api/recovery-status");

        if (!response.ok) {
            throw new Error("Unable to fetch recovery status");
        }

        const data = await response.json();

        const status =
            document.getElementById("autoRecoveryStatus");

        const button =
            document.getElementById("toggleRecoveryBtn");

        if (!status || !button) {
            return;
        }

        if (data.enabled) {

            status.textContent = "🟢 ON";

            status.style.color = "#16a34a";

            button.textContent = "Disable Auto Recovery";

        }

        else {

            status.textContent = "🔴 OFF";

            status.style.color = "#dc2626";

            button.textContent = "Enable Auto Recovery";

        }

    }

    catch (err) {

        console.error("Recovery Status Error:", err);

    }

}

async function toggleRecovery() {

    try {

        const response = await fetch("/api/toggle-recovery", {

            method: "POST"

        });

        if (!response.ok) {
            throw new Error("Unable to toggle recovery");
        }

        await updateRecoveryStatus();

    }

    catch (err) {

        console.error("Toggle Recovery Error:", err);

    }

}

// ===============================
// Manual Recovery
// ===============================

async function runManualRecovery() {

    try {

        const response = await fetch("/api/manual-recovery", {

            method: "POST"

        });

        if (!response.ok) {

            throw new Error("Manual recovery failed");

        }

        const result = await response.json();

    alert(
        "Recovery Completed!\n\n" +
        "Problem: " + result.problem +
        "\nAction: " + result.action +
        "\nStatus: " + result.status +
        "\nVerification: " + result.verification
    );

        // Refresh dashboard data
        await refreshDashboard();
        await loadRecoveryHistory();

    }

    catch (err) {

        console.error(err);

        alert("Recovery Failed.");

    }

}



// ===============================
// Auto Refresh
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    refreshDashboard();

    updateRecoveryStatus();

    const button =
        document.getElementById("toggleRecoveryBtn");

    if (button) {

        button.addEventListener(
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

    setInterval(() => {

        refreshDashboard();

        updateRecoveryStatus();

    }, 5000);

});