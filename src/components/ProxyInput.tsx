import { useState } from "react";
import { Globe, ArrowRight, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProxyInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const ProxyInput = ({ onSubmit, isLoading }: ProxyInputProps) => {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let processedUrl = url.trim();
      if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
        processedUrl = "https://" + processedUrl;
      }
      onSubmit(processedUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div
        className={cn(
          "relative flex items-center gap-3 p-2 rounded-2xl transition-all duration-500",
          "glass border-2",
          isFocused
            ? "border-primary box-glow"
            : "border-border/50 hover:border-primary/50"
        )}
      >
        <div className="flex items-center gap-3 pl-4 flex-1">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300",
            isFocused ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Globe className="w-5 h-5" />
          </div>
          
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter website URL (e.g., example.com)"
            className={cn(
              "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground",
              "text-lg font-mono outline-none",
              "py-3"
            )}
          />
        </div>

        <Button
          type="submit"
          variant="cyber"
          size="xl"
          disabled={!url.trim() || isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Browse Securely
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
      
      <p className="text-center text-muted-foreground text-sm mt-4 font-mono">
        Your connection will be encrypted and anonymized
      </p>
    </form>
  );
};

export default ProxyInput;
