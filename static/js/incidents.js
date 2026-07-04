// ======================================
// Incident History
// ======================================

async function loadIncidents() {

    try {

        const response = await fetch("/api/incidents");

        if (!response.ok) {
            throw new Error("Unable to fetch incidents");
        }

        const incidents = await response.json();

        const tbody =
            document.querySelector("#incidentTable tbody");

        if (!tbody) return;

        tbody.innerHTML = "";

        if (incidents.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No incidents detected.
                    </td>
                </tr>
            `;

            return;
        }

incidents.forEach(row => {

    tbody.innerHTML += `
        <tr>
            <td>${row.time}</td>
            <td>${row.prediction}</td>
            <td>${row.confidence}%</td>
            <td>${row.root_cause}</td>
            <td>${row.action}</td>
            <td>${row.status}</td>
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