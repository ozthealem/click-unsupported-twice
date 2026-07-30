# Click Unsupported Twice

An Obsidian plugin. Files that Obsidian can't open natively (for example
`.psd`, `.ai`, `.zip`) are **selected on a single click** and **opened in
the default app on a double click** — the same way a desktop file manager
behaves. Files Obsidian handles itself (Markdown, PDF, images, audio, video)
are left untouched.

## Why

By default, clicking an unsupported file in the file explorer can immediately
launch the external application. This plugin prevents accidental launches: a
single click only highlights the file, and you open it deliberately with a
double click.

## Install

### From the community plugins browser
1. Settings → Community plugins → Browse.
2. Search for "Click Unsupported Twice", install and enable it.

### Manual
1. Download `main.js` and `manifest.json` from the latest release.
2. Put them in `<your-vault>/.obsidian/plugins/click-unsupported-twice/`.
3. Reload Obsidian, then enable the plugin in Settings → Community plugins.

Make sure **Settings → Files and links → Detect all file extensions** is on,
so unsupported files show up in the explorer.

## Usage

- Single click on an unsupported file: selects it, does not open.
- Double click: opens it in your operating system's default app.
- To change which extensions are treated as "supported", edit the `NATIVE`
  set at the top of `main.js`.

## Notes

- Desktop only (it uses the default-app / Electron shell to open files).

## License

GNU General Public License v3.0. See the LICENSE file.
