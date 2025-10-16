# HevalMedia Web: Header Branding Guide

This guide documents how the Heval‑Media logo (PNG) and the text “Heval‑Media” were added in the web client header for both the legacy/stable layout and the experimental layout.

## Overview

There are two major header paths in this codebase:

-   Legacy/Stable layout ("skinHeader"): DOM is constructed by `libraryMenu.js` and themed with SCSS under `src/themes/*` and `src/styles/librarybrowser.scss`.
-   Experimental layout (MUI AppBar + Drawer): React components under `src/components/toolbar` and `src/apps/experimental`.

We implemented custom branding for both:

-   Logo in header (all themes)
-   Fixed brand text “Heval‑Media” in the legacy header
-   Logo + text in the experimental header and drawer

## Assets

Place your branding under:

-   `src/assets/branding/heval-logo-main.png` (main logo)
-   `src/assets/branding/heval-banner.png` (optional banner; note: in our current tree this file was empty and not used; you can replace it later with a real banner PNG if desired)

These are copied to `dist/assets/branding` and also to `dist/favicons` by the build.

## Files changed

1. Legacy header image per theme

-   `src/themes/dark/theme.scss`
-   `src/themes/light/theme.scss`
-   `src/themes/purplehaze/theme.scss`
-   `src/themes/wmc/theme.scss`
-   `src/themes/appletv/theme.scss`

What we set:

-   `.pageTitleWithDefaultLogo` uses `../../assets/branding/heval-logo-main.png` for both desktop and TV variants, e.g.

```scss
.pageTitleWithDefaultLogo {
    background-image: url("../../assets/branding/heval-logo-main.png");
}
.layout-tv .pageTitleWithDefaultLogo {
    background-image: url("../../assets/branding/heval-logo-main.png");
}
```

If you later replace `heval-banner.png` with a real wide banner image, you can switch the desktop rule to the banner while keeping the TV rule on the logo.

2. Legacy header text (fixed)

-   `src/scripts/libraryMenu.js`

We show the fixed brand text and changed the default document title.

Changes:

-   Default title: `let documentTitle = 'Heval-Media';`
-   In `setDefaultTitle()` we add the default logo classes and set the title element text:

```js
pageTitleElement.classList.add("pageTitleWithLogo");
pageTitleElement.classList.add("pageTitleWithDefaultLogo");
pageTitleElement.style.backgroundImage = null;
pageTitleElement.innerText = "Heval-Media";
```

Additionally, to force the browser tab title to always be "Heval-Media" (instead of the server name):

-   In the same file (`src/scripts/libraryMenu.js`), we made `fetchServerName` set a fixed title and adjusted `setTitle` to not override it:

```js
const fetchServerName = (_apiClient) => {
    documentTitle = "Heval-Media";
    document.title = documentTitle;
};

// ... later in setTitle(title)
document.title = "Heval-Media";
```

To revert this and use the server name again, restore the original `fetchServerName` implementation that reads `ServerName` from `getPublicSystemInfo()` and sets `document.title = documentTitle`.

3. Legacy header layout tweaks (so text sits next to the logo)

-   `src/styles/librarybrowser.scss`

Updated `.pageTitleWithLogo`:

```scss
.pageTitleWithLogo {
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
    /* Make room for text next to the background logo */
    padding-left: 2.2em;
    width: auto;
    min-width: 13.2em;

    [dir="rtl"] & {
        background-position: right center;
        padding-left: 0;
        padding-right: 2.2em;
    }
}
```

4. Experimental layout brand

-   `src/components/toolbar/ServerButton.tsx` (brand on the AppBar)
    -   Use `src/assets/branding/heval-logo-main.png` and fixed label “Heval‑Media”.
-   `src/apps/experimental/components/drawers/DrawerHeaderLink.tsx` (brand in drawer)
    -   Import the same logo and show `systemInfo?.ServerName || 'Heval-Media'`.

5. Screensaver plugin icon (optional)

