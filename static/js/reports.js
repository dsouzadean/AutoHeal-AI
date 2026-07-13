/* ==========================================================
                    AutoHeal-AI Reports
========================================================== */

let performanceChartCreated = false;
let pieChartCreated = false;

async function loadReports(){

    try{

        const response = await fetch("/history");

        if(!response.ok){

            throw new Error("Unable to fetch report history.");

        }

        const history = await response.json();

        if(history.length===0){

            return;

        }

        /* ==========================================
                    Calculations
        ========================================== */

        let cpu = 0;
        let memory = 0;
        let disk = 0;

        history.forEach(row=>{

            cpu += Number(row.cpu);

            memory += Number(row.memory);

            disk += Number(row.disk);

        });

        cpu /= history.length;
        memory /= history.length;
        disk /= history.length;

        /* ==========================================
                    Statistics Cards
        ========================================== */

        document.getElementById("avgCPU").textContent =
            cpu.toFixed(1) + "%";

        document.getElementById("avgMemory").textContent =
            memory.toFixed(1) + "%";

        document.getElementById("avgDisk").textContent =
            disk.toFixed(1) + "%";

        document.getElementById("records").textContent =
            history.length;

        document.getElementById("cardRecords").textContent =
            history.length;

        /* ==========================================
                    Summary Table
        ========================================== */

        const highestCPU =
            Math.max(...history.map(x=>Number(x.cpu)));

        const highestMemory =
            Math.max(...history.map(x=>Number(x.memory)));

        const highestDisk =
            Math.max(...history.map(x=>Number(x.disk)));

        const lowestCPU =
            Math.min(...history.map(x=>Number(x.cpu)));

        const lowestMemory =
            Math.min(...history.map(x=>Number(x.memory)));

        const lowestDisk =
            Math.min(...history.map(x=>Number(x.disk)));

        document.getElementById("summaryTable").innerHTML = `

        <tr>

            <td>Highest CPU Usage</td>

            <td>${highestCPU.toFixed(1)}%</td>

        </tr>

        <tr>

            <td>Highest Memory Usage</td>

            <td>${highestMemory.toFixed(1)}%</td>

        </tr>

        <tr>

            <td>Highest Disk Usage</td>

            <td>${highestDisk.toFixed(1)}%</td>

        </tr>

        <tr>

            <td>Lowest CPU Usage</td>

            <td>${lowestCPU.toFixed(1)}%</td>

        </tr>

        <tr>

            <td>Lowest Memory Usage</td>

            <td>${lowestMemory.toFixed(1)}%</td>

        </tr>

        <tr>

            <td>Lowest Disk Usage</td>

            <td>${lowestDisk.toFixed(1)}%</td>

        </tr>

        <tr>

            <td>Total Samples</td>

            <td>${history.length}</td>

        </tr>

        `;
                /* ==========================================
                    Performance Chart
        ========================================== */

        const labels =
            history.map(row => row.time);

        const cpuData =
            history.map(row => Number(row.cpu));

        const memoryData =
            history.map(row => Number(row.memory));

        const diskData =
            history.map(row => Number(row.disk));

        const performanceData = [

            {

                x: labels,

                y: cpuData,

                mode: "lines",

                name: "CPU",

                line:{

                    color:"#3B82F6",

                    width:3

                }

            },

            {

                x: labels,

                y: memoryData,

                mode: "lines",

                name: "Memory",

                line:{

                    color:"#22C55E",

                    width:3

                }

            },

            {

                x: labels,

                y: diskData,

                mode: "lines",

                name: "Disk",

                line:{

                    color:"#F59E0B",

                    width:3

                }

            }

        ];

        const performanceLayout = {

            paper_bgcolor:"rgba(0,0,0,0)",

            plot_bgcolor:"rgba(0,0,0,0)",

            font:{

                color:"#F8FAFC"

            },

            margin:{

                l:50,

                r:20,

                t:20,

                b:40

            },

            legend:{

                orientation:"h",

                y:1.15

            },

            xaxis:{

                gridcolor:"rgba(255,255,255,.08)",

                zeroline:false

            },

            yaxis:{

                title:"Usage (%)",

                gridcolor:"rgba(255,255,255,.08)",

                range:[0,100]

            }

        };

        if(!performanceChartCreated){

            Plotly.newPlot(

                "performanceChart",

                performanceData,

                performanceLayout,

                {

                    responsive:true,

                    displayModeBar:false

                }

            );

            performanceChartCreated = true;

        }

        else{

            Plotly.react(

                "performanceChart",

                performanceData,

                performanceLayout

            );

        }

        /* ==========================================
                    Resource Pie Chart
        ========================================== */

        const pieData = [

            {

                labels:[

                    "CPU",

                    "Memory",

                    "Disk"

                ],

                values:[

                    cpu,

                    memory,

                    disk

                ],

                type:"pie",

                hole:.60,

                textinfo:"label+percent",

                marker:{

                    colors:[

                        "#3B82F6",

                        "#22C55E",

                        "#F59E0B"

                    ]

                }

            }

        ];

        const pieLayout = {

            paper_bgcolor:"rgba(0,0,0,0)",

            plot_bgcolor:"rgba(0,0,0,0)",

            font:{

                color:"#F8FAFC"

            },

            margin:{

                l:20,

                r:20,

                t:20,

                b:20

            },

            showlegend:true,

            legend:{

                orientation:"h",

                y:-0.1

            }

        };

        if(!pieChartCreated){

            Plotly.newPlot(

                "resourcePie",

                pieData,

                pieLayout,

                {

                    responsive:true,

                    displayModeBar:false

                }

            );

            pieChartCreated = true;

        }

        else{

            Plotly.react(

                "resourcePie",

                pieData,

                pieLayout

            );

        }

    }

    catch(error){

        console.error(

            "Reports Error:",

            error

        );

    }

}
/* ==========================================================
                    INITIALIZE
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await loadReports();

        setInterval(

            loadReports,

            5000

        );

    }

);

/* ==========================================================
                    EXPORT CSV
========================================================== */

