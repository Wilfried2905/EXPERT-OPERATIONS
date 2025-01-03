import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  selectedEmail?: string;
}

export function LoginForm({ selectedEmail }: LoginFormProps) {
  const { login } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    defaultValues: {
      email: selectedEmail || '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('LoginForm: Tentative de connexion avec:', {
      email: data.email,
      passwordLength: data.password.length,
      timestamp: new Date().toISOString(),
      selectedEmail: selectedEmail // Pour tracer si l'email vient de la sélection de profil
    });

    try {
      const result = await login(data);
      console.log('LoginForm: Résultat de la connexion:', {
        ...result,
        timestamp: new Date().toISOString()
      });

      if (!result.ok) {
        throw new Error(result.message);
      }

      console.log('LoginForm: Connexion réussie, redirection vers le tableau de bord');
      setLocation('/dashboard');
    } catch (error: any) {
      console.error('LoginForm: Erreur lors de la connexion:', {
        error: error.message,
        timestamp: new Date().toISOString(),
        email: data.email
      });

      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full border-2 border-[#003366]/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl text-[#003366]">
          3R EXPERT OPERATIONS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("email", { required: "L'email est requis" })}
              type="email"
              placeholder="Email"
              className="border-[#003366]/20 focus-visible:ring-[#003366]"
              disabled={!!selectedEmail}
              defaultValue={selectedEmail}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("password", { required: "Le mot de passe est requis" })}
              type="password"
              placeholder="Mot de passe"
              className="border-[#003366]/20 focus-visible:ring-[#003366]"
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              En phase de test, le mot de passe est "test" pour tous les profils
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}