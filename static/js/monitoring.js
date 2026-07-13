/* ==========================================================
                    AutoHeal-AI
                Monitoring Page
========================================================== */

let labels = [];

let cpuHistory = [];
let memoryHistory = [];
let diskHistory = [];
let networkHistory = [];

let previousSent = 0;
let previousReceived = 0;

let graphsInitialized = false;

/* ==========================================================
                    Plotly Theme
========================================================== */

const chartLayout = (title) => ({

    title:{
        text:title,
        font:{
            size:20,
            color:"#E2E8F0"
        }
    },

    paper_bgcolor:"rgba(0,0,0,0)",

    plot_bgcolor:"rgba(0,0,0,0)",

    margin:{
        l:55,
        r:20,
        t:60,
        b:45
    },

    font:{
        color:"#E2E8F0"
    },

    hovermode:"x unified",

    showlegend:false,

    xaxis:{

        showgrid:true,

        gridcolor:"rgba(255,255,255,.06)",

        color:"#94A3B8",

        zeroline:false

    },

    yaxis:{

        showgrid:true,

        gridcolor:"rgba(255,255,255,.06)",

        color:"#94A3B8",

        zeroline:false,

        autorange:true

    }

});

/* ==========================================================
                    CPU Graph
========================================================== */

function cpuTrace(){

    return{

        x:labels,

        y:cpuHistory,

        mode:"lines+markers",

        line:{

            color:"#3B82F6",

            width:4,

            shape:"spline"

        },

        marker:{

            size:5

        },

        fill:"tozeroy",

        fillcolor:"rgba(59,130,246,.18)"

    };

}

/* ==========================================================
                    Memory Graph
========================================================== */

function memoryTrace(){

    return{

        x:labels,

        y:memoryHistory,

        mode:"lines+markers",

        line:{

            color:"#22C55E",

            width:4,

            shape:"spline"

        },

        marker:{

            size:5

        },

        fill:"tozeroy",

        fillcolor:"rgba(34,197,94,.18)"

    };

}

/* ==========================================================
                    Disk Graph
========================================================== */

function diskTrace(){

    return{

        x:labels,

        y:diskHistory,

        mode:"lines+markers",

        line:{

            color:"#F59E0B",

            width:4,

            shape:"spline"

        },

        marker:{

            size:5

        },

        fill:"tozeroy",

        fillcolor:"rgba(245,158,11,.18)"

    };

}

/* ==========================================================
                    Network Graph
========================================================== */

function networkTrace(){

    return{

        x:labels,

        y:networkHistory,

        mode:"lines+markers",

        line:{

            color:"#8B5CF6",

            width:4,

            shape:"spline"

        },

        marker:{

            size:5

        },

        fill:"tozeroy",

        fillcolor:"rgba(139,92,246,.18)"

    };

}
/* ==========================================================
                    Load Metrics
========================================================== */

