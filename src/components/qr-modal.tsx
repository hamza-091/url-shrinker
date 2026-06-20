import { useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Download, FileImage, FileCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  url: string;
  shortCode: string;
};

const PALETTE = [
  { label: "Violet", value: "#8b5cf6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Pink", value: "#ec4899" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Black", value: "#0a0a0a" },
];

export function QRModal({ open, onOpenChange, url, shortCode }: Props) {
  const [color, setColor] = useState("#6366f1");
  const canvasRef = useRef<HTMLDivElement>(null);

  function downloadPNG() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `shrinkr-${shortCode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function downloadSVG() {
    const svg = document.getElementById(`qr-svg-${shortCode}`);
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `shrinkr-${shortCode}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div
            ref={canvasRef}
            className="mx-auto grid place-items-center rounded-2xl bg-white p-6 shadow-soft"
          >
            <QRCodeCanvas value={url} size={220} fgColor={color} bgColor="#ffffff" level="M" />
            <div className="hidden">
              <QRCodeSVG id={`qr-svg-${shortCode}`} value={url} size={220} fgColor={color} bgColor="#ffffff" level="M" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</p>
            <div className="flex flex-wrap gap-2">
              {PALETTE.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setColor(p.value)}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-all",
                    color === p.value ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ background: p.value }}
                  aria-label={p.label}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={downloadPNG} variant="default" className="gap-2">
              <FileImage className="h-4 w-4" /> PNG
            </Button>
            <Button onClick={downloadSVG} variant="outline" className="gap-2">
              <FileCode className="h-4 w-4" /> SVG
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            <Download className="mr-1 inline h-3 w-3" />
            Scan or download to share
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
