// Normalize keys: lowercase, remove "text/", "application/", "+xml", "+json", "x-"
const normalize = (str = "") =>
  str
    .toLowerCase()
    .replace(/^text\//, "")
    .replace(/^application\//, "")
    .replace(/^vnd\./, "")
    .replace(/^x-/, "")
    .replace(/\+xml$/, "")
    .replace(/\+json$/, "")
    .trim();

// MASTER LANGUAGE MAP (extension OR mime → prism language)
export const LANGUAGE_MAP = {
  // JavaScript / TypeScript
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  javascript: "javascript",
  ecmascript: "javascript",

  ts: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  typescript: "typescript",

  // Web
  html: "markup",
  htm: "markup",
  xhtml: "markup",
  "xhtml+xml": "markup",

  css: "css",
  scss: "scss",
  sass: "sass",
  less: "less",

  // JSON / YAML
  json: "json",
  "ld+json": "json",

  yaml: "yaml",
  yml: "yaml",

  // XML / Markup
  xml: "markup",
  svg: "markup",
  "svg+xml": "markup",
  "rss+xml": "markup",
  "atom+xml": "markup",

  // Markdown
  md: "markdown",
  markdown: "markdown",
  "x-markdown": "markdown",

  // SQL
  sql: "sql",

  // Python
  py: "python",
  python: "python",

  // PHP
  php: "php",
  "x-httpd-php": "php",

  // Java
  java: "java",

  // C / C++
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  hxx: "cpp",

  // C#
  cs: "csharp",

  // Go
  go: "go",

  // Rust
  rs: "rust",

  // Swift
  swift: "swift",

  // Shell
  sh: "bash",
  bash: "bash",
  zsh: "bash",

  // Perl
  pl: "perl",
  pm: "perl",

  // Ruby
  rb: "ruby",
  erb: "ruby",

  // Lua
  lua: "lua",

  // TCL
  tcl: "tcl",

  // Vue / Svelte
  vue: "vue",
  svelte: "svelte",

  // GraphQL
  gql: "graphql",
  graphql: "graphql",

  // Config / Env
  ini: "ini",
  cfg: "ini",
  conf: "ini",
  env: "ini",
  toml: "toml",

  // Diff / Patch
  diff: "diff",
  patch: "diff",

  // Protobuf
  proto: "protobuf",

  // Logs & text
  log: "text",
  txt: "text",
  csv: "text",
  tsv: "text",
  plain: "text",
  rtf: "text",

  // Docker / Make / Build
  dockerfile: "docker",
  makefile: "makefile",
  mk: "makefile",
  cmake: "makefile",
  "CMakeLists.txt": "makefile",

  // R
  r: "r",

  // Kotlin
  kt: "kotlin",
  kts: "kotlin",

  // Scala
  scala: "scala",

  // Groovy
  groovy: "groovy",

  // Haskell
  hs: "haskell",

  // Elixir / Erlang
  ex: "elixir",
  exs: "elixir",
  erl: "erlang",

  // Lisp / Scheme
  lisp: "lisp",
  scm: "scheme",

  // Ada
  ada: "ada",

  // D
  d: "d",

  // Assembly
  asm: "asm",
  s: "asm",

  // PowerShell / Batch
  ps1: "powershell",
  bat: "batch",
};

export function resolveLanguage(mimeOrExt = "", fileName = "") {
  const normalized = normalize(mimeOrExt);

  if (
    normalized === "octet-stream" ||
    normalized === "octetstream" ||
    normalized === "binary"
  ) {
    const ext = fileName.split(".").pop().toLowerCase();
    if (LANGUAGE_MAP[ext]) return LANGUAGE_MAP[ext];
    return "text";
  }

  if (LANGUAGE_MAP[normalized]) return LANGUAGE_MAP[normalized];

  const ext = fileName.split(".").pop().toLowerCase();
  if (LANGUAGE_MAP[ext]) return LANGUAGE_MAP[ext];

  return "text";
}
