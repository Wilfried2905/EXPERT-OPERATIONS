# Analyse du Code Actuel - Génération de Documents et Recommandations

## 1. Routes Backend (server/routes.ts)

### Endpoint de Génération de Documents
```typescript
app.post("/api/documents/generate", async (req, res) => {
  try {
    const { type, title, clientInfo, content, auditData } = req.body;

    // Validation des données requises
    if (!type || !clientInfo || !content || !auditData) {
      return res.status(400).json({
        error: 'Données requises manquantes'
      });
    }

    const documentTitle = `3R_${type}_${clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '')}`;
    const wordBuffer = await generateWordDocument(content, documentTitle);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${documentTitle}.docx"`);
    res.send(wordBuffer);
  } catch (error) {
    res.status(500).json({
      error: 'Erreur de génération',
      details: error.message
    });
  }
});
```

### Endpoint des Recommandations
```typescript
app.post("/api/recommendations", generateRecommendations);

async function generateRecommendations(req: any, res: any) {
  try {
    if (!req.body || !req.body.auditData) {
      return res.status(400).json({
        error: "Données d'audit requises manquantes"
      });
    }

    const prompt = `En tant qu'expert en audit de datacenters...`;
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" }
    });

    const content = response.content[0].text;
    if (!content) {
      throw new Error('Réponse invalide de l\'API');
    }

    res.json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la génération des recommandations",
      details: error.message
    });
  }
}
```

## 2. Hook de Génération (client/src/hooks/useDocumentGeneration.ts)

```typescript
export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async (e: React.MouseEvent, docKey: string, docTitle: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!docKey || !docTitle) {
      toast({
        title: "Erreur",
        description: "Informations du document manquantes",
        variant: "destructive"
      });
      return;
    }

    const toastId = toast({
      title: "Génération en cours",
      description: "Préparation du document...",
      duration: 0
    });

    try {
      setIsGenerating(true);

      const documentData = {
        type: docKey === 'offreTechnique' 
          ? DocumentType.TECHNICAL_OFFER
          : docKey === 'cahierCharges'
            ? DocumentType.SPECIFICATIONS
            : DocumentType.AUDIT_REPORT,
        title: docTitle,
        clientInfo: {
          name: 'Client Test',
          industry: 'Technologie',
          size: 'Grande entreprise'
        },
        auditData: {
          metrics: {
            pue: [1.8, 1.9, 1.7],
            availability: [99.9, 99.8, 99.95],
            tierLevel: 3
          },
          infrastructure: {
            rooms: [],
            equipment: []
          },
          compliance: {
            matrix: {},
            score: 85
          }
        },
        content: `# ${documentType}\n\nContenu généré...`
      };

      const blob = await generateDocument(documentData);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docTitle}_${new Date().toISOString().split('T')[0]}.docx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('[Download] Error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la génération du document",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      toast.dismiss(toastId);
    }
  }, [isGenerating]);

  return { handleDownload, isGenerating };
}
```

## 3. Service de Génération (client/src/services/documentGeneration.ts)

```typescript
export async function generateDocument(input: DocumentData): Promise<Blob> {
  try {
    const response = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.details || errorData.error);
      } catch (parseError) {
        throw new Error(`Erreur serveur: ${errorText}`);
      }
    }

    return await response.blob();
  } catch (error) {
    throw error;
  }
}
```

## Points Problématiques Identifiés

1. **Structure des Données**
   - Incohérence entre la validation côté client et serveur
   - Le format des données `auditData` n'est pas standardisé
   - Les types ne sont pas correctement partagés

2. **Gestion des Erreurs**
   - Certaines erreurs ne sont pas correctement propagées
   - Les messages d'erreur manquent de contexte
   - Le parsing des erreurs n'est pas uniforme

3. **Validation**
   - Les validations ne sont pas synchronisées entre client et serveur
   - Certains champs requis ne sont pas validés
   - Les types de données ne sont pas strictement vérifiés

4. **Format de Réponse**
   - Le format JSON n'est pas toujours forcé dans les réponses
   - Les structures de réponse ne sont pas cohérentes

## Suggestions d'Amélioration

1. **Standardisation**
   - Créer des interfaces partagées pour les types de données
   - Uniformiser la validation des données
   - Définir un format de réponse standard

2. **Gestion des Erreurs**
   - Implémenter une gestion d'erreur centralisée
   - Ajouter des codes d'erreur spécifiques
   - Améliorer les messages d'erreur

3. **Validation**
   - Utiliser Zod pour la validation des données
   - Synchroniser les validations client/serveur
   - Ajouter des validations plus strictes

4. **Logging**
   - Améliorer le système de logging
   - Ajouter des identifiants de requête
   - Tracer les étapes de génération
