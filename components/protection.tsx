'use client';

import { useEffect } from 'react';

export function Protection() {
  useEffect(() => {
    // Désactiver le clic droit
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Désactiver les raccourcis clavier (F12, Ctrl+Shift+I, Ctrl+U, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I - DevTools
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J - Console
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C - Inspect Element
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }

      // Ctrl+U - View Source
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Ctrl+S - Save Page
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Ctrl+P - Print (peut être utilisé pour inspecter)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
    };

    // Désactiver la sélection de texte
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Désactiver le drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Désactiver le copier
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Désactiver le couper
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Ajouter les event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);

    // Détecter l'ouverture des DevTools
    let devtools = { open: false, orientation: null as string | null };
    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          // Optionnel : rediriger ou afficher un message
          // window.location.href = '/';
          console.clear();
          console.log('%c⚠️ Accès non autorisé', 'color: red; font-size: 50px; font-weight: bold;');
          console.log('%cL\'inspection du code est interdite.', 'color: red; font-size: 20px;');
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Nettoyer les event listeners au démontage
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
    };
  }, []);

  return null;
}

