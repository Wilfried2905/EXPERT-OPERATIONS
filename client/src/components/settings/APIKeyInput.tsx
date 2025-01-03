import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Key } from 'lucide-react';

const APIKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/settings/anthropic-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de la clé API');
      }

      toast({
        title: "Succès",
        description: "La clé API Anthropic a été enregistrée avec succès",
      });
      
      setApiKey('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la clé API",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuration API Anthropic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Entrez votre clé API Anthropic"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Vous pouvez obtenir votre clé API sur {' '}
              <a 
                href="https://www.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                anthropic.com
              </a>
            </p>
          </div>
          <Button type="submit" className="w-full">
            Sauvegarder la clé API
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default APIKeyInput;
