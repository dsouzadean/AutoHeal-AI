/* ==========================================
   Monitoring Page
========================================== */

let labels = [];

let cpuHistory = [];
let memoryHistory = [];
let diskHistory = [];
let networkHistory = [];

let graphsInitialized = false;

async function loadMetrics() {

    try {

        const response = await fetch("/api/metrics");

        const data = await response.json();

        // ===============================
// System Information
// ===============================

if (document.getElementById("os")) {

    document.getElementById("os").textContent = data.os;

    document.getElementById("hostname").textContent =
        data.hostname;

    document.getElementById("cpuCores").textContent =
        data.cpu_cores;

    document.getElementById("totalRam").textContent =
        data.total_ram + " GB";

    document.getElementById("totalDisk").textContent =
        data.total_disk + " GB";

}

if (document.getElementById("cpuCoreCard")) {

    document.getElementById("cpuCoreCard").textContent =
        data.cpu_cores;

    document.getElementById("ramCard").textContent =
        data.total_ram + " GB";

    document.getElementById("diskCard").textContent =
        data.total_disk + " GB";

    document.getElementById("osCard").textContent =
        data.os;

}

        labels.push(new Date().toLocaleTimeString());

        cpuHistory.push(data.cpu);

        memoryHistory.push(data.memory);

        diskHistory.push(data.disk);

        networkHistory.push(
            (data.network_sent + data.network_received) / 1000000
        );

        while (labels.length > 20) {

            labels.shift();

            cpuHistory.shift();

            memoryHistory.shift();

            diskHistory.shift();

            networkHistory.shift();

        }

        if (!graphsInitialized) {

            Plotly.newPlot("cpuChart", [{
                x: labels,
                y: cpuHistory,
                mode: "lines",
                line: {color:"#2563eb"}
            }]);

            Plotly.newPlot("memoryChart", [{
                x: labels,
                y: memoryHistory,
                mode: "lines",
                line: {color:"#16a34a"}
            }]);

            Plotly.newPlot("diskChart", [{
                x: labels,
                y: diskHistory,
                mode: "lines",
                line: {color:"#f59e0b"}
            }]);

            Plotly.newPlot("networkChart", [{
                x: labels,
                y: networkHistory,
                mode: "lines",
                line: {color:"#8b5cf6"}
            }]);

            graphsInitialized = true;

        }

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

    catch(err){

        console.log(err);

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    loadMetrics();

    setInterval(loadMetrics,5000);

});