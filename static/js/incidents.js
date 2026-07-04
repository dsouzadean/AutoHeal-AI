// ======================================
// Incident History
// ======================================

async function loadIncidents() {

    try {

        const response = await fetch("/history");

        if (!response.ok) {
            throw new Error("Unable to fetch incident history");
        }

        const history = await response.json();

        const tbody =
            document.querySelector("#incidentTable tbody");

        if (!tbody) return;

        tbody.innerHTML = "";

        if (history.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No incidents recorded.
                    </td>
                </tr>
            `;

            return;
        }

        // API already returns newest first
        history.forEach(row => {

            let status = "✅ Normal";
            let cause = "System Healthy";
            let action = "No Action Required";

            if (Number(row.cpu) > 85) {

                status = "🚨 CPU Alert";
                cause = "High CPU Usage";
                action = "Terminate High CPU Process";

            }

            else if (Number(row.memory) > 85) {

                status = "🚨 Memory Alert";
                cause = "High Memory Usage";
                action = "Clear Memory Cache";

            }

            else if (Number(row.disk) > 90) {

                status = "🚨 Disk Alert";
                cause = "Disk Almost Full";
                action = "Clean Temporary Files";

            }

            tbody.innerHTML += `
                <tr>
                    <td>${row.time}</td>
                    <td>${status}</td>
                    <td>${cause}</td>
                    <td>${action}</td>
                </tr>
            `;

        });

    }

    catch (err) {

        console.error("Incident Error:", err);

    }

}

// Initial Load
loadIncidents();

// Refresh every 5 seconds
setInterval(loadIncidents, 5000);