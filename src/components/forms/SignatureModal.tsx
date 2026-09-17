/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
import React from "react";

export interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: (dataUrl: string) => void;
  initialSignature?: string;
}

export function SignatureModal({}: SignatureModalProps) {
  // Canvas has been removed per user request.
  // Signatures are now automatically populated from profiles.
  return null;
}
