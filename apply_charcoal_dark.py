#!/usr/bin/env python3
"""
apply_charcoal_dark.py
Transforms the dark mode palette from Warm Amber to Royal Charcoal.
Royal Charcoal palette:
  #1E2023  Deep Dark Charcoal (bg-main)
  #1E1F22  Near Black Charcoal (bg-secondary)
  #27292D  Card background
  #2F3235  Card hover
  #4C4E51  Silver Charcoal (accent)
  #3A3D41  Border
  #8A8D91  Silver text muted
  #C8CACD  Light silver text-secondary
  #EAEBED  Near white text-primary
"""
import re, sys, os

WORKSPACE = r"C:\Users\shiva\.gemini\antigravity\scratch\project-"
CSS_FILE  = os.path.join(WORKSPACE, "styles.css")
JS_FILE   = os.path.join(WORKSPACE, "main.js")
HTML_FILE = os.path.join(WORKSPACE, "index.html")

NEW_CSS_VER = "v=50"
NEW_JS_VER  = "v=50"

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# HELPERS
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print(f"  âœ“ Written: {path}")

def assert_contains(content, snippet, label):
    if snippet not in content:
        print(f"  FAIL: '{label}' not found")
        sys.exit(1)
    print(f"  OK: {label}")

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 1. STYLES.CSS â€” ROOT VARIABLES  (Royal Charcoal)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def patch_css(css):
    print("\n[CSS] Patching :root variables...")

    # --- :root block replacement ---
    old_root = """:root {
    /* Warm Amber Cinematic Dark Palette */
    --bg-main: #0A0806;
    --bg-secondary: #0F0C09;
    --bg-card: #161108;
    --bg-card-hover: #1E160C;
    --text-primary: #FAFAF0;
    --text-secondary: #E5D5BC;
    --text-muted: #B89868;
    --border-color: #2E2216;
    --neutral-support: #6B5540;

    /* Warm Amber Accent (#D97706 Amber / #C8620A Burnt Orange) */
    --accent: #D97706;
    --accent-rgb: 217, 119, 6;
    --accent-glow: rgba(217, 119, 6, 0.45);
    --accent-hover: #F59E0B;

    --secondary-amber: #C8620A;
    --secondary-amber-rgb: 200, 98, 10;
}"""

    new_root = """:root {
    /* Royal Charcoal Dark Palette */
    --bg-main: #1E2023;
    --bg-secondary: #1E1F22;
    --bg-card: #27292D;
    --bg-card-hover: #2F3235;
    --text-primary: #EAEBED;
    --text-secondary: #C8CACD;
    --text-muted: #8A8D91;
    --border-color: #3A3D41;
    --neutral-support: #5C5F63;

    /* Silver Charcoal Accent */
    --accent: #8A8D91;
    --accent-rgb: 138, 141, 145;
    --accent-glow: rgba(138, 141, 145, 0.35);
    --accent-hover: #C8CACD;

    --secondary-charcoal: #4C4E51;
    --secondary-charcoal-rgb: 76, 78, 81;
}"""

    assert_contains(css, old_root.split('\n')[2], "old root bg-main line")
    css = css.replace(old_root, new_root)
    print("  âœ“ :root block replaced")

    # --- Global Theme Variant: amber-warm â†’ charcoal ---
    old_theme_block = """/* Global Theme Variant: Warm Amber Cinematic (Default) */
html[data-theme="orchid"], html[data-theme="amber-warm"], :root {
    --accent: #D97706;
    --accent-rgb: 217, 119, 6;
    --accent-glow: rgba(217, 119, 6, 0.45);
    --accent-hover: #F59E0B;
    --secondary-amber: #C8620A;
}"""

    new_theme_block = """/* Global Theme Variant: Royal Charcoal (Default) */
html[data-theme="orchid"], html[data-theme="amber-warm"], html[data-theme="charcoal"], :root {
    --accent: #8A8D91;
    --accent-rgb: 138, 141, 145;
    --accent-glow: rgba(138, 141, 145, 0.35);
    --accent-hover: #C8CACD;
    --secondary-charcoal: #4C4E51;
}"""

    if old_theme_block in css:
        css = css.replace(old_theme_block, new_theme_block)
        print("  âœ“ Theme variant block replaced")

    # --- Orchid overrides: amber â†’ silver-charcoal ---
    css = css.replace("color: #F59E0B !important;", "color: #C8CACD !important;")
    css = css.replace("background-color: #D97706 !important;", "background-color: #8A8D91 !important;")
    css = css.replace(
        "border-color: rgba(217, 119, 6, 0.6) !important;",
        "border-color: rgba(138, 141, 145, 0.5) !important;"
    )
    css = css.replace(
        "background-color: rgba(200, 98, 10, 0.25) !important;",
        "background-color: rgba(76, 78, 81, 0.25) !important;"
    )
    print("  âœ“ Orchid theme amber overrides replaced")

    # --- body background-color dark ---
    css = css.replace("background-color: #0A0806;", "background-color: #1E2023;")

    # --- Body background gradient: replace amber radials with charcoal ---
    # The dark body likely has no inline gradient (only light mode does), but patch if present
    old_body_bg_dark = """body {
    background-color: #0A0806;"""
    new_body_bg_dark = """body {
    background-color: #1E2023;"""
    css = css.replace(old_body_bg_dark, new_body_bg_dark)
    print("  âœ“ body background-color replaced")

    # --- Glossy card: add deeper Royal Charcoal shadow ---
    old_glossy_shadow = """    box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 20px 40px rgba(0, 0, 0, 0.65);"""
    new_glossy_shadow = """    box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.12),
        inset 0 -1px 1px rgba(0, 0, 0, 0.45),
        0 4px 8px rgba(0, 0, 0, 0.55),
        0 12px 30px rgba(0, 0, 0, 0.65),
        0 30px 60px rgba(0, 0, 0, 0.50),
        0 0 0 1px rgba(76, 78, 81, 0.20);"""
    if old_glossy_shadow in css:
        css = css.replace(old_glossy_shadow, new_glossy_shadow)
        print("  âœ“ Glossy card shadow upgraded")

    # --- Navbar background (dark mode default) ---
    # Replace any amber glow in navbar
    css = re.sub(
        r'rgba\(200,\s*98,\s*10,\s*[\d.]+\)',
        'rgba(76, 78, 81, 0.25)',
        css
    )
    css = re.sub(
        r'rgba\(217,\s*119,\s*6,\s*([\d.]+)\)',
        lambda m: f'rgba(138, 141, 145, {m.group(1)})',
        css
    )
    print("  âœ“ Amber rgba values replaced with Silver Charcoal rgba")

    # --- Remove old amber secondary var references ---
    css = css.replace("--secondary-amber:", "--secondary-charcoal:")
    css = css.replace("--secondary-amber-rgb:", "--secondary-charcoal-rgb:")

    return css


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 2. MAIN.JS â€” SHADER VECTORS + uAccentColor
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def patch_js(js):
    print("\n[JS] Patching Three.js shader + accent color...")

    # Replace shader dark mode base vectors (left side of mix())
    # #1E2023 = (0.118, 0.125, 0.137)
    # #1E1F22 = (0.118, 0.122, 0.133)
    # #27292D = (0.153, 0.161, 0.176)
    # Silver vapor: (0.282, 0.290, 0.318) = #484A51
    # Silver rim: (0.596, 0.604, 0.631) = #989AA1

    old_shader = """            // Base: deep warm charcoal #0A0806 -> Crimson Velvet #2C0F12
                    vec3 cBaseBlack    = mix(vec3(0.039, 0.031, 0.024), vec3(0.173, 0.059, 0.071), uLightMode); // #0A0806 -> #2C0F12
                    vec3 cCharcoal     = mix(vec3(0.059, 0.047, 0.035), vec3(0.220, 0.078, 0.094), uLightMode); // #0F0C09 -> #381418
                    vec3 cGraphite     = mix(vec3(0.086, 0.067, 0.047), vec3(0.263, 0.094, 0.114), uLightMode); // #161108 -> #43181D
                    vec3 cAmberVapor   = mix(vec3(0.549, 0.302, 0.039), vec3(0.420, 0.118, 0.137), uLightMode); // Amber vapor -> #6B1E23 Crimson Velvet
                    vec3 cAmberRim     = mix(vec3(0.851, 0.380, 0.039), vec3(0.882, 0.114, 0.282), uLightMode); // #D96110 Amber Rim -> #E11D48 Ruby Rim"""

    new_shader = """            // Base: Royal Charcoal #1E2023 -> Crimson Velvet #2C0F12
                    vec3 cBaseBlack    = mix(vec3(0.118, 0.125, 0.137), vec3(0.173, 0.059, 0.071), uLightMode); // #1E2023 -> #2C0F12
                    vec3 cCharcoal     = mix(vec3(0.118, 0.122, 0.133), vec3(0.220, 0.078, 0.094), uLightMode); // #1E1F22 -> #381418
                    vec3 cGraphite     = mix(vec3(0.153, 0.161, 0.176), vec3(0.263, 0.094, 0.114), uLightMode); // #27292D -> #43181D
                    vec3 cAmberVapor   = mix(vec3(0.282, 0.290, 0.318), vec3(0.420, 0.118, 0.137), uLightMode); // Silver Charcoal vapor -> Crimson Velvet
                    vec3 cAmberRim     = mix(vec3(0.541, 0.549, 0.573), vec3(0.882, 0.114, 0.282), uLightMode); // #8A8C92 Silver Rim -> #E11D48 Ruby Rim"""

    # Try exact match first
    if old_shader in js:
        js = js.replace(old_shader, new_shader)
        print("  âœ“ Shader vectors replaced (exact match)")
    else:
        # Try to patch line by line with regex
        js = re.sub(
            r'vec3 cBaseBlack\s*=\s*mix\(vec3\([^)]+\)',
            'vec3 cBaseBlack    = mix(vec3(0.118, 0.125, 0.137)',
            js
        )
        js = re.sub(
            r'vec3 cCharcoal\s*=\s*mix\(vec3\([^)]+\)',
            'vec3 cCharcoal     = mix(vec3(0.118, 0.122, 0.133)',
            js
        )
        js = re.sub(
            r'vec3 cGraphite\s*=\s*mix\(vec3\([^)]+\)',
            'vec3 cGraphite     = mix(vec3(0.153, 0.161, 0.176)',
            js
        )
        js = re.sub(
            r'vec3 cAmberVapor\s*=\s*mix\(vec3\([^)]+\)',
            'vec3 cAmberVapor   = mix(vec3(0.282, 0.290, 0.318)',
            js
        )
        js = re.sub(
            r'vec3 cAmberRim\s*=\s*mix\(vec3\([^)]+\)',
            'vec3 cAmberRim     = mix(vec3(0.541, 0.549, 0.573)',
            js
        )
        print("  âœ“ Shader vectors replaced (regex fallback)")

    # uAccentColor: Amber -> Silver Charcoal
    js = js.replace(
        "uAccentColor: { value: new THREE.Color('#D97706') }",
        "uAccentColor: { value: new THREE.Color('#8A8D91') }"
    )
    print("  âœ“ uAccentColor changed from #D97706 to #8A8D91")

    # Mode toggle labels: keep Crimson Velvet / update dark label
    # Already shows "Bright Mode" when in dark, keep as is

    return js


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 3. INDEX.HTML â€” Body class + accent amber Tailwind classes
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def patch_html(html):
    print("\n[HTML] Patching body class and amber Tailwind classes...")

    # body class: bg-[#0A0806] -> bg-[#1E2023]
    html = html.replace('bg-[#0A0806]', 'bg-[#1E2023]')
    print("  âœ“ body bg-[#0A0806] -> bg-[#1E2023]")

    # cinematicIntro overlay bg
    html = html.replace('bg-[#121214]', 'bg-[#1E2023]')
    html = html.replace('bg-[#0A0806]', 'bg-[#1E2023]')
    print("  âœ“ Overlay bg colors updated")

    # Ring: ring-amber-500/30 -> ring-slate-500/30
    html = html.replace('ring-amber-500/30', 'ring-slate-400/25')
    html = html.replace('ring-amber-500/20', 'ring-slate-400/20')

    # text-amber-* -> text-slate-* (keep specific ones readable)
    html = re.sub(r'text-amber-400', 'text-slate-300', html)
    html = re.sub(r'text-amber-500', 'text-slate-300', html)
    html = re.sub(r'text-amber-300', 'text-slate-200', html)
    html = re.sub(r'text-amber-600', 'text-slate-400', html)
    html = re.sub(r'text-amber-200', 'text-slate-200', html)
    html = re.sub(r'text-amber-100', 'text-slate-100', html)

    # bg-amber-* -> bg-slate-*
    html = re.sub(r'bg-amber-500/10', 'bg-slate-600/15', html)
    html = re.sub(r'bg-amber-500/20', 'bg-slate-600/20', html)
    html = re.sub(r'bg-amber-900/30', 'bg-slate-800/30', html)
    html = re.sub(r'bg-amber-400', 'bg-slate-400', html)
    html = re.sub(r'bg-amber-500', 'bg-slate-500', html)

    # border-amber-* -> border-slate-*
    html = re.sub(r'border-amber-500/30', 'border-slate-500/30', html)
    html = re.sub(r'border-amber-500/20', 'border-slate-500/20', html)
    html = re.sub(r'border-amber-400', 'border-slate-400', html)
    html = re.sub(r'border-amber-500', 'border-slate-500', html)
    html = re.sub(r'border-amber-600', 'border-slate-600', html)

    # from-amber-* / via-amber-* / to-amber-*
    html = re.sub(r'from-amber-\d+', 'from-slate-500', html)
    html = re.sub(r'via-amber-\d+', 'via-slate-600', html)
    html = re.sub(r'to-amber-\d+', 'to-slate-700', html)

    # hover:text-amber-* / hover:border-amber-*
    html = re.sub(r'hover:text-amber-\d+', 'hover:text-slate-200', html)
    html = re.sub(r'hover:border-amber-\d+', 'hover:border-slate-400', html)
    html = re.sub(r'hover:bg-amber-\d+', 'hover:bg-slate-600', html)

    # Inline amber hex colors
    html = re.sub(r'#D97706', '#8A8D91', html)
    html = re.sub(r'#F59E0B', '#C8CACD', html)
    html = re.sub(r'#C8620A', '#4C4E51', html)
    html = re.sub(r'#FDE68A', '#EAEBED', html)
    html = re.sub(r'#78350F', '#27292D', html)

    print("  âœ“ Amber Tailwind classes replaced with slate/charcoal")

    # --- Cache buster ---
    html = re.sub(r'styles\.css\?v=\d+', f'styles.css?{NEW_CSS_VER}', html)
    html = re.sub(r'main\.js\?v=\d+', f'main.js?{NEW_JS_VER}', html)
    print(f"  âœ“ Cache busters bumped to {NEW_CSS_VER}")

    return html


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 4. STYLES.CSS â€” Additional dark mode navbar deep shadow
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def patch_css_navbar(css):
    print("\n[CSS] Injecting deep cinematic navbar shadow for dark mode...")

    # Find existing navbar section and inject/update shadow
    # Target the default (dark) navbar box-shadow if it has amber
    css = re.sub(
        r'(#navbar\s*\{[^}]*box-shadow\s*:\s*)([^;]+;)',
        lambda m: m.group(1) +
            '0 2px 6px rgba(0,0,0,0.50), 0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(76,78,81,0.20), inset 0 1px 0 rgba(255,255,255,0.06);',
        css,
        count=1
    )

    # Replace amber glow in photo border animation if present
    css = re.sub(
        r'#fbbf24',
        '#8A8D91',
        css, flags=re.IGNORECASE
    )
    css = re.sub(
        r'#f59e0b',
        '#C8CACD',
        css, flags=re.IGNORECASE
    )
    css = re.sub(
        r'#d97706',
        '#4C4E51',
        css, flags=re.IGNORECASE
    )

    print("  âœ“ Navbar shadow + photo border amber colors updated")
    return css


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# MAIN
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def main():
    print("=" * 65)
    print(" Royal Charcoal Dark Mode Transformation")
    print("=" * 65)

    css  = read(CSS_FILE)
    js   = read(JS_FILE)
    html = read(HTML_FILE)

    css  = patch_css(css)
    css  = patch_css_navbar(css)
    js   = patch_js(js)
    html = patch_html(html)

    print("\n[WRITE] Saving files...")
    write(CSS_FILE, css)
    write(JS_FILE, js)
    write(HTML_FILE, html)

    # â”€â”€ Final assertions â”€â”€
    print("\n[VERIFY] Running assertions...")
    css2  = read(CSS_FILE)
    js2   = read(JS_FILE)
    html2 = read(HTML_FILE)

    assert_contains(css2,  '--bg-main: #1E2023;',               'CSS root bg-main')
    assert_contains(css2,  '--accent: #8A8D91;',                'CSS root accent')
    assert_contains(css2,  '--bg-card: #27292D;',               'CSS root bg-card')
    assert_contains(css2,  'background-color: #1E2023;',        'CSS body bg-color')
    assert_contains(js2,   'vec3(0.118, 0.125, 0.137)',         'JS cBaseBlack Royal Charcoal')
    assert_contains(js2,   "new THREE.Color('#8A8D91')",        'JS uAccentColor charcoal')
    assert_contains(html2, f'styles.css?{NEW_CSS_VER}',         'HTML CSS cache buster')
    assert_contains(html2, f'main.js?{NEW_JS_VER}',             'HTML JS cache buster')

    print("\nâœ… All done â€” Royal Charcoal applied successfully!")
    print("   Next step: git add -A && git commit -m 'feat: Royal Charcoal dark mode' && git push")

if __name__ == "__main__":
    main()

