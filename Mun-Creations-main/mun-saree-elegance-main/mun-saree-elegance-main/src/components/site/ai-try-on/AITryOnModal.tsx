import React from "react";

export interface AITryOnModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  product?: any;
}

/**
 * AI Try-On feature has been completely removed per project specification.
 */
export const AITryOnModal: React.FC<AITryOnModalProps> = () => null;

export default AITryOnModal;