document.getElementById(

    "exportCSV"

).addEventListener(

    "click",

    async()=>{

        try{

            const response =

                await fetch("/history");

            if(!response.ok){

                throw new Error(

                    "Unable to fetch history."

                );

            }

            const history =

                await response.json();

            if(history.length===0){

                alert(

                    "No report data available."

                );

                return;

            }

            let csv =

                "Time,CPU (%),Memory (%),Disk (%),Processes\n";

            history.forEach(row=>{

                csv +=

`${row.time},${row.cpu},${row.memory},${row.disk},${row.processes}\n`;

            });

            const blob =

                new Blob(

                    [csv],

                    {

                        type:"text/csv"

                    }

                );

            const url =

                URL.createObjectURL(blob);

            const a =

                document.createElement("a");

            a.href = url;

            a.download =

                "AutoHeal_Report.csv";

            a.click();

            URL.revokeObjectURL(url);

        }

        catch(error){

            console.error(error);

            alert(

                "Failed to export CSV."

            );

        }

    }

);

/* ==========================================================
                    EXPORT PDF
========================================================== */

document.getElementById(

    "exportPDF"

).addEventListener(

    "click",

    async()=>{

        try{

            const response =

                await fetch("/history");

            if(!response.ok){

                throw new Error(

                    "Unable to fetch history."

                );

            }

            const history =

                await response.json();

            if(history.length===0){

                alert(

                    "No report data available."

                );

                return;

            }

            const {

                jsPDF

            } = window.jspdf;

            const doc =

                new jsPDF();

            doc.setFontSize(20);

            doc.text(

                "AutoHeal-AI System Report",

                14,

                20

            );

            doc.setFontSize(11);

            doc.text(

                "Generated : " +

                new Date().toLocaleString(),

                14,

                30

            );

            doc.autoTable({

                startY:40,

                head:[[

                    "Time",

                    "CPU",

                    "Memory",

                    "Disk",

                    "Processes"

                ]],

                body:history.map(row=>([

                    row.time,

                    row.cpu,

                    row.memory,

                    row.disk,

                    row.processes

                ]))

            });

            doc.save(

                "AutoHeal_Report.pdf"

            );

        }

        catch(error){

            console.error(error);

            alert(

                "Failed to export PDF."

            );

        }

    }

);

/* ==========================================================
                    Utility
========================================================== */

function formatPercent(value){

    return Number(value).toFixed(1) + "%";

}

/* ==========================================================
                    END
========================================================== */