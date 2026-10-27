import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import manifest from '../data/images.json';

// Images dropped into src/assets/images/ are matched to a slot by file name (extension ignored).
const files = import.meta.glob<ImageMetadata>('/src/assets/images/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});
const byStem = new Map<string, ImageMetadata>();
for (const [path, meta] of Object.entries(files)) {
  const stem = path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase();
  byStem.set(stem, meta);
}

type Slot = { file: string; alt: string };
const slots = manifest.slots as Record<string, Slot>;

/** The image for a slot, or null while its file has not been added yet. */
export function findImage(slot: string): { src: ImageMetadata; alt: string } | null {
  const s = slots[slot];
  if (!s) return null;
  const src = byStem.get(s.file.toLowerCase());
  return src ? { src, alt: s.alt } : null;
}

/**
 * The slot's own image, or, for a sub-service with no photo yet (e.g. "house-cleaning/deep-cleaning"),
 * its parent service's image ("house-cleaning"). Used for heroes and cards; schema and link previews
 * still use only the page's own image.
 */
export function findImageOrParent(slot: string): { src: ImageMetadata; alt: string } | null {
  const own = findImage(slot);
  if (own || !slot.includes('/')) return own;
  return findImage(slot.split('/')[0]);
}

/** Absolute URL of a 1200x630 social-share image for the slot, falling back to the site default. */
export async function shareImage(site: URL, slot?: string): Promise<{ url: string; alt: string }> {
  const img = (slot && findImage(slot)) || findImage('og-default');
  if (img) {
    const out = await getImage({ src: img.src, width: 1200, height: 630, fit: 'cover', format: 'jpg' });
    return { url: new URL(out.src, site).href, alt: img.alt };
  }
  return { url: new URL('/og-default.png', site).href, alt: 'FreshStart Cleaning Co. cleaning services in Fairview, Lagro and Novaliches, Quezon City' };
}
