async function loadReports() {

    try {

        const response = await fetch("/history");

        const history = await response.json();

        if (history.length === 0) return;

        let cpu = 0;
        let memory = 0;
        let disk = 0;

        history.forEach(row => {

            cpu += Number(row.cpu);
            memory += Number(row.memory);
            disk += Number(row.disk);

        });

        cpu /= history.length;
        memory /= history.length;
        disk /= history.length;

        document.getElementById("avgCPU").innerHTML =
            cpu.toFixed(1) + "%";

        document.getElementById("avgMemory").innerHTML =
            memory.toFixed(1) + "%";

        document.getElementById("avgDisk").innerHTML =
            disk.toFixed(1) + "%";

        document.getElementById("records").innerHTML =
            history.length;

        document.getElementById("summaryTable").innerHTML = `

        <tr>
            <td>Highest CPU</td>
            <td>${Math.max(...history.map(x => Number(x.cpu))).toFixed(1)}%</td>
        </tr>

        <tr>
            <td>Highest Memory</td>
            <td>${Math.max(...history.map(x => Number(x.memory))).toFixed(1)}%</td>
        </tr>

        <tr>
            <td>Highest Disk</td>
            <td>${Math.max(...history.map(x => Number(x.disk))).toFixed(1)}%</td>
        </tr>

        <tr>
            <td>Total Samples</td>
            <td>${history.length}</td>
        </tr>

        `;

    }

    catch(err){

        console.log(err);

    }

}

loadReports();

setInterval(loadReports,5000);
// ======================================
// Export Report as CSV
// ======================================

document.getElementById("exportCSV").addEventListener("click", async () => {

    try {

        const response = await fetch("/history");
        const history = await response.json();

        if (history.length === 0) {
            alert("No report data available.");
            return;
        }

        let csv = "Time,CPU (%),Memory (%),Disk (%),Processes\n";

        history.forEach(row => {
            csv += `${row.time},${row.cpu},${row.memory},${row.disk},${row.processes}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "AutoHeal_Report.csv";
        a.click();

        window.URL.revokeObjectURL(url);

    } catch (err) {
        console.error(err);
        alert("Failed to export CSV.");
    }

});
// ======================================
// Export Report as PDF
// ======================================

document.getElementById("exportPDF").addEventListener("click", async () => {

    try {

        const response = await fetch("/history");
        const history = await response.json();

        if (history.length === 0) {
            alert("No report data available.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("AutoHeal-AI System Report", 14, 20);

        // Date
        doc.setFontSize(11);
        doc.text(
            "Generated: " + new Date().toLocaleString(),
            14,
            30
        );

        // Table
        doc.autoTable({
            startY: 40,
            head: [[
                "Time",
                "CPU (%)",
                "Memory (%)",
                "Disk (%)",
                "Processes"
            ]],
            body: history.map(row => [
                row.time,
                row.cpu,
                row.memory,
                row.disk,
                row.processes
            ])
        });

        // Download PDF
        doc.save("AutoHeal_Report.pdf");

    } catch (err) {

        console.error(err);
        alert("Failed to export PDF.");

    }

});