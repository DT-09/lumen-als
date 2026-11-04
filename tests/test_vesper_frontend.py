from pathlib import Path
import json
import subprocess


ROOT = Path(__file__).parents[1]
APP = ROOT / "web" / "assets" / "batlab.js"
WORKER = ROOT / "web" / "sw.js"


def test_vesper_shell_and_assets_are_present():
    html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "web" / "assets" / "batlab.css").read_text(encoding="utf-8")
    manifest = json.loads((ROOT / "web" / "manifest.webmanifest").read_text(encoding="utf-8"))
    assert "VESPER" in html
    assert "batlab.js" in html and "batlab.css" in html
    assert ".learning-cycle" in css
    assert manifest["short_name"] == "VESPER"


def test_frontend_javascript_parses():
    result = subprocess.run(
        ["node", "--check", str(APP)],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr


def test_service_worker_javascript_parses():
    result = subprocess.run(
        ["node", "--check", str(WORKER)],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr


def test_self_education_workflows_are_wired():
    source = APP.read_text(encoding="utf-8")
    required = [
        'case"questions":',
        'case"pathways":',
        'case"study":',
        'case"investigate":',
        'case"models":',
        'case"workshop":',
        'case"journal":',
        'case"resources":',
        'case"recall":',
        'case"method":',
        "defaultMilestones",
        "data-plan-step",
        "data-edit-note",
        "data-edit-resource",
        "data-delete-investigation",
        "focusToggle",
    ]
    for feature in required:
        assert feature in source, f"Missing learner workflow: {feature}"


def test_local_backup_export_restore_and_validation_exist():
    source = APP.read_text(encoding="utf-8")
    assert "function exportData()" in source
    assert "function importData(file)" in source
    assert 'parsed.product!=="VESPER"' in source
    assert "importDataFile" in source
    assert "normalizeState" in source
    assert "localStorage.setItem(KEY" in source


def test_model_bench_has_six_domains_and_correct_first_twenty_shells():
    source = APP.read_text(encoding="utf-8")
    for domain in (
        "MATHEMATICS · LINEAR MODEL",
        "PHYSICS · IDEAL PENDULUM",
        "ENGINEERING · OHM’S LAW",
        "CHEMISTRY · ATOMIC STRUCTURE",
        "BIOLOGY · CELL STRUCTURE",
        "COMPUTER SCIENCE · ALGORITHMS",
    ):
        assert domain in source
    assert "Math.min(Math.max(n-10,0),8),Math.max(n-18,0)" in source


def test_external_resource_urls_are_restricted_to_http_schemes():
    source = APP.read_text(encoding="utf-8")
    assert "!/^https?:\\/\\//i.test(url)" in source
    assert 'rel="noopener noreferrer"' in source


def test_repeated_controls_bind_all_matching_elements():
    import re

    source = APP.read_text(encoding="utf-8")
    broken = re.findall(r'(?<!\$)\$\("\[data-[^"]+\]"\)\.forEach', source)
    assert not broken, f"Use the all-elements selector for repeated controls: {broken}"


def test_offline_app_shell_is_cached_and_registered():
    html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    worker = WORKER.read_text(encoding="utf-8")
    assert 'navigator.serviceWorker.register("/sw.js")' in html
    assert 'const CACHE_NAME = "vesper-shell-v2.1.0"' in worker
    assert "cache.addAll(SHELL_ASSETS)" in worker
    assert 'caches.match("./index.html")' in worker
    assert 'request.mode === "navigate"' in worker
