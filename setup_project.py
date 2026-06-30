import os

# ============================================
# AutoHeal-AI Project Structure Generator
# ============================================

folders = [
    "models",
    "monitoring",
    "ai",
    "healing",
    "database",
    "database/migrations",
    "scheduler",
    "dashboard",
    "analytics",
    "utils",
    "templates",
    "static",
    "static/css",
    "static/js",
    "static/images",
    "static/uploads",
    "logs",
    "datasets",
    "datasets/processed",
    "reports",
    "reports/daily",
    "reports/weekly",
    "reports/monthly",
    "tests",
    "docs",
    "docs/screenshots"
]

files = {
    ".": [
        "app.py",
        "config.py",
        "requirements.txt",
        "README.md",
        ".gitignore",
        "Dockerfile",
        "docker-compose.yml"
    ],

    "models": [
        "__init__.py",
        "train_model.py",
        "retrain.py",
        "evaluate.py"
    ],

    "monitoring": [
        "__init__.py",
        "cpu_monitor.py",
        "memory_monitor.py",
        "disk_monitor.py",
        "network_monitor.py",
        "process_monitor.py",
        "application_monitor.py",
        "collector.py",
        "health_checker.py"
    ],

    "ai": [
        "__init__.py",
        "anomaly_detection.py",
        "failure_prediction.py",
        "root_cause.py",
        "confidence_score.py",
        "feature_engineering.py",
        "preprocessing.py"
    ],

    "healing": [
        "__init__.py",
        "restart_service.py",
        "restart_process.py",
        "clear_temp.py",
        "recovery_manager.py",
        "recovery_verifier.py",
        "action_selector.py"
    ],

    "database": [
        "__init__.py",
        "database.py",
        "models.py",
        "incident_logger.py",
        "metrics_storage.py",
        "learning_data.py"
    ],

    "scheduler": [
        "__init__.py",
        "scheduler.py",
        "monitor_job.py",
        "retrain_job.py",
        "cleanup_job.py"
    ],

    "dashboard": [
        "__init__.py",
        "routes.py",
        "api.py",
        "charts.py",
        "websocket.py"
    ],

    "analytics": [
        "__init__.py",
        "incident_analysis.py",
        "trend_analysis.py",
        "statistics.py",
        "report_generator.py",
        "prediction_history.py"
    ],

    "utils": [
        "__init__.py",
        "logger.py",
        "helpers.py",
        "constants.py",
        "notifications.py",
        "validators.py"
    ],

    "templates": [
        "base.html",
        "dashboard.html",
        "incidents.html",
        "analytics.html",
        "predictions.html",
        "reports.html",
        "settings.html",
        "login.html"
    ],

    "static/css": [
        "dashboard.css",
        "analytics.css",
        "styles.css"
    ],

    "static/js": [
        "dashboard.js",
        "charts.js",
        "websocket.js"
    ],

    "tests": [
        "test_monitoring.py",
        "test_prediction.py",
        "test_database.py",
        "test_healing.py",
        "test_dashboard.py"
    ],

    "docs": [
        "architecture.md",
        "api_documentation.md",
        "workflow.md"
    ]
}

print("Creating folders...")

for folder in folders:
    os.makedirs(folder, exist_ok=True)

print("Creating files...")

for folder, file_list in files.items():

    for file in file_list:

        if folder == ".":
            path = file
        else:
            path = os.path.join(folder, file)

        if not os.path.exists(path):

            with open(path, "w", encoding="utf-8") as f:

                if path.endswith(".py"):
                    f.write(f'""" {os.path.basename(path)} """\n\n')

                elif path.endswith(".html"):
                    f.write(f"<!-- {os.path.basename(path)} -->\n")

                elif path.endswith(".css"):
                    f.write(f"/* {os.path.basename(path)} */\n")

                elif path.endswith(".js"):
                    f.write(f"// {os.path.basename(path)}\n")

                elif path.endswith(".md"):
                    f.write(f"# {os.path.basename(path)}\n")

                else:
                    f.write("")

print()
print("=" * 45)
print("✅ AutoHeal-AI project created successfully!")
print("=" * 45)