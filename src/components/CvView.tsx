import { useMemo, type ReactNode } from "react";
import { BracesIcon, CopyIcon, RouteIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cvAsPrompt, type CV } from "@/data/cv";
import { copyText } from "@/lib/toast";

/* ───────── Code views: the machine views ───────── */

function CodeBlock({ text, label }: { text: string; label: string }) {
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute top-3 right-3 print:hidden"
        onClick={() => copyText(text, `Copied the ${label}`)}
        aria-label={`Copy ${label}`}
      >
        <CopyIcon /> Copy
      </Button>
      <pre className="max-h-[70vh] overflow-auto rounded-xl border border-border bg-muted p-4 pr-24 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-foreground">
        {text}
      </pre>
    </div>
  );
}

/* ───────── The page island ───────── */

/** The CV three ways on /about/: the timeline (server-rendered, passed in as children), JSON and a system prompt.
 *  Without JavaScript the tabs are hidden and the timeline shows. The public JSON never carries a phone field. */
export default function CvView({ cv, children }: { cv: CV; children: ReactNode }) {
  const json = useMemo(() => {
    const { phone: _phone, ...profile } = cv.profile;
    return JSON.stringify({ ...cv, profile }, null, 2);
  }, [cv]);
  const prompt = useMemo(() => cvAsPrompt(cv), [cv]);

  return (
    <Tabs defaultValue="timeline" className="gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <TabsList aria-label="CV format" className="no-js:hidden">
          <TabsTrigger value="timeline">
            <RouteIcon /> Timeline
          </TabsTrigger>
          <TabsTrigger value="json">
            <BracesIcon /> JSON
          </TabsTrigger>
          <TabsTrigger value="prompt">
            <SparklesIcon /> Prompt
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="timeline" forceMount className="data-[state=inactive]:hidden">
        {children}
      </TabsContent>

      <TabsContent value="json">
        <p className="mb-3 text-sm text-muted-foreground">
          The same CV as structured data, straight from <code className="font-mono text-xs">src/data/cv.ts</code>.
        </p>
        <CodeBlock text={json} label="JSON" />
      </TabsContent>

      <TabsContent value="prompt">
        <p className="mb-3 text-sm text-muted-foreground">
          My CV written as a system prompt. Paste it into any assistant and ask it about me; it's instructed to say so when it doesn't know.
        </p>
        <CodeBlock text={prompt} label="prompt" />
      </TabsContent>
    </Tabs>
  );
}
