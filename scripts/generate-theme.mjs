#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { input: null, name: "figma", file: "src/shared/styles/themes.css" };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--input") opts.input = args[++i];
    else if (a === "--name") opts.name = args[++i];
    else if (a === "--file") opts.file = args[++i];
  }
  if (!opts.input) {
    console.error("Missing --input path to tokens JSON");
    process.exit(1);
  }
  return opts;
}

const VAR_MAP = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  success: "--success",
  successForeground: "--success-foreground",
  warning: "--warning",
  warningForeground: "--warning-foreground",
  info: "--info",
  infoForeground: "--info-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
  sidebar: "--sidebar",
  sidebarForeground: "--sidebar-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarAccent: "--sidebar-accent",
  sidebarAccentForeground: "--sidebar-accent-foreground",
  sidebarBorder: "--sidebar-border",
  sidebarRing: "--sidebar-ring",
  radius: "--radius",
};

function ensureBlocks(css, name) {
  const selectors = [`.${name}`, `.dark.${name}`];
  for (const sel of selectors) {
    const re = new RegExp(String.raw`${sel}\s*\{[\s\S]*?\}`, "m");
    if (!re.test(css)) {
      css += `\n\n${sel} {\n}\n`;
    }
  }
  return css;
}

function upsertVarsInBlock(css, selector, varsObj) {
  const blockRe = new RegExp(String.raw`(${selector}\s*\{)([\s\S]*?)(\})`, "m");
  const m = css.match(blockRe);
  if (!m) return css;
  const before = m[1];
  let inner = m[2];
  const after = m[3];

  for (const [key, cssVar] of Object.entries(VAR_MAP)) {
    if (!(key in varsObj)) continue;
    const value = String(varsObj[key]).trim();
    const lineRe = new RegExp(String.raw`(^|\n)\s*${cssVar}\s*:\s*[^;]*;`, "m");
    const newLine = `\n  ${cssVar}: ${value};`;
    if (lineRe.test(inner)) {
      inner = inner.replace(lineRe, (s) => s.replace(/:[^;]*;/, `: ${value};`));
    } else {
      inner = inner.trimEnd() + newLine + "\n";
    }
  }

  return css.replace(blockRe, `${before}\n${inner.trim()}\n${after}`);
}

function upsertScaleVars(css, selector, scales) {
  const blockRe = new RegExp(String.raw`(${selector}\s*\{)([\s\S]*?)(\})`, "m");
  const m = css.match(blockRe);
  if (!m) return css;
  const before = m[1];
  let inner = m[2];
  const after = m[3];

  for (const [scaleName, shades] of Object.entries(scales || {})) {
    for (const [shade, valueRaw] of Object.entries(shades || {})) {
      const cssVar = `--${scaleName}-${shade}`;
      const value = String(valueRaw).trim();
      const lineRe = new RegExp(String.raw`(^|\n)\s*${cssVar}\s*:\s*[^;]*;`, "m");
      const newLine = `\n  ${cssVar}: ${value};`;
      if (lineRe.test(inner)) {
        inner = inner.replace(lineRe, (s) => s.replace(/:[^;]*;/, `: ${value};`));
      } else {
        inner = inner.trimEnd() + newLine + "\n";
      }
    }
  }

  return css.replace(blockRe, `${before}\n${inner.trim()}\n${after}`);
}

function main() {
  const opts = parseArgs();
  const inputPath = path.resolve(opts.input);
  const outPath = path.resolve(opts.file);
  const raw = fs.readFileSync(inputPath, "utf8");
  const tokens = JSON.parse(raw);
  let css = fs.readFileSync(outPath, "utf8");
  css = ensureBlocks(css, tokens.name || opts.name);
  const themeName = tokens.name || opts.name;
  css = upsertVarsInBlock(css, `.${themeName}`, tokens.light || {});
  css = upsertVarsInBlock(css, `.dark.${themeName}`, tokens.dark || {});
  // Write scale variables into both light and dark blocks for convenience
  if (tokens.scales) {
    css = upsertScaleVars(css, `.${themeName}`, tokens.scales);
    css = upsertScaleVars(css, `.dark.${themeName}`, tokens.scales);
  }
  fs.writeFileSync(outPath, css, "utf8");
  console.log(`Updated ${outPath} for theme '${themeName}'.`);
}

main();
