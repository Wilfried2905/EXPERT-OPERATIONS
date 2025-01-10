import { useEffect } from 'react';

export function useDashboardTextRemoval() {
  useEffect(() => {
    const removeDashboardText = () => {
      try {
        // Trouver tous les nœuds de texte dans le document
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              if (!node.textContent) return NodeFilter.FILTER_REJECT;
              // Ne pas masquer "Tableau de Bord" mais uniquement "dashboard"
              return node.textContent.toLowerCase().includes('dashboard') &&
                     !node.textContent.includes('Tableau de Bord')
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
            }
          }
        );

        // Collecter et modifier les nœuds
        const textNodes: Node[] = [];
        let node;
        while ((node = walker.nextNode())) {
          textNodes.push(node);
        }

        // Remplacer le texte dans chaque nœud
        textNodes.forEach((node) => {
          if (node.textContent) {
            const newText = node.textContent.replace(/\bdashboard\b/gi, '');
            if (node.textContent !== newText) {
              node.textContent = newText;
            }
          }
        });
      } catch (error) {
        console.error('Erreur lors de la suppression du texte dashboard:', error);
      }
    };

    // Configuration du MutationObserver
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        // Vérifier si la mutation concerne du texte
        if (mutation.type === 'characterData') {
          const node = mutation.target;
          if (node.textContent?.toLowerCase().includes('dashboard') &&
              !node.textContent.includes('Tableau de Bord')) {
            shouldUpdate = true;
          }
        }
        // Vérifier les nouveaux nœuds
        else if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.textContent?.toLowerCase().includes('dashboard') &&
                !node.textContent.includes('Tableau de Bord')) {
              shouldUpdate = true;
            }
          });
        }
      });

      // N'exécuter removeDashboardText que si nécessaire
      if (shouldUpdate) {
        removeDashboardText();
      }
    });

    // Configuration de l'observateur
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Exécution initiale
    removeDashboardText();

    // Nettoyage
    return () => {
      observer.disconnect();
    };
  }, []);
}