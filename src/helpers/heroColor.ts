import sharp from 'sharp';
import { getEbirdImgUrl } from './ebird';

const FALLBACK = '#171717';
const cache = new Map<number, Promise<string>>();

const toHex = (r: number, g: number, b: number) =>
	'#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function rgbToHsl(r: number, g: number, b: number) {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	const l = (max + min) / 2;
	if (max === min) return { h: 0, s: 0, l };
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	return { h: h * 60, s, l };
}

function hslToHex(h: number, s: number, l: number) {
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
	return toHex(f(0) * 255, f(8) * 255, f(4) * 255);
}

/**
 * Picks a dark background color derived from the image, for use behind white text.
 * Prefers the most common saturated hue; falls back to the overall average hue.
 * Lightness is pinned low and saturation clamped so white text always stays legible.
 */
export function getHeroColor(img: number): Promise<string> {
	if (!cache.has(img)) cache.set(img, computeHeroColor(img).catch(() => FALLBACK));
	return cache.get(img)!;
}

async function computeHeroColor(img: number): Promise<string> {
	const res = await fetch(getEbirdImgUrl(img, 320));
	if (!res.ok) return FALLBACK;
	const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
		.resize(48, 48, { fit: 'inside' })
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const BUCKETS = 24;
	const buckets = Array.from({ length: BUCKETS }, () => ({ n: 0, h: 0, s: 0 }));
	let avgH = 0, avgS = 0, total = 0;

	for (let i = 0; i < data.length; i += info.channels) {
		const { h, s, l } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
		if (l < 0.08 || l > 0.95) continue;
		total++;
		avgH += h; avgS += s;
		if (s < 0.25) continue;
		const b = buckets[Math.floor(h / (360 / BUCKETS)) % BUCKETS];
		b.n++; b.h += h; b.s += s;
	}
	if (!total) return FALLBACK;

	const top = buckets.reduce((a, b) => (b.n > a.n ? b : a));
	let h: number, s: number;
	if (top.n / total >= 0.06) {
		h = top.h / top.n;
		s = top.s / top.n;
	} else {
		h = avgH / total;
		s = avgS / total;
	}
	// Dark enough for white text (contrast > 9:1 at any hue), muted enough to not fight the photo
	return hslToHex(h, Math.min(Math.max(s, 0.18), 0.4), 0.2);
}
