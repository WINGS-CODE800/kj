# KIKI AI — Standalone Desktop & Mobile Application Architecture

An end-to-end plan to transform KIKI AI from a web-served interface into a real, standalone, installable personal AI voice assistant application for macOS (MacBook), Windows, Android, and iOS, featuring dynamic application discovery, custom robot mascot branding, and full offline-to-online voice automation.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed in Phase 1:
> - **Primary Packaging Target**: Native macOS Electron desktop application bundle with DMG installer generation, supported by a native background automation bridge (`companion/kiki_macos.py` and AppleScript).
> - **Universal App Launching Strategy**: Dynamic discovery across `/Applications` and system path, with automatic smart fallback to web applications for web-first services (Instagram, YouTube, Facebook, WhatsApp).
> - **Branding & Mascot Asset**: Official KIKI AI robot mascot asset integration with an active in-app logo uploader allowing you to replace the app icon with your exact graphic file at any time.
> - **Cross-Platform Support**: Ready-to-build configurations for macOS (`.dmg`), Windows (`.exe` NSIS), and Android/iOS (PWA Standalone Package with Web App Manifest and offline service worker).

---

## 1. Overview & Core Concept

KIKI AI will run as a standalone desktop window on your MacBook—completely independent of any web browser tab. When launched, KIKI AI displays its own dock icon, menu bar integration, and window chrome.

### Primary Capabilities:
1. **Dynamic App Launcher**: Say *"Open Instagram"*, *"Open YouTube"*, *"Open VS Code"*, *"Open Excel"*, or *"Open my Downloads"*. KIKI searches your Mac's installed applications (`/Applications`, `~/Applications`, and `mdfind` Spotlight database). If a native app is installed, it launches it natively; if not, it seamlessly launches the official web application.
2. **One Prominent Mic Button**: The main interface maintains a single glowing AI Core Orb. No share buttons or extraneous clutter on the main screen.
3. **Multilingual Speech Intelligence**: Native Tamil (`ta-IN`), Tanglish, and English command parsing powered by server-side Gemini 3.8 Flash with local fallback.
4. **Universal Voice Typing & Excel Engine**: Dictate directly into active macOS windows or generate real, downloadable `.xlsx` student marksheets.

---

## 2. User Experience & Visual Design

### The Standalone Window Experience
- **Desktop Window**: Frameless or native macOS title bar with vibrant dark-canvas styling (`#07090e`), crisp typography (`Plus Jakarta Sans` + `JetBrains Mono` for tabular numerals), and subtle glowing status indicators.
- **Center Stage**: The singular, prominent glowing AI Core Orb with soundwave animations corresponding to assistant states: `idle`, `listening`, `processing`, `speaking`, and `paused`.
- **Zero Clutter**: Secondary tooling (Excel Sheet Studio, Voice Typing Buffer, macOS Bridge Monitor, and Logo Customizer) slides out in an unobtrusive side drawer accessible via `Cmd + K`, `Spacebar`, or spoken command (*"Open settings"*).
- **Official Robot Mascot Branding**: The robot mascot icon is displayed in the application window header, desktop dock, and splash screen, with a live drag-and-drop replacement zone in the Workspace Drawer.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Electron Desktop Runtime + Native Companion
- **Chosen Approach**: Electron 34+ packaging wrapping the React frontend and Express server, paired with the local AppleScript automation helper.
- **Why**: Electron provides a true `.app` bundle and `.dmg` installer for macOS with direct access to desktop window management, global keyboard shortcuts, and native system events, fulfilling the requirement for a real standalone application.
- **Alternative Considered**: Browser shortcut / PWA only. While fast, a browser PWA cannot launch arbitrary local binaries or execute macOS AppleScript directly without a native helper. Combining Electron + local bridge delivers true standalone power.

### Decision 2: Dynamic Application Discovery
- **Chosen Approach**: Instead of hardcoding 10 app names, KIKI dynamically scans `/Applications`, `/System/Applications`, `~/Applications`, and macOS Spotlight metadata (`mdfind "kMDItemContentType == 'com.apple.application-bundle'"`).
- **Why**: Allows KIKI to discover and launch whatever applications the user actually has installed (Figma, Slack, Spotify, WhatsApp, Xcode, etc.), resolving aliases and fuzzy speech matches.

### Decision 3: Web App Fallback for Social & Media Apps
- **Chosen Approach**: If an application like Instagram or YouTube does not have a native Mac desktop client installed, KIKI automatically launches the official web platform (`https://instagram.com`, `https://youtube.com`) in the user's default browser or standalone web window.

---

## 4. Technical Architecture & System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 KIKI AI STANDALONE RUNTIME                  │
├──────────────────────────────┬──────────────────────────────┤
│  Electron Desktop Container  │  Progressive Web App (PWA)   │
│  - Native macOS .app / DMG   │  - Android & iOS Standalone  │
│  - Frameless Window Frame    │  - Service Worker & Cache    │
│  - System Tray / Dock Icon   │  - Web App Manifest          │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│              KIKI AI CORE FRONTEND & AUDIO                  │
│  - Single Prominent Microphone Core Orb                     │
│  - Speech Recognition (Tamil / Tanglish / English)          │
│  - Workspace Drawer (Excel Engine, Typing Pad, Logo Mgr)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   EXPRESS & GEMINI SERVER    │ │   macOS AUTOMATION BRIDGE  │
│  - /api/gemini/parse-intent  │ │  - Dynamic App Discovery   │
│  - Intent Classification     │ │  - AppleScript (osascript) │
│  - Gemini 3.8 Flash Brain    │ │  - Universal Keystroke Type│
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 5. Execution Steps & Deliverables

1. **Standalone Desktop Packaging Engine (Electron & DMG)**:
   - Create `electron/main.cjs` and `electron/preload.cjs` configuring the standalone desktop window, menu, and native IPC.
   - Configure `package.json` with build scripts: `npm run build:electron`, `npm run dist:mac` for DMG generation.
2. **Dynamic macOS Application Discovery & Launcher**:
   - Update `server.ts` and `companion/kiki_macos.py` with dynamic application discovery querying `/Applications`, system URL schemes, and fallback web URLs (Instagram, YouTube, WhatsApp, Facebook, VS Code, Excel, etc.).
3. **PWA Standalone Package (Android, Windows, iOS)**:
   - Configure Web App Manifest (`public/manifest.json`), service worker registration, and apple-touch-icon assets for seamless mobile home screen installation.
4. **Official Mascot Logo Asset & Customizer**:
   - Create robot mascot vector assets (`public/kiki-robot.svg`, `public/icon.png`) and in-app logo manager in the Workspace Drawer for custom logo file uploads.
5. **Exact Step-by-Step macOS MacBook Run & Installation Guide**:
   - Provide copy-paste terminal commands for building and running the standalone app on macOS.
