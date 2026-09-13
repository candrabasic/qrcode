import QRCode from 'qrcode';

// Keep the uploaded logo in the SVG download as well as in the canvas preview.
let uploadedLogo = null;

function addLogoToSvg(svg, dataUrl, size) {
  const logoSize = Math.round(size * 0.22);
  const offset = Math.round((size - logoSize) / 2);
  const padding = Math.max(6, Math.round(size * 0.018));
  const overlay = `<rect x="${offset - padding}" y="${offset - padding}" width="${logoSize + padding * 2}" height="${logoSize + padding * 2}" rx="${padding}" fill="#ffffff"/><image href="${dataUrl}" x="${offset}" y="${offset}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid slice"/>`;
  return svg.replace('</svg>', `${overlay}</svg>`);
}

setTimeout(() => {
  const fileInput = document.getElementById('logo');
  const svgButton = document.getElementById('download-svg');
  if (!fileInput || !svgButton) return;
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { uploadedLogo = reader.result; };
    reader.readAsDataURL(file);
  }, true);
  document.getElementById('remove-logo')?.addEventListener('click', () => { uploadedLogo = null; }, true);
  svgButton.addEventListener('click', async (event) => {
    if (!uploadedLogo) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const text = document.getElementById('content').value.trim();
    const size = Number(document.getElementById('size').value);
    const errorCorrectionLevel = document.getElementById('error').value;
    const dark = document.getElementById('foreground').value;
    const light = document.getElementById('background').value;
    const svg = await QRCode.toString(text, { type: 'svg', width: size, margin: 2, errorCorrectionLevel, color: { dark, light } });
    const link = document.createElement('a');
    link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(addLogoToSvg(svg, uploadedLogo, size))}`;
    link.download = 'platka-qr.svg';
    link.click();
  }, true);
}, 0);
