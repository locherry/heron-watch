import * as FileSystem from "expo-file-system";
import * as React from "react";
import { Platform, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";

type MarkdownViewerProps = {
  path: string; // local file (native) OR public file (web)
};

export function MarkdownViewer({ path }: MarkdownViewerProps) {
  const [content, setContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        let raw: string;

        if (Platform.OS === "web") {
          // On web, fetch from public folder
          const res = await fetch(path);
          raw = await res.text();
        } else {
          // On native, use expo-file-system
          raw = await new FileSystem.File(path).text()
        }

        setContent(raw);
      } catch (e) {
        console.error("Error reading markdown file:", e);
      }
    };

    load();
  }, [path]);

  if (!content) return <Text>Loading…</Text>;

  return (
    <ScrollView className="p-4">
      {content.split(/\r?\n/).map((line, index) => renderLine(line, index))}
    </ScrollView>
  );
}


// Utility: parse inline bold (**...**)
const renderInline = (text: string, keyPrefix: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g); // keep **...**
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={`${keyPrefix}-b-${i}`} className="font-bold">
          {part.slice(2, -2)}
        </Text>
      );
    }
    // plain text just returns raw string (inherits parent style!)
    return part;
  });
};

// Simple renderer (with inline bold, keeps font sizes from parent typography)
const renderLine = (line: string, index: number) => {
  if (line.startsWith("### "))
    return <Text variant="h3" key={index}>{renderInline(line.replace(/^###\s*/, ""), `Text variant="h3"-${index}`)}</Text>;
  if (line.startsWith("## "))
    return <Text variant="h2" key={index}>{renderInline(line.replace(/^##\s*/, ""), `h2-${index}`)}</Text>;
  if (line.startsWith("# "))
    return <Text variant="h1" key={index}>{renderInline(line.replace(/^#\s*/, ""), `h1-${index}`)}</Text>;
  if (/^\s*-\s+/.test(line))
    return <Text variant="p" key={index}>{renderInline("• " + line.replace(/^\s*-\s+/, ""), `li-${index}`)}</Text>;
  if (line.startsWith("> "))
    return <Text variant="blockquote" key={index}>{renderInline(line.replace(/^>\s*/, ""), `bq-${index}`)}</Text>;
  if (line.trim() !== "")
    return <Text variant="p" key={index}>{renderInline(line, `p-${index}`)}</Text>;
  return <Text key={index}>{"\n"}</Text>;
};
