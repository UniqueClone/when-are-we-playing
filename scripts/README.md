# Scripts

Development utility scripts that are not exposed to end users.

## generate-icons.html

A browser-based utility for generating PWA icons from the source SVG file.

**Note:** This file is intentionally kept out of the `public` folder so it's not accessible to end users.

### How to use:

1. Serve this directory with a local HTTP server:
   ```bash
   npx http-server . -p 8000
   ```

2. Open http://localhost:8000/generate-icons.html in your browser

3. Click "Generate All Icons" to download all required icon sizes
