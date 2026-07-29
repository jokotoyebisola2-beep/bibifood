/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AuthView from './AuthView';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, profileData?: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-brand-olive/65 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Box wrapper with scroll support for fields */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto scrollbar-thin"
        >
          <AuthView onClose={onClose} onLoginSuccess={onLoginSuccess} initialMode="welcome" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
