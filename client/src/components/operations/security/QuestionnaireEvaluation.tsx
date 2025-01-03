import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Upload } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const SecurityQuestionnaireEvaluation = () => {
  const [, setLocation] = useLocation();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { conformity: string; comment: string }>>({});

  const sections = [
    {
      title: "Sécurisation de l'infrastructure",
      questions: [
        {
          question: "Les pare-feu et les systèmes de détection d'intrusion sont-ils configurés pour bloquer les menaces connues et détecter les anomalies ?",
          reference: "Meilleures pratiques de sécurité - Utilisation de pare-feu et IDS pour empêcher les attaques et détecter les intrusions."
        },
        {
          question: "Avez-vous mis en place des politiques de chiffrement pour protéger les données sensibles en transit et au repos ?",
          reference: "ISO 27001, NIST - Le chiffrement des données est une mesure essentielle pour protéger les informations sensibles."
        },
        {
          question: "Les dispositifs d'accès physique aux centres de données sont-ils contrôlés et sécurisés ?",
          reference: "ISO 27001 - Assurer que l'accès physique aux infrastructures critiques soit restreint."
        },
        {
          question: "Les systèmes de contrôle d'accès au réseau (firewall, VPN) sont-ils configurés pour limiter l'accès aux ressources sensibles ?",
          reference: "NIST, CIS - Utilisation de mécanismes de sécurité réseau pour restreindre l'accès aux ressources sensibles."
        }
      ]
    },
    {
      title: "Gestion des identités et des accès",
      questions: [
        {
          question: "Utilisez-vous une solution de gestion des identités pour contrôler et suivre l'accès des utilisateurs aux ressources sensibles ?",
          reference: "ISO 27001 - La gestion des identités (IAM) est cruciale pour limiter les accès non autorisés."
        },
        {
          question: "Les mots de passe et autres moyens d'authentification respectent-ils des critères de complexité et de renouvellement réguliers ?",
          reference: "NIST - Les bonnes pratiques incluent des politiques strictes de gestion des mots de passe."
        },
        {
          question: "Les utilisateurs ont-ils un accès strictement limité aux systèmes et ressources dont ils ont besoin pour leur travail ?",
          reference: "ISO 27001 - Limiter l'accès selon le principe du moindre privilège pour renforcer la sécurité."
        },
        {
          question: "Les droits d'accès sont-ils réévalués régulièrement pour s'assurer qu'ils sont toujours appropriés ?",
          reference: "CIS, NIST - Réévaluation périodique des accès pour éviter des accès non autorisés ou obsolètes."
        }
      ]
    },
    {
      title: "Sécurité des données",
      questions: [
        {
          question: "Des sauvegardes régulières des données sensibles sont-elles effectuées et stockées de manière sécurisée ?",
          reference: "ISO 27001 - Les données doivent être régulièrement sauvegardées et chiffrées pour leur protection."
        },
        {
          question: "Avez-vous mis en place des mesures de protection contre la perte ou le vol de données sensibles ?",
          reference: "NIST - La protection des données contre les fuites ou les vols est essentielle pour éviter des violations."
        },
        {
          question: "Les dispositifs de stockage de données sont-ils sécurisés contre les accès non autorisés ?",
          reference: "ISO 27001 - Les supports de données doivent être protégés par des moyens physiques et logiques."
        },
        {
          question: "Les données sensibles sont-elles stockées de manière sécurisée dans des bases de données protégées ?",
          reference: "ISO 27001 - Les bases de données contenant des informations sensibles doivent être protégées par des mécanismes de sécurité."
        }
      ]
    },
    {
      title: "Réponse aux incidents et gestion des crises",
      questions: [
        {
          question: "Avez-vous un plan d'intervention d'urgence et de reprise après sinistre pour les incidents de sécurité ?",
          reference: "ISO 27001 - Plan de continuité des activités et de reprise après sinistre pour garantir la résilience."
        },
        {
          question: "Les employés sont-ils formés pour réagir en cas d'incident de sécurité ?",
          reference: "ISO 27001 - Formation continue des employés pour assurer une gestion efficace des incidents."
        },
        {
          question: "Avez-vous un processus pour évaluer les impacts d'un incident de sécurité sur les opérations ?",
          reference: "NIST - Évaluation des impacts pour gérer les conséquences d'un incident."
        },
        {
          question: "Les incidents de sécurité sont-ils suivis, analysés et rapportés de manière à en tirer des enseignements ?",
          reference: "NIST - Analyse post-incident pour prévenir les futurs incidents et améliorer les mesures de sécurité."
        }
      ]
    },
    {
      title: "Surveillance continue et gestion des vulnérabilités",
      questions: [
        {
          question: "Utilisez-vous des outils de surveillance continue pour détecter les vulnérabilités et menaces en temps réel ?",
          reference: "NIST, CIS - La surveillance continue est cruciale pour détecter les menaces à un stade précoce."
        },
        {
          question: "Les vulnérabilités détectées sont-elles corrigées dans un délai raisonnable ?",
          reference: "ISO 27001 - Processus de gestion des vulnérabilités pour assurer la mise à jour et la sécurisation continue des systèmes."
        },
        {
          question: "Les journaux d'activités sont-ils conservés de manière sécurisée et analysés régulièrement ?",
          reference: "ISO 27001 - Les journaux d'audit doivent être surveillés pour détecter les comportements suspects."
        },
        {
          question: "Les mises à jour de sécurité sont-elles appliquées en temps opportun pour corriger les vulnérabilités découvertes ?",
          reference: "NIST - Maintenir les systèmes à jour est crucial pour la gestion des risques."
        }
      ]
    }
  ];

  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);
  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const conformityCount = Object.values(answers).filter(a => a.conformity === 'conforme').length;
  const conformity = (conformityCount / totalQuestions) * 100;

  const handleAnswerChange = (questionIndex: number, data: { conformity?: string; comment?: string }) => {
    const key = `${currentSection}-${questionIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: {
        ...prev[key] || { conformity: '', comment: '' },
        ...data
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setLocation('/operations/security/client-info');
    }
  };

  const handlePrevious = () => setCurrentSection(prev => Math.max(0, prev - 1));

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Questionnaire d'évaluation - Audit de Sécurité</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-sm font-medium mb-2">Progression</h2>
            <Progress value={progress} className="progress-bar" />
            <span className="text-sm text-gray-500">{Math.round(progress)}% complété</span>
          </div>

          <div>
            <h2 className="text-sm font-medium mb-2">Conformité</h2>
            <Progress value={conformity} className="progress-bar" />
            <span className="text-sm text-gray-500">{Math.round(conformity)}% conforme</span>
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">{sections[currentSection].title}</h2>

          <div className="space-y-8">
            {sections[currentSection].questions.map((question, idx) => (
              <div key={idx} className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{question.question}</h3>
                  <p className="text-sm text-gray-600 italic">{question.reference}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={answers[`${currentSection}-${idx}`]?.conformity === 'conforme' ? 'default' : 'outline'}
                    onClick={() => handleAnswerChange(idx, { conformity: 'conforme' })}
                  >
                    Conforme
                  </Button>
                  <Button
                    variant={answers[`${currentSection}-${idx}`]?.conformity === 'non-conforme' ? 'default' : 'outline'}
                    onClick={() => handleAnswerChange(idx, { conformity: 'non-conforme' })}
                  >
                    Non Conforme
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Commentaires et observations
                  </label>
                  <Textarea
                    value={answers[`${currentSection}-${idx}`]?.comment || ''}
                    onChange={(e) => handleAnswerChange(idx, { comment: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button className="w-full justify-center" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Ajouter des fichiers
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              Précédent
            </Button>
            <Button onClick={handleNext}>
              {currentSection === sections.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SecurityQuestionnaireEvaluation;