-   `src/plugins/logoScreensaver/plugin.js` imports `src/assets/branding/heval-logo-main.png` instead of the default Jellyfin icon.

6. PWA + splash + favicon (optional, already set earlier)

-   `src/manifest.json`, `src/index.html`, `src/styles/site.scss`, `src/themes/blueradiance/theme.scss` referencing the same branding assets.

## Build & Run

### Install deps (once)

```powershell
npm ci
```

### Build the web client (development or production)

```powershell
# Development build
npm run build:development

# Production build
npm run build:production
```

Outputs go to `dist/`.

### Run the dev server (optional)

```powershell
npm run serve
```

### Point Jellyfin server to the custom web UI

If you run Jellyfin manually, pass the `--webdir` argument to the server to serve your build output:

```powershell
# Example; replace D:\dev\HevalMediaDev\HevalMedia-Web\dist with your actual dist path
Jellyfin.Server.exe --webdir "D:\dev\HevalMediaDev\HevalMedia-Web\dist"
```

On Docker or other environments, mount/copy `dist` into the container/image path Jellyfin uses for its web root.

### Cache and Service Worker

Because the web app uses a service worker and browser cache:

-   Do a hard refresh (Ctrl+F5) after deploy.
-   In DevTools → Application → Service Workers: click Unregister or Update, then reload.
-   Alternatively, test in a private/incognito window.

## Customizing later

-   To change the logo: replace `src/assets/branding/heval-logo-main.png` and rebuild.
-   To switch to a wide banner: replace `src/assets/branding/heval-banner.png` with a real image and change `.pageTitleWithDefaultLogo` background-image to the banner (keep TV on logo).
-   To change the fixed text in the legacy header: edit `setDefaultTitle()` in `src/scripts/libraryMenu.js`.
-   To show the server name dynamically in the legacy header instead of fixed text:
    -   In `fetchServerName`, we already update `document.title`. You can also set `pageTitleElement.innerText = ServerName` when the info loads.

## Troubleshooting

-   See “Jellyfin” text again: ensure you’re serving the new `dist`, hard refresh, and clear the service worker.
-   Logo not visible: verify the file path and size; an empty or tiny PNG (like 31 bytes) won’t render properly.
-   Experimental AppBar not showing your text: make sure you’re using the experimental layout (localStorage or settings), and that `ServerButton.tsx` has your custom import and label.

---

Starting (1/2) Force tab title to Heval-Media

Read libraryMenu.js, lines 780 to 860

libraryMenu.js+5-11

npm run build:production
HEADER_BRANDING.md+16-0
Alles klar — ich habe es so umgesetzt, dass der Browser‑Tabtitel immer “Heval‑Media” ist, unabhängig vom Jellyfin‑Servernamen.

Was ich geändert habe

libraryMenu.js
fetchServerName setzt jetzt fest: documentTitle = 'Heval-Media'; document.title = documentTitle;
setTitle(title) überschreibt den Tab‑Titel ebenfalls mit “Heval‑Media”, damit der Servername nicht mehr dazwischenfunkt.
Build: Produktionsbuild ausgeführt, dist ist aktuell.
Doku aktualisiert: docs/HEADER_BRANDING.md beschreibt jetzt auch, wie man den fixen Tabtitel setzt bzw. zurück auf Servername stellt.
Was du jetzt tun kannst

Seite neu laden (am besten hart: Ctrl+F5) oder kurz im Inkognito-Fenster testen.
Falls ein Service Worker aktiv ist: DevTools → Application → Service Workers → Unregister/Update → Reload.
Optional

Wenn du später wieder den Servernamen im Tab sehen willst, sag Bescheid; ich stelle die originale Logik wieder her, oder du folgst der neuen Sektion in docs/HEADER_BRANDING.md (“To revert this…”).
Passt der Tabtitel jetzt überall (auch auf anderen Seiten/Layouts), oder wünschst du noch eine Variante wie “Heval‑Media • <Seitenname>”?
