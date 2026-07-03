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