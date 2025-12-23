This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
export const FILE_SUBTYPE_GROUPS = {
// 💻 Code, Markup, and Data (Files usually opened in a text/code editor)
code_data: [
// Merged user's 'code' and 'markup' categories
"javascript", "x-javascript", "ecmascript", "typescript", "x-typescript",
"x-httpd-php", "x-php", "html", "xhtml+xml", "css", "x-scss",
"java", "x-java", "x-java-source", "java-vm", "java-archive", "java-serialized-object",
"x-python", "x-python-code", "x-c", "x-c++", "x-c++src", "x-csharp", "x-go",
"x-rust", "x-swift", "x-sh", "x-shellscript", "x-bash", "x-csh", "x-perl",
"x-ruby", "x-lua", "x-tcl", "sql", "x-sql", "pyc", "pyo", "pyd", "x-fortran",
"x-pascal", "x-asm", "wasm",
"xml", "atom+xml", "rss+xml", "json", "ld+json", "yaml", "x-yaml", "toml",
"markdown", "x-markdown", "csv", "tab-separated-values", "plain", "rtf", "richtext",
// Generic text/config types
"vnd.dart", "vnd.mozilla.xul+xml", "vnd.tcpdump.pcap", "vnd.hzn-3d-crossword",
"x-www-form-urlencoded"
],

// 🖼️ Image Files (Raster)
image: [
"jpeg", "pjpeg", "png", "gif", "webp", "bmp", "tiff", "x-icon", "vnd.adobe.photoshop",
"heic", "heif", "avif", "avif-sequence", "x-adobe-dng", "x-canon-cr2", "x-canon-crw",
"x-nikon-nef", "x-sony-arw", "x-sony-sr2", "x-sony-srf", "x-olympus-orf",
"x-fuji-raf", "x-panasonic-raw", "x-pentax-pef", "x-kodak-dcr", "x-kodak-k25",
"x-kodak-kdc", "x-minolta-mrw", "x-sigma-x3f", "x-epson-erf", "x-portable-bitmap",
"x-portable-graymap", "x-portable-pixmap", "x-portable-anymap", "x-cmu-raster",
"x-pcx", "x-rgb", "x-xbitmap", "x-xpixmap", "x-xwindowdump", "x-icns"
],

// 📐 Vector Graphics
vector: [
"svg+xml", "postscript", "x-xfig", "vnd.adobe.illustrator", "cgm", "vnd.dwg", "vnd.dxf"
],

// 🎬 Video Files
video: [
"mp4", "x-matroska", "mkv", "quicktime", "mov", "webm", "x-msvideo", "avi",
"x-ms-wmv", "wmv", "x-ms-asf", "x-flv", "flv", "x-f4v", "mpeg", "mpg", "3gpp",
"3gp", "3gpp2", "3g2", "ogg", "ogv", "x-m4v", "h261", "h263", "h264", "jpeg",
"jpm", "mj2", "mp2t", "x-sgi-movie", "x-fli"
],

// 🔊 Audio Files
audio: [
"mpeg", "mp3", "mp4", "m4a", "wav", "x-wav", "vnd.wav", "wave", "vnd.wave",
"ogg", "oga", "flac", "aac", "aacp", "x-m4a", "x-ms-wma", "wma", "x-ms-wax",
"opus", "aiff", "x-aiff", "basic", "midi", "x-matroska", "x-mpegurl", "webm",
"3gpp2", "adpcm", "x-pn-realaudio", "x-pn-realaudio-plugin", "mp4a-latm"
],

// 📚 Documents and Books (Merged user's 'docs', 'pdf', 'ebooks')
docs_ebooks: [
// PDF/eBooks
"pdf", "epub+zip", "vnd.amazon.ebook", "x-mobipocket-ebook",
// Office/iWork/OpenDocument
"msword", "vnd.ms-word.document.macroenabled.12", "vnd.openxmlformats-officedocument.wordprocessingml.document",
"vnd.openxmlformats-officedocument.wordprocessingml.template", "vnd.ms-excel",
"vnd.ms-excel.sheet.macroenabled.12", "vnd.ms-excel.addin.macroenabled.12",
"vnd.ms-excel.sheet.binary.macroenabled.12", "vnd.ms-excel.template.macroenabled.12",
"vnd.openxmlformats-officedocument.spreadsheetml.sheet", "vnd.openxmlformats-officedocument.spreadsheetml.template",
"vnd.ms-powerpoint", "vnd.ms-powerpoint.presentation.macroenabled.12",
"vnd.ms-powerpoint.addin.macroenabled.12", "vnd.ms-powerpoint.slide.macroenabled.12",
"vnd.ms-powerpoint.slideshow.macroenabled.12", "vnd.ms-powerpoint.template.macroenabled.12",
"vnd.openxmlformats-officedocument.presentationml.presentation", "vnd.openxmlformats-officedocument.presentationml.slide",
"vnd.openxmlformats-officedocument.presentationml.slideshow", "vnd.openxmlformats-officedocument.presentationml.template",
"vnd.ms-project", "vnd.ms-works", "vnd.visio", "vnd.visio2013",
"vnd.oasis.opendocument.text", "vnd.oasis.opendocument.text-template",
"vnd.oasis.opendocument.spreadsheet", "vnd.oasis.opendocument.spreadsheet-template",
"vnd.oasis.opendocument.presentation", "vnd.oasis.opendocument.presentation-template",
"vnd.oasis.opendocument.graphics", "vnd.oasis.opendocument.chart",
"vnd.oasis.opendocument.formula", "vnd.oasis.opendocument.database",
"vnd.sun.xml.writer", "vnd.sun.xml.writer.template", "vnd.sun.xml.writer.global",
"vnd.sun.xml.calc", "vnd.sun.xml.calc.template", "vnd.sun.xml.impress",
"vnd.sun.xml.impress.template", "vnd.sun.xml.draw", "vnd.sun.xml.draw.template",
"vnd.sun.xml.math", "vnd.stardivision.writer", "vnd.stardivision.writer-global",
"vnd.stardivision.calc", "vnd.stardivision.impress", "vnd.stardivision.draw",
"vnd.stardivision.math", "vnd.lotus-1-2-3", "vnd.lotus-approach",
"vnd.lotus-freelance", "vnd.lotus-notes", "vnd.lotus-organizer",
"vnd.lotus-wordpro", "vnd.apple.pages", "vnd.apple.numbers", "vnd.apple.keynote",
"vnd.wordperfect", "x-abiword", "x-mswrite"
],

// 📦 Archives and Compressed Files
archive: [
"zip", "x-zip-compressed", "zip-compressed", "x-rar-compressed", "vnd.rar",
"x-7z-compressed", "x-tar", "gzip", "x-gzip", "x-bzip", "x-bzip2", "x-xz",
"x-compress", "x-lzip", "x-lzma", "x-ace-compressed", "x-stuffit",
"x-stuffitx", "vnd.ms-cab-compressed", "x-iso9660-image", "x-apple-diskimage"
],

// 🔤 Fonts
fonts: [
"ttf", "x-font-ttf", "otf", "x-font-otf", "woff", "woff2",
"vnd.ms-fontobject", "x-font-type1", "x-font-bdf", "x-font-ghostscript",
"x-font-linux-psf", "x-font-pcf", "x-font-snf"
],

// 🧊 3D Models
'3d': [
"gltf+json", "gltf-binary", "obj", "stl", "iges", "mesh", "vrml",
"vnd.dwf", "vnd.gdl", "x3d+xml"
],

// 💾 Database Files
database: [
"vnd.sqlite3", "x-sqlite3", "vnd.ms-access", "x-msaccess", "x-sql"
],

// ⚙️ Executable and Installer Files
executable: [
"x-msdownload", "vnd.android.package-archive", "x-debian-package",
"x-rpm", "x-redhat-package-manager", "x-apple-diskimage",
"vnd.apple.installer+xml", "x-ms-application", "x-shockwave-flash",
"x-silverlight-app", "x-java-jnlp-file", "octet-stream" // General binary/executable fallback
],

// 🔒 Security & Certificates
certificates: [
"pkix-cert", "pkix-crl", "pkcs7-mime", "pkcs7-signature", "pkcs10",
"pkcs8", "x-pkcs12", "x-pkcs7-certificates", "x-x509-ca-cert",
"pgp-encrypted", "pgp-signature"
],

// 📧 Email & Calendar
email_calendar: [
"rfc822", // Email
"calendar", "x-vcalendar", "x-vcard" // Calendar/Contact
],

// 🧪 Scientific/Chemical Data
chemical: [
"x-cdx", "x-cif", "x-cmdf", "x-cml", "x-csml", "x-xyz"
]
};
