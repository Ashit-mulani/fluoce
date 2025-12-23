import { FaFileLines } from "react-icons/fa6";
import { FaCode } from "react-icons/fa6";
import { LuImage } from "react-icons/lu";
import { BiVector } from "react-icons/bi";
import { FaCirclePlay } from "react-icons/fa6";
import { MdAudiotrack } from "react-icons/md";
import { SiGoogledocs } from "react-icons/si";
import { IoArchive } from "react-icons/io5";
import { BsFillBoxFill } from "react-icons/bs";
import { LuDatabaseZap } from "react-icons/lu";
import { BsFiletypeExe } from "react-icons/bs";
import { LiaCertificateSolid } from "react-icons/lia";
import { BiSolidCalendarCheck } from "react-icons/bi";
import { GiChemicalTank } from "react-icons/gi";
import { RxFontFamily } from "react-icons/rx";

export const File_Type = {
  code: [
    // JS / TS
    "javascript",
    "x-javascript",
    "js",
    "ecmascript",
    "typescript",
    "x-typescript",
    "ts",
    "jsx",
    "tsx",

    // PHP
    "x-httpd-php",
    "x-php",
    "php",

    // HTML / CSS
    "html",
    "htm",
    "xhtml+xml",
    "xhtml",
    "css",
    "x-scss",
    "scss",
    "sass",
    "less",

    // Java (ONLY source code)
    "java",
    "x-java",
    "x-java-source",

    // Python (ONLY .py)
    "python",
    "x-python",
    "py",

    // C / C++
    "c",
    "x-c",
    "h",
    "cpp",
    "cc",
    "cxx",
    "hpp",
    "hxx",
    "x-c++",

    // C#
    "cs",
    "x-csharp",

    // Other languages
    "go",
    "x-go",
    "rust",
    "x-rust",
    "rs",
    "swift",
    "x-swift",
    "sh",
    "bash",
    "zsh",
    "x-sh",
    "x-shellscript",
    "pl",
    "pm",
    "x-perl",
    "rb",
    "erb",
    "x-ruby",
    "lua",
    "x-lua",
    "tcl",
    "x-tcl",

    // Data files
    "xml",
    "atom+xml",
    "rss+xml",
    "svg+xml",
    "svg",
    "json",
    "ld+json",
    "yaml",
    "x-yaml",
    "yml",
    "toml",

    // Markdown
    "markdown",
    "md",
    "x-markdown",

    // SQL
    "sql",
    "x-sql",

    // Docs / config
    "csv",
    "tsv",
    "plain",
    "txt",
    "rtf",
    "ini",
    "conf",
    "env",
    "cfg",
    "gitignore",
    "dockerfile",
    "makefile",
    "cmake",
    "patch",
    "diff",

    // GraphQL
    "gql",
    "graphql",
  ],
  image: [
    "jpeg",
    "pjpeg",
    "png",
    "gif",
    "webp",
    "bmp",
    "tiff",
    "x-icon",
    "vnd.adobe.photoshop",
    "heic",
    "heif",
    "avif",
    "avif-sequence",
    "x-adobe-dng",
    "x-canon-cr2",
    "x-canon-crw",
    "x-nikon-nef",
    "x-sony-arw",
    "x-sony-sr2",
    "x-sony-srf",
    "x-olympus-orf",
    "x-fuji-raf",
    "x-panasonic-raw",
    "x-pentax-pef",
    "x-kodak-dcr",
    "x-kodak-k25",
    "x-kodak-kdc",
    "x-minolta-mrw",
    "x-sigma-x3f",
    "x-epson-erf",
    "x-portable-bitmap",
    "x-portable-graymap",
    "x-portable-pixmap",
    "x-portable-anymap",
    "x-cmu-raster",
    "x-pcx",
    "x-rgb",
    "x-xbitmap",
    "x-xpixmap",
    "x-xwindowdump",
    "x-icns",
    "image-x-icon",
    "application-x-icns",
  ],
  vector: [
    "svg+xml",
    "postscript",
    "x-xfig",
    "vnd.adobe.illustrator",
    "cgm",
    "vnd.dwg",
    "vnd.dxf",
  ],
  video: [
    "mp4",
    "x-matroska",
    "mkv",
    "quicktime",
    "mov",
    "webm",
    "x-msvideo",
    "avi",
    "x-ms-wmv",
    "wmv",
    "x-ms-asf",
    "x-flv",
    "flv",
    "x-f4v",
    "mpeg",
    "mpg",
    "3gpp",
    "3gp",
    "3gpp2",
    "3g2",
    "ogg",
    "ogv",
    "x-m4v",
    "h261",
    "h263",
    "h264",
    "jpeg",
    "jpm",
    "mj2",
    "mp2t",
    "x-sgi-movie",
    "x-fli",
    "mp4v-es",
    "mpg4",
    "application-x-mkv",
  ],
  audio: [
    "mpeg",
    "mp3",
    "mp4",
    "m4a",
    "wav",
    "x-wav",
    "vnd.wav",
    "wave",
    "vnd.wave",
    "ogg",
    "oga",
    "flac",
    "aac",
    "aacp",
    "x-m4a",
    "x-ms-wma",
    "wma",
    "x-ms-wax",
    "opus",
    "aiff",
    "x-aiff",
    "basic",
    "midi",
    "x-matroska",
    "x-mpegurl",
    "webm",
    "3gpp2",
    "adpcm",
    "x-pn-realaudio",
    "x-pn-realaudio-plugin",
    "mp4a-latm",
    "audio-x-m4a",
    "audio-x-wav",
    "audio-x-flac",
    "audio-x-opus",
  ],
  docsEbooks: [
    "pdf",
    "epub+zip",
    "vnd.amazon.ebook",
    "x-mobipocket-ebook",
    "msword",
    "vnd.ms-word.document.macroenabled.12",
    "vnd.openxmlformats-officedocument.wordprocessingml.document",
    "vnd.openxmlformats-officedocument.wordprocessingml.template",
    "vnd.ms-excel",
    "vnd.ms-excel.sheet.macroenabled.12",
    "vnd.ms-excel.addin.macroenabled.12",
    "vnd.ms-excel.sheet.binary.macroenabled.12",
    "vnd.ms-excel.template.macroenabled.12",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "vnd.openxmlformats-officedocument.spreadsheetml.template",
    "vnd.ms-powerpoint",
    "vnd.ms-powerpoint.presentation.macroenabled.12",
    "vnd.ms-powerpoint.addin.macroenabled.12",
    "vnd.ms-powerpoint.slide.macroenabled.12",
    "vnd.ms-powerpoint.slideshow.macroenabled.12",
    "vnd.ms-powerpoint.template.macroenabled.12",
    "vnd.openxmlformats-officedocument.presentationml.presentation",
    "vnd.openxmlformats-officedocument.presentationml.slide",
    "vnd.openxmlformats-officedocument.presentationml.slideshow",
    "vnd.openxmlformats-officedocument.presentationml.template",
    "vnd.ms-project",
    "vnd.ms-works",
    "vnd.visio",
    "vnd.visio2013",
    "vnd.oasis.opendocument.text",
    "vnd.oasis.opendocument.text-template",
    "vnd.oasis.opendocument.spreadsheet",
    "vnd.oasis.opendocument.spreadsheet-template",
    "vnd.oasis.opendocument.presentation",
    "vnd.oasis.opendocument.presentation-template",
    "vnd.oasis.opendocument.graphics",
    "vnd.oasis.opendocument.chart",
    "vnd.oasis.opendocument.formula",
    "vnd.oasis.opendocument.database",
    "vnd.sun.xml.writer",
    "vnd.sun.xml.writer.template",
    "vnd.sun.xml.writer.global",
    "vnd.sun.xml.calc",
    "vnd.sun.xml.calc.template",
    "vnd.sun.xml.impress",
    "vnd.sun.xml.impress.template",
    "vnd.sun.xml.draw",
    "vnd.sun.xml.draw.template",
    "vnd.sun.xml.math",
    "vnd.stardivision.writer",
    "vnd.stardivision.writer-global",
    "vnd.stardivision.calc",
    "vnd.stardivision.impress",
    "vnd.stardivision.draw",
    "vnd.stardivision.math",
    "vnd.lotus-1-2-3",
    "vnd.lotus-approach",
    "vnd.lotus-freelance",
    "vnd.lotus-notes",
    "vnd.lotus-organizer",
    "vnd.lotus-wordpro",
    "vnd.apple.pages",
    "vnd.apple.numbers",
    "vnd.apple.keynote",
    "vnd.wordperfect",
    "x-abiword",
    "x-mswrite",
    "application-x-pdf",
    "application-epub+zip",
    "application-x-mobipocket-ebook",
  ],
  archive: [
    "zip",
    "x-zip-compressed",
    "zip-compressed",
    "x-rar-compressed",
    "vnd.rar",
    "x-7z-compressed",
    "x-tar",
    "gzip",
    "x-gzip",
    "x-bzip",
    "x-bzip2",
    "x-xz",
    "x-compress",
    "x-lzip",
    "x-lzma",
    "x-ace-compressed",
    "x-stuffit",
    "x-stuffitx",
    "vnd.ms-cab-compressed",
    "x-iso9660-image",
    "x-apple-diskimage",
    "application-x-zip",
    "application-x-rar",
    "application-x-tar",
    "application-x-7z-compressed",
  ],
  fonts: [
    "ttf",
    "x-font-ttf",
    "otf",
    "x-font-otf",
    "woff",
    "woff2",
    "vnd.ms-fontobject",
    "x-font-type1",
    "x-font-bdf",
    "x-font-ghostscript",
    "x-font-linux-psf",
    "x-font-pcf",
    "x-font-snf",
  ],
  threeD: [
    "glb",
    "gltf",
    "fbx",
    "gltf+json",
    "gltf-binary",
    "obj",
    "stl",
    "iges",
    "mesh",
    "vrml",
    "vnd.dwf",
    "vnd.gdl",
    "x3d+xml",
    "application-x-gltf",
  ],
  database: [
    "vnd.sqlite3",
    "x-sqlite3",
    "vnd.ms-access",
    "x-msaccess",
    "x-sql",
    // common cloud:
    "application-x-sqlite3",
  ],
  executable: [
    "exe",
    "msi",
    "msdos-program",
    "msdownload",
    "x-msdos-program",
    "x-msdownload",
    "x-msi",
    "x-msinstaller",
    "x-executable",
    "application-x-executable",
    "binary",
    "dll",
    "bat",
    "cmd",
    "com",
    "bin",
    "elf",
    "so",
    "run",
    "dmg",
    "deb",
    "rpm",
    "pkg",
    "apk",
    "app",
  ],
  certificates: [
    "pkix-cert",
    "pkix-crl",
    "pkcs7-mime",
    "pkcs7-signature",
    "pkcs10",
    "pkcs8",
    "x-pkcs12",
    "x-pkcs7-certificates",
    "x-x509-ca-cert",
    "pgp-encrypted",
    "pgp-signature",
    "application-x-x509-ca-cert",
  ],
  calendar: [
    "rfc822",
    "calendar",
    "x-vcalendar",
    "x-vcard",
    "application-x-vcalendar",
  ],
  chemical: ["x-cdx", "x-cif", "x-cmdf", "x-cml", "x-csml", "x-xyz"],
};

