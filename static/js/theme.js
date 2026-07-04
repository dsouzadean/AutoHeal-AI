// ===============================
// Global Dark Mode
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const themeBtn = document.getElementById("themeBtn");

    // Restore saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");

        if (themeBtn) {
            themeBtn.innerHTML = "☀️ Light Mode";
        }
    }

    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            document.body.classList.toggle("dark");

            if (document.body.classList.contains("dark")) {

                localStorage.setItem("theme", "dark");
                themeBtn.innerHTML = "☀️ Light Mode";

            } else {

                localStorage.setItem("theme", "light");
                themeBtn.innerHTML = "🌙 Dark Mode";

            }

        });

    }

});