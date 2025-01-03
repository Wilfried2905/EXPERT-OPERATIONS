import React from 'react';
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

interface GithubTokenFormData {
  token: string;
}

export default function GithubTokenInput() {
  const form = useForm<GithubTokenFormData>();

  const onSubmit = async (data: GithubTokenFormData) => {
    try {
      // TODO: Implement token storage logic
      toast({
        title: "Token sauvegardé",
        description: "Votre token GitHub a été enregistré avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du token.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <p className="mb-6 text-sm text-gray-600">
        Pour vous aider à pousser le code sur GitHub, nous aurons besoin d'un token GitHub. Un token GitHub
        est une clé d'accès sécurisée qui permet d'interagir avec votre compte GitHub de manière automatisée.
        Pourriez-vous fournir votre token GitHub ? Vous pouvez le créer dans les paramètres de votre compte
        GitHub sous {"'Developer settings'"} {'->'} {"'Personal access tokens'"} {'->'} {"'Tokens (classic)'"}.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GITHUB_TOKEN
          </label>
          <input
            type="password"
            {...form.register("token", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Entrez votre token GitHub"
          />
        </div>

        <button 
          onClick={form.handleSubmit(onSubmit)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
}