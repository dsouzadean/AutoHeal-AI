async function loadAI() {

    try {

        const response = await fetch("/api/metrics");

        const data = await response.json();

        document.getElementById("aiStatus").innerHTML =
            data.ai_status;

        document.getElementById("confidence").innerHTML =
            (Math.abs(data.score) * 100).toFixed(1) + "%";

        document.getElementById("rootCause").innerHTML =
            data.root_cause;

        document.getElementById("recommendedAction").innerHTML =
            data.recommended_action;

    }

    catch (err) {

        console.log(err);

    }

}

loadAI();

setInterval(loadAI, 5000);