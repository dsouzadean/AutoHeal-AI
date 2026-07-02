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

        const tbody = document.querySelector("#metricsTable tbody");

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

    catch (err) {

        console.error("History Error:", err);

    }

}

// ===============================
// Dark Mode
// ===============================

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            themeBtn.innerHTML = "☀️ Light Mode";

        } else {

            themeBtn.innerHTML = "🌙 Dark Mode";

        }

    });

}

// ===============================
// Auto Refresh
// ===============================

refreshDashboard();

setInterval(() => {

    refreshDashboard();

}, 5000);

console.log("✅ Dashboard Loaded");