export function getFileTypeKeyFromMimetype(mimetype) {
  if (!mimetype || typeof mimetype !== "string") return undefined;
  const slashIdx = mimetype.indexOf("/");
  if (slashIdx === -1 || slashIdx === mimetype.length - 1) return undefined;

  const mainType = mimetype.substring(0, slashIdx).toLowerCase();
  let subtype = mimetype.substring(slashIdx + 1).toLowerCase();

  if (subtype.includes(";")) {
    subtype = subtype.split(";")[0].trim();
  }

  if (mainType === "audio") return "audio";
  if (mainType === "video") return "video";
  if (mainType === "image") return "image";

  // Try exact match first
  for (const key in File_Type) {
    if (File_Type[key].includes(subtype)) {
      return key;
    }
  }

  const stripPrefix = (s) => s.replace(/^(x-|vnd\.|vnd-|x\.)+/i, "");
  const subtypeStripped = stripPrefix(subtype);

  for (const key in File_Type) {
    for (const entry of File_Type[key]) {
      if (subtypeStripped === stripPrefix(entry)) {
        return key;
      }
    }
  }

  for (const key in File_Type) {
    for (const entry of File_Type[key]) {
      if (subtype.includes(entry) || entry.includes(subtype)) {
        return key;
      }
    }
  }

  return undefined;
}

const FileTypeIconMap = {
  code: FaCode,
  image: LuImage,
  vector: BiVector,
  video: FaCirclePlay,
  audio: MdAudiotrack,
  docsEbooks: SiGoogledocs,
  archive: IoArchive,
  fonts: RxFontFamily,
  threeD: BsFillBoxFill,
  database: LuDatabaseZap,
  executable: BsFiletypeExe,
  certificates: LiaCertificateSolid,
  calendar: BiSolidCalendarCheck,
  chemical: GiChemicalTank,
};

export default function getFileIcon(mimeType, className, size) {
  const key = getFileTypeKeyFromMimetype(mimeType);
  const Icon = FileTypeIconMap[key] || FaFileLines;
  return <Icon className={className} size={size} />;
}
