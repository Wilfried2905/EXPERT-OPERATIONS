import { toast } from '@/hooks/use-toast';

export const logError = (context: string, error: any) => {
  console.error(`[${context}] Error details:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    type: error.name,
    code: error.code,
    response: error.response,
  });
};

export const withRetry = async <T>(
  fn: () => Promise<T>, 
  options: { 
    maxRetries?: number;
    context?: string;
    onError?: (error: any, attempt: number) => void;
  } = {}
): Promise<T> => {
  const { maxRetries = 3, context = 'Operation', onError } = options;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logError(`${context} - Attempt ${i + 1}/${maxRetries}`, error);
      
      if (onError) {
        onError(error, i + 1);
      }

      if (i < maxRetries - 1) {
        const delay = 1000 * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        toast({
          title: "Nouvelle tentative",
          description: `Tentative ${i + 2}/${maxRetries}...`,
          duration: 3000,
        });
      }
    }
  }

  throw lastError;
};

export const handleAPIError = (error: any) => {
  let errorMessage = "Une erreur inattendue est survenue";
  
  if (error.response) {
    // Erreur de réponse du serveur
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
      errorMessage = data.message || "Données invalides";
    } else if (status === 401) {
      errorMessage = "Non autorisé - veuillez vous reconnecter";
    } else if (status === 403) {
      errorMessage = "Accès refusé";
    } else if (status === 404) {
      errorMessage = "Ressource non trouvée";
    } else if (status >= 500) {
      errorMessage = "Erreur serveur - veuillez réessayer plus tard";
    }
  } else if (error.request) {
    // Pas de réponse reçue
    errorMessage = "Impossible de contacter le serveur";
  }
  
  toast({
    title: "Erreur",
    description: errorMessage,
    variant: "destructive",
    duration: 5000,
  });

  return errorMessage;
};
