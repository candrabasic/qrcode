# platka-qrcode

Platka QR is a static, client-side QR Code Generator ready for Cloudflare Pages. QR generation runs in the browser with the `qrcode` package. No backend or paid external API is required.

## Features

- Generate QR codes from text or URLs
- Live preview with 200, 400, or 600 px output sizes
- Foreground and background color customization
- L/M/Q/H error correction levels
- Optional local logo overlay
- PNG and SVG downloads
- Browser-only QR history using `localStorage`
- Responsive English UI
- SEO metadata, Open Graph tags, structured data, `robots.txt`, and sitemap

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`. To test the production build:

```bash
npm run build
npm run preview
```

The deployable output is generated in `dist/`.

## Deploy to Cloudflare Pages

### Option A - drag and drop

1. Run `npm run build`.
2. Open Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Upload assets**.
3. Set the project name to **`platka-qrcode`**.
4. Drag the `dist/` folder into the uploader and deploy.
5. Your site will be available at `https://platka-qrcode.pages.dev`.

### Option B - GitHub CI/CD

1. Push this project to your GitHub repository.
2. In Cloudflare Dashboard choose **Create application -> Pages -> Connect to Git**.
3. Select the repository and use:
   - **Project name:** `platka-qrcode`
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save and deploy. Future pushes to the production branch will trigger a new build.

No Pages Functions, database, or `wrangler.toml` is required for this client-only version.

## Contact and official websites

- Email: `platkasoftwaredigital@gmail.com`
- Phone: `081111102880`
- Official websites: [platkadigital.com](https://platkadigital.com) and [platka.io](https://platka.io)

## Legal

The site includes an in-page Privacy Policy and Terms & Conditions section. QR content and uploaded logos are processed locally in the browser and are not sent to our server.
