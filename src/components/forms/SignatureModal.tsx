import React, { useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

export interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: (dataUrl: string) => void;
  initialSignature?: string;
}

export function SignatureModal({
  isOpen,
  onClose,
  title,
  onSave,
  initialSignature,
}: SignatureModalProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialSignature && sigRef.current) {
      setTimeout(() => {
        try {
          sigRef.current?.fromDataURL(initialSignature);
        } catch {
          // ignore error if invalid data
        }
      }, 50);
    }
  }, [isOpen, initialSignature]);

  const resizeCanvas = useCallback(() => {
    if (sigRef.current && containerRef.current) {
      const canvas = sigRef.current.getCanvas();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;

      // Perbaikan optional chaining
      canvas.getContext("2d")?.scale(ratio, ratio);

      sigRef.current.clear();
      if (initialSignature) {
        sigRef.current.fromDataURL(initialSignature);
      }
    }
  }, [initialSignature]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", resizeCanvas);
      setTimeout(resizeCanvas, 50);
    }
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isOpen, resizeCanvas]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (sigRef.current && event.target?.result) {
          sigRef.current.fromDataURL(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (sigRef.current) {
      if (sigRef.current.isEmpty()) {
        // allow saving if empty? no, better to clear?
        // Actually just let it save whatever
      }
      const dataUrl = sigRef.current.toDataURL();
      onSave(dataUrl);
      onClose();
    }
  };

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div
            ref={containerRef}
            className="border border-gray-300 rounded-lg overflow-hidden bg-white w-full h-48 sm:h-64 relative"
          >
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{
                className: "w-full h-full cursor-crosshair absolute inset-0",
              }}
              backgroundColor="white"
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Hapus
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs transition-colors"
            >
              Upload
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-xs transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
