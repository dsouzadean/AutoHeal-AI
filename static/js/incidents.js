async function loadIncidents() {

    try {

        const response = await fetch("/history");

        const history = await response.json();

        const tbody =
            document.querySelector("#incidentTable tbody");

        tbody.innerHTML = "";

        history.reverse().forEach(row => {

            let status = "✅ Normal";

            let cause = "System Healthy";

            let action = "None";

            if (row.cpu > 85) {

                status = "🚨 CPU Alert";
                cause = "High CPU Usage";
                action = "Terminate High CPU Process";

            }

            else if (row.memory > 85) {

                status = "🚨 Memory Alert";
                cause = "High Memory Usage";
                action = "Clear Memory Cache";

            }

            else if (row.disk > 90) {

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

    catch(err){

        console.log(err);

    }

}

loadIncidents();

setInterval(loadIncidents,5000);