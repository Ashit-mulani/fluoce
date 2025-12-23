import { resolveLanguage } from "@/utils/resolveLanguage";
import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Spinner } from "../ui/spinner";

function Code({ code, language }) {
  const lines = code.split("\n");

  return (
    <div className="relative flex font-mono text-sm leading-6 p-1 ">
      <div className="select-none text-right pr-2 text-gray-500 sticky left-1 bg-white dark:bg-zinc-950">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}.</div>
        ))}
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        customStyle={{
          padding: 0,
          margin: 0,
          background: "transparent",
        }}
        codeTagProps={{
          style: {
            padding: 0,
            margin: 0,
            fontFamily: "inherit",
            lineHeight: "1.5rem",
          },
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function CodePreview({ url, mimeType, fileName }) {
  const [code, setCode] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        setCode(text);
        setLoading(false);
      })
      .catch(() => {
        setCode("// Unable to load file");
        setLoading(false);
      });
  }, [url]);

  const language = resolveLanguage(mimeType, fileName);

  if (loading) {
    return (
      <div className="h-full w-full flex gap-2 items-center justify-center text-zinc-500">
        <Spinner /> Loading preview . . . .
      </div>
    );
  }

  return <Code code={code || ""} language={language} />;
}

export default Code;
