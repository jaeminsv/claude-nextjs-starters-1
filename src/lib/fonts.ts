/**
 * Font registration for @react-pdf/renderer.
 *
 * Registers Noto Sans KR (a Google Font that covers the full Korean Unicode
 * block) using local OTF files served from /public/fonts/.
 *
 * The fonts are located at:
 *   public/fonts/NotoSansKR-Regular.otf
 *   public/fonts/NotoSansKR-Bold.otf
 *
 * At runtime the absolute path is resolved via process.cwd() so the font
 * loader can read the files directly from disk (server-side only).
 *
 * Call registerKoreanFonts() once before rendering any PDF document.
 * It is safe to call multiple times — Font.register is idempotent.
 */

import path from 'path'
import { Font } from '@react-pdf/renderer'

// Font family name constant — import this wherever fontFamily is referenced in PDF styles
export const FONT_FAMILY = 'Noto Sans KR'

/**
 * Returns the absolute filesystem path to a font file inside public/fonts/.
 * process.cwd() points to the project root in both dev and production builds.
 *
 * @param filename - Font filename (e.g. 'NotoSansKR-Regular.otf')
 */
function fontPath(filename: string): string {
  return path.join(process.cwd(), 'public', 'fonts', filename)
}

/**
 * Registers Noto Sans KR Regular (400) and Bold (700) font weights
 * with @react-pdf/renderer's internal Font registry.
 *
 * Must be called in a server-side context (Route Handler or Server Action)
 * because @react-pdf/renderer is a Node.js-only package.
 */
export function registerKoreanFonts(): void {
  Font.register({
    family: FONT_FAMILY,
    fonts: [
      {
        // Regular weight — used for body text
        src: fontPath('NotoSansKR-Regular.otf'),
        fontWeight: 400,
        fontStyle: 'normal',
      },
      {
        // Bold weight — used for headings and totals
        src: fontPath('NotoSansKR-Bold.otf'),
        fontWeight: 700,
        fontStyle: 'normal',
      },
    ],
  })
}
