import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, X, ExternalLink, Lock, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ProxyBrowserProps {
  url: string;
  onClose: () => void;
}

const ProxyBrowser = ({ url, onClose }: ProxyBrowserProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "URL copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-4">
      {/* Browser Chrome */}
      <div className="flex flex-col h-full">
        {/* Top Bar */}
        <div className="flex items-center gap-3 p-3 border-b border-border/50 glass">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsLoading(true)}>
              <RotateCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          {/* URL Bar */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border/30">
            <Lock className="w-4 h-4 text-cyber-green" />
            <span className="text-xs text-cyber-green font-mono">SECURE</span>
            <span className="text-muted-foreground">|</span>
            <span className="flex-1 text-sm font-mono text-foreground truncate">{url}</span>
            <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Connection Info Banner */}
        <div className="flex items-center justify-center gap-4 py-2 bg-primary/10 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-xs font-mono text-primary">Connected via Frankfurt, DE</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs font-mono text-muted-foreground">IP: 185.XX.XX.XXX</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs font-mono text-muted-foreground">Latency: 28ms</span>
        </div>

        {/* Browser Content */}
        <div className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Lock className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-mono text-muted-foreground">Establishing secure connection...</p>
              </div>
            </div>
          )}
          
          {/* Simulated content - in real implementation this would be an iframe or proxied content */}
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="glass border border-border/50 rounded-2xl p-8 max-w-lg text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Proxy Connection Ready</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your connection to <span className="font-mono text-primary">{new URL(url).hostname}</span> is secured and anonymized.
              </p>
              <p className="text-xs text-muted-foreground">
                Note: Full proxy browsing requires backend implementation with a proxy server.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.open(url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProxyBrowser;
