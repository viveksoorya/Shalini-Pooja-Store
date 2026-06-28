(function () {
  var S = "https://subscription-server.onrender.com"
  var K = "vs_license_key", D = "vs_demo_mode", P = "shalini-pooja-store"

  if (new URLSearchParams(location.search).get("demo") === "1") localStorage.setItem(D, "1")
  if (localStorage.getItem(D) === "1") return

  var key = localStorage.getItem(K)
  if (!key) return showOverlay()

  var x = new XMLHttpRequest()
  x.open("GET", S + "/validate?key=" + encodeURIComponent(key) + "&product=" + encodeURIComponent(P))
  x.onload = function () { try { if (!JSON.parse(x.responseText).valid) showOverlay() } catch (e) {} }
  x.send()

  function showOverlay() {
    var d = document.createElement("div"); d.id = "vs-license-overlay"
    d.innerHTML = '<div style="position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;font-family:\'DM Sans\',sans-serif"><div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center"><div style="font-size:2.5rem;margin-bottom:0.5rem">🔑</div><h2 style="margin:0 0 0.5rem;font-size:1.3rem;color:#1a1a2e">License Required</h2><p style="color:#6b7280;margin-bottom:1.5rem;font-size:0.9rem">Enter your license key or try the demo.</p><div style="display:flex;flex-direction:column;gap:0.75rem"><input id="vs-license-input" type="text" placeholder="VS-XXXXXXXX-XXXXXXXX" style="padding:0.75rem 1rem;border:2px solid #e5e7eb;border-radius:8px;font:1rem monospace;text-align:center;letter-spacing:1px"><button onclick="vsActivate(\'' + S + '\',\'' + P + '\')" style="padding:0.75rem;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:0.95rem;cursor:pointer">Activate License</button><button onclick="vsDemo()" style="padding:0.6rem;background:#f3f4f6;color:#374151;border:none;border-radius:8px;font-weight:500;font-size:0.85rem;cursor:pointer">Try Demo (No License)</button></div><p id="vs-license-error" style="color:#dc2626;margin-top:0.75rem;font-size:0.85rem;display:none"></p></div></div>'
    document.body.appendChild(d)
  }

  window.vsActivate = function (srv, prod) {
    var inp = document.getElementById("vs-license-input"), err = document.getElementById("vs-license-error"), key = inp.value.trim()
    if (!key) { err.textContent = "Enter a license key"; err.style.display = "block"; return }
    var x = new XMLHttpRequest()
    x.open("GET", srv + "/validate?key=" + encodeURIComponent(key) + "&product=" + encodeURIComponent(prod))
    x.onload = function () {
      try {
        var d = JSON.parse(x.responseText)
        if (d.valid) { localStorage.setItem(K, key); document.getElementById("vs-license-overlay").remove(); location.reload() }
        else { err.textContent = d.reason; err.style.display = "block" }
      } catch (e) { err.textContent = "Cannot reach license server"; err.style.display = "block" }
    }
    x.onerror = function () { err.textContent = "Cannot reach license server"; err.style.display = "block" }
    x.send()
  }

  window.vsDemo = function () { localStorage.setItem(D, "1"); document.getElementById("vs-license-overlay").remove(); location.reload() }
})()
