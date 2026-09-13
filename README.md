# platka-qr

QR Code Generator static, client-side, dan siap untuk Cloudflare Pages. Semua pembuatan QR berlangsung di browser menggunakan package `qrcode`; tidak ada backend atau API eksternal.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite (biasanya `http://localhost:5173`). Untuk menguji hasil production:

```bash
npm run build
npm run preview
```

Folder hasil deploy ada di `dist/`.

## Deploy ke Cloudflare Pages

### Opsi A — drag-and-drop

1. Jalankan `npm run build`.
2. Buka Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
3. Beri nama project **`platka-qr`**.
4. Drag folder `dist/` ke uploader, lalu deploy.
5. Situs akan tersedia di `https://platka-qr.pages.dev` (jika nama masih tersedia).

### Opsi B — GitHub + CI/CD

1. Push seluruh source project ini ke repository GitHub.
2. Di Cloudflare Dashboard pilih **Create application → Pages → Connect to Git** lalu pilih repository.
3. Isi konfigurasi berikut:
   - **Project name:** `platka-qr`
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Simpan dan deploy. Setiap push ke branch production akan memicu build otomatis.

Tidak diperlukan `wrangler.toml` maupun Pages Functions untuk versi client-only ini.
