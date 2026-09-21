import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/context";

// 1. Definisikan interface untuk struktur data profil/user
interface UserProfileData {
  tanda_tangan?: string;
  tandaTangan?: string;
  // Index signature untuk menghindari error jika ada properti lain di dalam objeknya
  [key: string]: unknown;
}

export function SignatureField({
  value,
  onChange,
  readOnly,
  fallbackName,
}: {
  value?: { type: "auto" | "upload" | "draw"; data?: string };
  onChange: (val: { type: "auto" | "upload" | "draw"; data?: string }) => void;
  readOnly?: boolean;
  fallbackName?: string;
}) {
  const { registeredProfile, user } = useAppContext();
  const profileData = registeredProfile as UserProfileData | undefined | null;
  const userData = user as UserProfileData | undefined | null;

  const profileSignature =
    profileData?.tanda_tangan ||
    profileData?.tandaTangan ||
    userData?.tanda_tangan ||
    "";

  const [useProfile, setUseProfile] = useState(
    value?.type === "auto" || !value,
  );

  useEffect(() => {
    if (value) {
      setUseProfile(value.type === "auto");
    }
  }, [value]);

  useEffect(() => {
    if (useProfile && profileSignature && (!value || !value.data)) {
      onChange({ type: "auto", data: profileSignature });
    }
  }, [useProfile, profileSignature, value?.data, onChange]);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseProfile(checked);
    if (checked) {
      onChange({ type: "auto", data: profileSignature });
    }
  };

  const displaySignature = (value?.type === "auto" && value?.data) ? value.data : (useProfile ? profileSignature : undefined);

  if (readOnly) {
    if (!value)
      return (
        <div className="h-20 flex items-center justify-center text-gray-400">
          Belum ada tanda tangan
        </div>
      );

    if (value.type === "auto") {
      const sigData = value.data || profileSignature;
      if (sigData) {
        return (
          <div className="flex flex-col items-center justify-center h-20">
            <img
              src={sigData}
              alt="Tanda Tangan Profil"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center opacity-80 h-20">
          <div className="text-xl font-signature text-blue-800 rotate-[-5deg] scale-110">
            {fallbackName || "Tanda Tangan"}
          </div>
          <div className="text-[9px] text-slate-500 mt-2">
            Ditandatangani secara elektronik
          </div>
        </div>
      );
    }

    if (value.type === "upload" || value.type === "draw") {
      return (
        <div className="flex flex-col items-center justify-center h-20">
          {value.data ? (
            <img
              src={value.data}
              alt="Tanda Tangan"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-xs text-gray-400">
              Tanda tangan tidak valid
            </span>
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
          displaySignature ? (
            <img
              src={displaySignature}
              alt="Tanda Tangan Profil"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center opacity-80">
              <div className="text-xl font-signature text-blue-800 rotate-[-5deg] scale-150">
                {fallbackName || "Tanda Tangan"}
              </div>
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <span className="text-xs text-gray-400">
              Harap centang profil untuk menggunakan tanda tangan profil.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}