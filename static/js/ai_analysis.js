/* ==========================================================
                    AutoHeal-AI
                  AI Analysis Engine
========================================================== */

async function loadAI(){

    try{

        const response = await fetch("/api/metrics");

        if(!response.ok){

            throw new Error("Unable to fetch AI metrics");

        }

        const data = await response.json();

        /* ==========================================
                    AI STATUS
        ========================================== */

        const aiStatus =
            document.getElementById("aiStatus");

        aiStatus.textContent =
            data.ai_status;

        if(data.ai_status === "Anomaly"){

            aiStatus.style.color="#EF4444";

        }

        else{

            aiStatus.style.color="#22C55E";

        }

        /* ==========================================
                    CONFIDENCE
        ========================================== */

        document.getElementById("confidence").textContent =
            data.confidence + "%";

        document.getElementById("confidenceCard").textContent =
            data.confidence + "%";

        document.getElementById("confidenceValue").textContent =
            data.confidence + "%";

        /* ==========================================
                    FAILURE
        ========================================== */

        document.getElementById("failureProbability").textContent =
            data.failure_probability + "%";

        document.getElementById("failureProbabilityCard").textContent =
            data.failure_probability + "%";

        /* ==========================================
                    ROOT CAUSE
        ========================================== */

        document.getElementById("rootCause").textContent =
            data.root_cause;

        document.getElementById("recommendedAction").textContent =
            data.recommended_action;

        /* ==========================================
                    PRIMARY CAUSE
        ========================================== */

        document.getElementById("primaryCause").textContent =
            data.primary_cause || "Unknown";

        /* ==========================================
                    LAST ANALYSIS
        ========================================== */

        document.getElementById("lastAnalysis").textContent =
            new Date().toLocaleTimeString();
        /* ==========================================
                    RISK LEVEL
        ========================================== */

        const riskLevel =
            data.risk_level;

        document.getElementById("riskLevel").textContent =
            riskLevel;

        document.getElementById("riskLevelCard").textContent =
            riskLevel;

        document.getElementById("riskCircle").textContent =
            riskLevel;

        const circle =
            document.getElementById("riskCircle");

        if(riskLevel === "LOW"){

            circle.style.background =
                "linear-gradient(135deg,#16A34A,#22C55E)";

            circle.style.boxShadow =
                "0 0 40px rgba(34,197,94,.35)";

            document.getElementById("riskLevel").style.color =
                "#22C55E";

            document.getElementById("riskLevelCard").style.color =
                "#22C55E";

        }

        else if(riskLevel === "MEDIUM"){

            circle.style.background =
                "linear-gradient(135deg,#F59E0B,#FBBF24)";

            circle.style.boxShadow =
                "0 0 40px rgba(245,158,11,.35)";

            document.getElementById("riskLevel").style.color =
                "#F59E0B";

            document.getElementById("riskLevelCard").style.color =
                "#F59E0B";

        }

        else if(riskLevel === "HIGH"){

            circle.style.background =
                "linear-gradient(135deg,#F97316,#EA580C)";

            circle.style.boxShadow =
                "0 0 40px rgba(249,115,22,.35)";

            document.getElementById("riskLevel").style.color =
                "#F97316";

            document.getElementById("riskLevelCard").style.color =
                "#F97316";

        }

        else{

            circle.style.background =
                "linear-gradient(135deg,#DC2626,#EF4444)";

            circle.style.boxShadow =
                "0 0 40px rgba(239,68,68,.35)";

            document.getElementById("riskLevel").style.color =
                "#EF4444";

            document.getElementById("riskLevelCard").style.color =
                "#EF4444";

        }

        /* ==========================================
                    HEALTH CIRCLE
        ========================================== */

        const healthCircle =
            document.getElementById("healthCircle");

        if(healthCircle){

            const score =
                Math.max(
                    0,
                    100 - Number(data.failure_probability)
                );

            healthCircle.textContent =
                score + "%";

        }

        /* ==========================================
                    PROCESS ANALYSIS
        ========================================== */

        document.getElementById("suspectProcess").textContent =
            data.suspect_process || "-";

        document.getElementById("suspectPid").textContent =
            data.pid || "-";

        document.getElementById("processCpu").textContent =
            (data.top_cpu || 0) + "%";

        document.getElementById("processMemory").textContent =
            (data.top_memory || 0) + "%";

        /* ==========================================
                    EXPLAINABLE AI
        ========================================== */

        if(data.contributions){

            document.getElementById("cpuContribution").textContent =
                data.contributions.CPU + "%";

            document.getElementById("memoryContribution").textContent =
                data.contributions.Memory + "%";

            document.getElementById("diskContribution").textContent =
                data.contributions.Disk + "%";

            document.getElementById("processContribution").textContent =
                data.contributions.Processes + "%";

        }
                /* ==========================================
                    MODEL STATUS
        ========================================== */

        const modelStatus =
            document.getElementById("modelStatus");

        if(modelStatus){

            if(data.ai_status === "Anomaly"){

                modelStatus.textContent =
                    "ALERT MODE";

                modelStatus.style.color =
                    "#EF4444";

            }

            else{

                modelStatus.textContent =
                    "ACTIVE";

                modelStatus.style.color =
                    "#22C55E";

            }

        }

    }

    catch(error){

        console.error(

            "AI Analysis Error:",

            error

        );

    }

}

/* ==========================================================
                    Initialize Page
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        /* First Load */

        await loadAI();

        /* ==========================================
                Refresh Every 5 Seconds
        ========================================== */

        setInterval(

            async()=>{

                await loadAI();

            },

            5000

        );

    }

);

/* ==========================================================
                    Page Visibility
========================================================== */

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            console.log(

                "AI Analysis paused."

            );

        }

        else{

            loadAI();

        }

    }

);

/* ==========================================================
                    Utility Functions
========================================================== */

function updateText(id,value){

    const element =
        document.getElementById(id);

    if(element){

        element.textContent = value;

    }

}

function updatePercentage(id,value){

    const element =
        document.getElementById(id);

    if(element){

        element.textContent =
            Number(value).toFixed(1) + "%";

    }

}

