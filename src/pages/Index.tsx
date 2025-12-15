import { useState } from "react";
import { Shield, Globe, Zap, Lock, Eye, Server } from "lucide-react";
import ProxyInput from "@/components/ProxyInput";
import LocationSelector from "@/components/LocationSelector";
import StatsDisplay from "@/components/StatsDisplay";
import ProxyBrowser from "@/components/ProxyBrowser";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    description: "Your data is protected with 256-bit AES encryption, the same standard used by governments.",
  },
  {
    icon: Eye,
    title: "Anonymous Browsing",
    description: "Your real IP address is hidden. Browse without leaving traces or being tracked.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized servers ensure minimal latency and maximum browsing speed.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access content from anywhere with our worldwide server network.",
  },
  {
    icon: Lock,
    title: "No-Log Policy",
    description: "We never store or monitor your browsing activity. Your privacy is absolute.",
  },
  {
    icon: Server,
    title: "99.9% Uptime",
    description: "Reliable infrastructure ensures your connection is always available when you need it.",
  },
];

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const handleProxySubmit = (url: string) => {
    setIsLoading(true);
    // Quick connection
    setTimeout(() => {
      setIsLoading(false);
      setActiveUrl(url);
    }, 500);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-[10px] font-mono text-primary/80 uppercase tracking-[0.2em]">Secure</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            <span className="text-glow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%] animate-gradient">
              Trickery
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground/80 max-w-md mx-auto leading-relaxed font-light">
            Browse anywhere. Stay invisible.
          </p>
        </header>

        {/* Location Selector */}
        <div className="flex justify-center mb-8">
          <LocationSelector
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </div>

        {/* Main Input */}
        <section className="mb-16">
          <ProxyInput onSubmit={handleProxySubmit} isLoading={isLoading} />
        </section>

        {/* Stats */}
        <section className="mb-20">
          <StatsDisplay />
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Why Choose <span className="text-primary text-glow">Trickery</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <p className="text-sm text-muted-foreground font-mono tracking-wider">
            © 2024 Trickery • Privacy First • Always Encrypted
          </p>
        </footer>
      </div>

      {/* Proxy Browser Modal */}
      {activeUrl && (
        <ProxyBrowser url={activeUrl} onClose={() => setActiveUrl(null)} />
      )}
    </main>
  );
};

export default Index;
