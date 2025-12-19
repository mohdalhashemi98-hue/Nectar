import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Share, Plus, CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import stackLogo from "@/assets/stack-logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo */}
        <div className="mb-8">
          <img src={stackLogo} alt="Stack" className="h-24 w-24" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2 font-display text-center">
          Install Stack
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-sm">
          Add Stack to your home screen for quick access and a native app experience
        </p>

        {isInstalled ? (
          <Card className="w-full max-w-sm bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 mb-1">Already Installed!</h3>
              <p className="text-sm text-green-600">
                Nectar is installed on your device. Look for it on your home screen.
              </p>
            </CardContent>
          </Card>
        ) : isIOS ? (
          <Card className="w-full max-w-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4 text-center">
                Install on iPhone
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Share className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">1. Tap Share</p>
                    <p className="text-sm text-muted-foreground">
                      Tap the share icon in Safari's toolbar
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">2. Add to Home Screen</p>
                    <p className="text-sm text-muted-foreground">
                      Scroll and tap "Add to Home Screen"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">3. Open Nectar</p>
                    <p className="text-sm text-muted-foreground">
                      Tap the Nectar icon on your home screen
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Button
            onClick={handleInstall}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Download className="h-5 w-5" />
            Install Nectar
          </Button>
        ) : (
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                Open in a Mobile Browser
              </h3>
              <p className="text-sm text-muted-foreground">
                Visit this page on your mobile device to install Nectar
              </p>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm w-full">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Works Offline</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Native Feel</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Fast & Light</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;