async function loadMetrics(){

    try{

        const response = await fetch("/api/metrics");

        if(!response.ok){

            throw new Error("Unable to fetch metrics.");

        }

        const data = await response.json();

        /* =====================================
                System Information
        ===================================== */

        if(document.getElementById("os")){

            document.getElementById("os").textContent =
                data.os;

            document.getElementById("hostname").textContent =
                data.hostname;

            document.getElementById("cpuCores").textContent =
                data.cpu_cores;

            document.getElementById("totalRam").textContent =
                data.total_ram + " GB";

            document.getElementById("totalDisk").textContent =
                data.total_disk + " GB";

        }

        /* =====================================
                Dashboard Cards
        ===================================== */

        if(document.getElementById("cpuCard")){

            document.getElementById("cpuCard").textContent =
                Number(data.cpu).toFixed(1) + "%";

        }

        if(document.getElementById("memoryCard")){

            document.getElementById("memoryCard").textContent =
                Number(data.memory).toFixed(1) + "%";

        }

        if(document.getElementById("diskCard")){

            document.getElementById("diskCard").textContent =
                Number(data.disk).toFixed(1) + "%";

        }

        if(document.getElementById("networkCard")){

            const currentNetwork = (
                Number(data.network_sent) +
                Number(data.network_received)
            ) / 1000000;

            document.getElementById("networkCard").textContent =
                currentNetwork.toFixed(2) + " MB";

        }

        /* =====================================
                Store Graph History
        ===================================== */

        labels.push(

            new Date().toLocaleTimeString("en-IN",{

                hour:"2-digit",

                minute:"2-digit",

                second:"2-digit"

            })

        );

        cpuHistory.push(

            Number(data.cpu)

        );

        memoryHistory.push(

            Number(data.memory)

        );

        diskHistory.push(

            Number(data.disk)

        );

        /* =====================================
                Live Network Speed
        ===================================== */

        let currentSent =
            Number(data.network_sent);

        let currentReceived =
            Number(data.network_received);

        let networkSpeed = 0;

        if(previousSent !== 0){

            networkSpeed =

                (

                    (currentSent - previousSent)

                    +

                    (currentReceived - previousReceived)

                ) / 1024 / 1024;

        }

        previousSent = currentSent;

        previousReceived = currentReceived;

        networkHistory.push(

            Number(networkSpeed.toFixed(2))

        );

        /* =====================================
                Keep Only 20 Points
        ===================================== */

        while(labels.length > 20){

            labels.shift();

            cpuHistory.shift();

            memoryHistory.shift();

            diskHistory.shift();

            networkHistory.shift();

        }
                /* =====================================
                Initialize Charts
        ===================================== */

        if(!graphsInitialized){

            Plotly.newPlot(

                "cpuChart",

                [cpuTrace()],

                chartLayout("CPU Usage (%)"),

                {

                    responsive:true,

                    displayModeBar:false

                }

            );

            Plotly.newPlot(

                "memoryChart",

                [memoryTrace()],

                chartLayout("Memory Usage (%)"),

                {

                    responsive:true,

                    displayModeBar:false

                }

            );

            Plotly.newPlot(

                "diskChart",

                [diskTrace()],

                chartLayout("Disk Usage (%)"),

                {

                    responsive:true,

                    displayModeBar:false

                }

            );

            Plotly.newPlot(

                "networkChart",

                [networkTrace()],

                chartLayout("Network Activity (MB/s)"),

                {

                    responsive:true,

                    displayModeBar:false

                }

            );

            graphsInitialized = true;

        }

        /* =====================================
                Update Existing Charts
        ===================================== */

        else{

            Plotly.update(

                "cpuChart",

                {

                    x:[labels],

                    y:[cpuHistory]

                }

            );

            Plotly.update(

                "memoryChart",

                {

                    x:[labels],

                    y:[memoryHistory]

                }

            );

            Plotly.update(

                "diskChart",

                {

                    x:[labels],

                    y:[diskHistory]

                }

            );

            Plotly.update(

                "networkChart",

                {

                    x:[labels],

                    y:[networkHistory]

                }

            );

            /* Auto-resize Y-axis */

            Plotly.relayout(

                "cpuChart",

                {

                    "yaxis.autorange":true

                }

            );

            Plotly.relayout(

                "memoryChart",

                {

                    "yaxis.autorange":true

                }

            );

            Plotly.relayout(

                "diskChart",

                {

                    "yaxis.autorange":true

                }

            );

            Plotly.relayout(

                "networkChart",

                {

                    "yaxis.autorange":true

                }

            );

        }

    }

    catch(error){

        console.error(

            "Monitoring Error:",

            error

        );

    }

}
/* ==========================================================
                    Initialize Monitoring
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        /* First Load */

        await loadMetrics();

        /* =====================================
                Refresh Every 5 Seconds
        ===================================== */

        setInterval(

            async()=>{

                await loadMetrics();

            },

            5000

        );

    }

);

/* ==========================================================
                    Window Resize
========================================================== */

window.addEventListener(

    "resize",

    ()=>{

        if(!graphsInitialized){

            return;

        }

        Plotly.Plots.resize(

            document.getElementById("cpuChart")

        );

        Plotly.Plots.resize(

            document.getElementById("memoryChart")

        );

        Plotly.Plots.resize(

            document.getElementById("diskChart")

        );

        Plotly.Plots.resize(

            document.getElementById("networkChart")

        );

    }

);

/* ==========================================================
                Utility Functions
========================================================== */

function resetCharts(){

    labels = [];

    cpuHistory = [];

    memoryHistory = [];

    diskHistory = [];

    networkHistory = [];

    graphsInitialized = false;

}

function formatNumber(value){

    return Number(value).toFixed(2);

}

