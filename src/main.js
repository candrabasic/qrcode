import QRCode from 'qrcode';
import './style.css';

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="/" aria-label="Platka QR home"><span class="brand-mark">⌁</span><span>platka<span class="brand-accent">.</span>qr</span></a>
    <span class="privacy-pill"><span class="dot"></span> 100% client-side</span>
  </header>
  <main class="shell">
    <section class="hero">
      <p class="eyebrow">QR CODE GENERATOR</p>
      <h1>Bagikan apa saja.<br /><em>Scan di mana saja.</em></h1>
      <p class="hero-copy">Buat QR code yang bersih dan siap digunakan dalam hitungan detik. Data Anda tidak pernah meninggalkan browser.</p>
    </section>

    <section class="workspace">
      <div class="panel controls-panel">
        <div class="panel-heading"><div><p class="section-kicker">01 / KONTEN</p><h2>Isi QR code</h2></div><span class="live-badge">LIVE PREVIEW</span></div>
        <label class="field-label" for="content">Teks atau URL</label>
        <textarea id="content" rows="4" placeholder="https://contoh.com atau tulis pesan Anda di sini...">https://platka.dev</textarea>
        <div class="field-row three">
          <div><label class="field-label" for="size">Ukuran</label><select id="size"><option value="200">200 px</option><option value="400" selected>400 px</option><option value="600">600 px</option></select></div>
          <div><label class="field-label" for="error">Koreksi error</label><select id="error"><option value="L">L · 7%</option><option value="M" selected>M · 15%</option><option value="Q">Q · 25%</option><option value="H">H · 30%</option></select></div>
        </div>

        <div class="divider"></div>
        <div class="panel-heading compact"><div><p class="section-kicker">02 / GAYA</p><h2>Sesuaikan tampilan</h2></div></div>
        <div class="color-row">
          <label class="color-control"><span>Warna QR</span><span class="color-picker"><input id="foreground" type="color" value="#101828" /><output id="foreground-value">#101828</output></span></label>
          <label class="color-control"><span>Latar</span><span class="color-picker"><input id="background" type="color" value="#ffffff" /><output id="background-value">#FFFFFF</output></span></label>
        </div>
        <label class="field-label logo-label" for="logo">Logo tengah <span>opsional</span></label>
        <div class="upload-wrap"><input id="logo" type="file" accept="image/png,image/jpeg,image/webp" /><label for="logo" class="upload-button"><span>＋</span><span id="logo-name">Tambah logo (PNG, JPG, WEBP)</span></label><button id="remove-logo" class="remove-logo" type="button" hidden>×</button></div>
        <button id="generate" class="generate-button" type="button">Generate QR <span>→</span></button>
        <p id="status" class="status" role="status"></p>
      </div>

      <div class="panel preview-panel">
        <div class="panel-heading"><div><p class="section-kicker">03 / HASIL</p><h2>Preview QR</h2></div><span id="format-label" class="format-label">PNG · SVG</span></div>
        <div class="qr-stage"><div class="qr-frame"><canvas id="qr-canvas" aria-label="Preview QR code"></canvas><div id="empty-state" class="empty-state"><span>⌁</span><p>QR code Anda<br />akan muncul di sini</p></div></div></div>
        <div class="preview-meta"><span id="meta-size">400 × 400 px</span><span class="meta-separator">·</span><span id="meta-type">URL / TEXT</span></div>
        <div class="download-row"><button id="download-png" class="download-button primary" type="button" disabled><span>↓</span> Download PNG</button><button id="download-svg" class="download-button" type="button" disabled><span>↓</span> Download SVG</button></div>
        <p class="hint">Tip: gunakan level koreksi H jika QR akan dicetak bersama logo.</p>
      </div>
    </section>

    <section class="history-section"><div class="history-title"><p class="section-kicker">RECENT</p><h2>QR terakhir</h2></div><div id="history" class="history-list"><p class="history-empty">QR yang Anda buat akan tersimpan sementara di browser ini.</p></div></section>
  </main>
  <footer><span>platka.qr</span><span>Dibuat dengan privasi sebagai standar.</span></footer>
