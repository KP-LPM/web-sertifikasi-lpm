import React, { useRef, useState, useEffect } from 'react';
import { X, PenTool } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

export function SignatureField({ 
  value, 
  onChange, 
  readOnly,
  fallbackName
}: { 
  value?: { type: 'auto' | 'upload' | 'draw', data?: string }; 
  onChange: (val: { type: 'auto' | 'upload' | 'draw', data?: string }) => void;
  readOnly?: boolean;
  fallbackName?: string;
}) {
  const [useProfile, setUseProfile] = useState(value?.type === 'auto' || !value);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sigCanvas = useRef<any>(null);

  useEffect(() => {
    if (value) {
      setUseProfile(value.type === 'auto');
    }
  }, [value]);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseProfile(checked);
    if (checked) {
      onChange({ type: 'auto', data: '' });
    } else {
      onChange({ type: 'draw', data: '' });
    }
  };

  const saveSignature = () => {
    if (sigCanvas.current) {
      onChange({ type: 'draw', data: sigCanvas.current.toDataURL() });
      setIsModalOpen(false);
    }
  };

  if (readOnly) {
    if (!value) return <div className="h-20 flex items-center justify-center text-gray-400">Belum ada tanda tangan</div>;
    
    if (value.type === 'auto') {
      return (
        <div className="flex flex-col items-center justify-center opacity-80 h-20">
           <div className="text-xl font-signature text-blue-800 rotate-[-5deg] scale-150">{fallbackName || 'Tanda Tangan'}</div>
           <div className="text-[9px] text-slate-500 mt-2">Ditandatangani secara elektronik</div>
        </div>
      );
    }

    if (value.type === 'upload' || value.type === 'draw') {
      return (
        <div className="flex flex-col items-center justify-center h-20">
          {value.data ? (
            <img src={value.data} alt="Tanda Tangan" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">Tanda tangan tidak valid</span>
          )}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-4 text-xs font-bold text-slate-700 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={useProfile} 
            onChange={handleCheckbox} 
            className="w-4 h-4 rounded border-gray-300 text-[#008BE3] focus:ring-[#008BE3]"
          />
          Profil
        </label>
      </div>

      <div className="border border-slate-300 rounded p-1 h-24 flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative w-full">
        {useProfile ? (
          <div className="flex flex-col items-center justify-center opacity-80">
            <div className="text-xl font-signature text-blue-800 rotate-[-5deg] scale-150">{fallbackName || 'Tanda Tangan'}</div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
             {value?.type === 'draw' && value.data ? (
               <div className="relative h-full w-full flex items-center justify-center group">
                 <img src={value.data} className="max-h-full max-w-full object-contain" alt="Tanda Tangan" />
                 <button type="button" onClick={() => setIsModalOpen(true)} className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm border border-gray-200 text-[#008BE3] font-bold rounded-lg px-3 py-1.5 text-xs shadow-sm flex items-center gap-1"><PenTool size={12}/> Ubah</button>
               </div>
             ) : (
               <button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-[#008BE3] bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                 <PenTool size={14} /> Gambar Tanda Tangan
               </button>
             )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Gambar Tanda Tangan</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-slate-50/50">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <SignatureCanvas 
                  ref={sigCanvas}
                  canvasProps={{
                    className: 'w-full h-48 sm:h-64 cursor-crosshair'
                  }}
                  backgroundColor="white"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => sigCanvas.current?.clear()} className="px-4 py-2.5 text-gray-500 font-bold text-xs hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">Bersihkan</button>
                <button type="button" onClick={saveSignature} className="px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold shadow-sm transition-colors">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
