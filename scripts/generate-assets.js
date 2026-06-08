/**
 * Generates placeholder PNG assets for DataSwap.
 * Run once before `npx expo start`: node scripts/generate-assets.js
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// CRC32 used by PNG chunk validation
function makeCRC32Table() {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
}
const CRC_TABLE = makeCRC32Table();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

function createPNG(width, height, bgR, bgG, bgB, fgR, fgG, fgB) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace: none

  // Build raw pixel data (filter-byte 0 + RGB per pixel per row)
  const rowLen = 1 + width * 3;
  const raw = Buffer.allocUnsafe(height * rowLen);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = Math.min(width, height) * 0.35;
  const innerR = outerR * 0.45;
  const boltW = outerR * 0.22;

  for (let y = 0; y < height; y++) {
    raw[y * rowLen] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = bgR, g = bgG, b = bgB;

      // Draw a lightning bolt circle as the logo
      if (dist <= outerR && dist >= innerR) {
        r = fgR; g = fgG; b = fgB;
      } else if (dist < innerR) {
        // Bolt shape inside
        const angle = Math.atan2(dy, dx);
        const inBolt = (dx > -boltW * 1.2 && dx < boltW * 0.4 && dy < 0) ||
                       (dx > -boltW * 0.4 && dx < boltW * 1.2 && dy >= 0);
        if (inBolt) { r = fgR; g = fgG; b = fgB; }
      }

      const off = y * rowLen + 1 + x * 3;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// DataSwap brand colors
const PRIMARY_DARK   = [10,  45, 110]; // #0A2D6E
const PRIMARY        = [13,  71, 161]; // #0D47A1
const WHITE          = [255,255,255];
const YELLOW         = [255,196,  0];  // accent

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const assets = [
  { file: 'icon.png',          w: 1024, h: 1024, bg: PRIMARY_DARK, fg: WHITE  },
  { file: 'adaptive-icon.png', w: 1024, h: 1024, bg: PRIMARY,      fg: WHITE  },
  { file: 'splash.png',        w: 1242, h: 2436, bg: PRIMARY,      fg: WHITE  },
  { file: 'favicon.png',       w:   64, h:   64, bg: PRIMARY_DARK, fg: YELLOW },
];

for (const { file, w, h, bg, fg } of assets) {
  const outPath = path.join(assetsDir, file);
  if (fs.existsSync(outPath)) {
    console.log(`  skip  ${file} (already exists)`);
    continue;
  }
  const png = createPNG(w, h, ...bg, ...fg);
  fs.writeFileSync(outPath, png);
  console.log(`  wrote ${file}  (${w}×${h}, ${(png.length / 1024).toFixed(1)} KB)`);
}

console.log('\nDone. Run: npx expo start --clear');
