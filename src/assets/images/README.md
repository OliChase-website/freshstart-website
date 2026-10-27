# Site images

Drop images here using the file names listed in `src/data/images.json` (any of .jpg, .jpeg, .png, .webp, .avif).
The build resizes them, converts them to AVIF and WebP, and places them on the right page automatically.
A slot without a file shows nothing, so pages never show a broken image.

- Size: at least the `minWidth` in the manifest (1600 px wide for heroes), in the given aspect ratio.
- Keep originals under about 5 MB; the build compresses them for mobile.
- Before-and-after job photos and area-page photos must be real FreshStart photos (no faces of clients, no house numbers or plate numbers).