`;

const $ = (id) => document.getElementById(id);
let logoDataUrl = null;
let lastSvg = '';
let debounceTimer;

function options() {
  return { width: Number($('size').value), margin: 2, errorCorrectionLevel: $('error').value, color: { dark: $('foreground').value, light: $('background').value } };
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('platka-qr-history') || '[]');
  const el = $('history');
  if (!history.length) { el.innerHTML = '<p class="history-empty">QR yang Anda buat akan tersimpan sementara di browser ini.</p>'; return; }
  el.innerHTML = history.map((item, i) => `<button class="history-item" data-history="${i}" title="Gunakan kembali"><span class="history-icon">⌁</span><span class="history-text">${escapeHtml(item.text)}</span><span class="history-arrow">↗</span></button>`).join('');
  el.querySelectorAll('[data-history]').forEach((button) => button.addEventListener('click', () => { $('content').value = history[button.dataset.history].text; generate(); }));
}

function escapeHtml(value) { return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char])); }

async function generate() {
  const text = $('content').value.trim();
  const canvas = $('qr-canvas');
  if (!text) { canvas.hidden = true; $('empty-state').hidden = false; $('download-png').disabled = true; $('download-svg').disabled = true; $('status').textContent = 'Masukkan teks atau URL terlebih dahulu.'; return; }
  try {
    const opts = options();
    await QRCode.toCanvas(canvas, text, opts);
    lastSvg = await QRCode.toString(text, { ...opts, type: 'svg' });
    canvas.hidden = false; $('empty-state').hidden = true; $('download-png').disabled = false; $('download-svg').disabled = false;
    $('meta-size').textContent = `${opts.width} × ${opts.width} px`;
    $('meta-type').textContent = /^https?:\/\//i.test(text) ? 'URL / LINK' : 'TEXT';
    $('status').textContent = 'QR berhasil diperbarui.';
    const history = JSON.parse(localStorage.getItem('platka-qr-history') || '[]').filter((item) => item.text !== text);
    history.unshift({ text }); localStorage.setItem('platka-qr-history', JSON.stringify(history.slice(0, 5))); renderHistory();
    if (logoDataUrl) drawLogo(canvas, logoDataUrl);
  } catch (error) { $('status').textContent = 'Konten terlalu panjang untuk ukuran QR ini.'; console.error(error); }
}

function drawLogo(canvas, src) {
  const image = new Image(); image.onload = () => { const ctx = canvas.getContext('2d'); const box = canvas.width * 0.22; const x = (canvas.width - box) / 2; const y = x; ctx.fillStyle = $('background').value; ctx.fillRect(x - 8, y - 8, box + 16, box + 16); ctx.drawImage(image, x, y, box, box); }; image.src = src;
}

function download(name, href) { const anchor = document.createElement('a'); anchor.href = href; anchor.download = name; anchor.click(); }

$('generate').addEventListener('click', generate);
['content', 'size', 'error', 'foreground', 'background'].forEach((id) => $(id).addEventListener('input', () => { if (id === 'foreground' || id === 'background') { $(`${id}-value`).value = $(id).value.toUpperCase(); $(`${id}-value`).textContent = $(id).value.toUpperCase(); } clearTimeout(debounceTimer); debounceTimer = setTimeout(generate, id === 'content' ? 350 : 100); }));
$('logo').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { logoDataUrl = reader.result; $('logo-name').textContent = file.name; $('remove-logo').hidden = false; generate(); }; reader.readAsDataURL(file); });
$('remove-logo').addEventListener('click', () => { logoDataUrl = null; $('logo').value = ''; $('logo-name').textContent = 'Tambah logo (PNG, JPG, WEBP)'; $('remove-logo').hidden = true; generate(); });
$('download-png').addEventListener('click', () => download('platka-qr.png', $('qr-canvas').toDataURL('image/png')));
$('download-svg').addEventListener('click', () => download('platka-qr.svg', `data:image/svg+xml;charset=utf-8,${encodeURIComponent(lastSvg)}`));
renderHistory(); generate();
