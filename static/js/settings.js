async function loadSettings() {

    try {

        const response =
            await fetch("/api/recovery-status");

        const data = await response.json();

        document.getElementById("autoRecoveryStatus")
            .innerHTML = data.enabled ? "🟢 Enabled" : "🔴 Disabled";

        document.getElementById("configRecovery")
            .innerHTML = data.enabled ? "Enabled" : "Disabled";

    }

    catch(err){

        console.log(err);

    }

}

async function toggleRecovery() {

    await fetch("/api/toggle-recovery",{

        method:"POST"

    });

    loadSettings();

}

document
.getElementById("toggleRecoveryBtn")
.addEventListener("click",toggleRecovery);

document
.getElementById("refreshInterval")
.addEventListener("change",function(){

    document.getElementById("configRefresh")
        .innerHTML=this.value+" Seconds";

});

document
.getElementById("cpuThreshold")
.addEventListener("input",function(){

    document.getElementById("configCPU")
        .innerHTML=this.value+"%";

});

document
.getElementById("memoryThreshold")
.addEventListener("input",function(){

    document.getElementById("configMemory")
        .innerHTML=this.value+"%";

});

loadSettings();