import { useState, useCallback, useEffect } from 'react';

export interface Question {
  id: string;
  text: string;
  group: string;
  response: 'conforme' | 'non-conforme' | null;
  comment?: string;
  norm?: string;
}

export interface ScoreData {
  score: number;
  repondu: number;
  nom: string;
}

const STORAGE_KEY_OPERATIONAL = 'evaluation_data_operational';

const operationalQuestions: Question[] = [
  // Organisation des opérations
  { 
    id: 'org1', 
    text: 'Les équipes opérationnelles sont-elles clairement structurées ?', 
    group: 'Organisation des opérations', 
    response: null,
    norm: "Une structure organisationnelle claire avec des rôles et responsabilités bien définis"
  },
  { 
    id: 'org2', 
    text: 'Existe-t-il un organigramme à jour ?', 
    group: 'Organisation des opérations', 
    response: null,
    norm: "Un organigramme actualisé montrant la hiérarchie et les relations fonctionnelles"
  },
  { 
    id: 'org3', 
    text: 'Les rôles et responsabilités sont-ils documentés ?', 
    group: 'Organisation des opérations', 
    response: null,
    norm: "Documentation détaillée des rôles, responsabilités et compétences requises"
  },

  // Processus et procédures
  { 
    id: 'proc1', 
    text: 'Existe-t-il des procédures opérationnelles standardisées ?', 
    group: 'Processus et procédures', 
    response: null,
    norm: "Procédures documentées couvrant toutes les opérations critiques"
  },
  { 
    id: 'proc2', 
    text: 'Comment est géré le processus de changement ?', 
    group: 'Processus et procédures', 
    response: null,
    norm: "Processus formel de gestion des changements avec évaluation des risques"
  },
  { 
    id: 'proc3', 
    text: 'Les procédures d\'urgence sont-elles à jour ?', 
    group: 'Processus et procédures', 
    response: null,
    norm: "Procédures d'urgence documentées et testées régulièrement"
  },

  // Gestion des incidents
  { 
    id: 'inc1', 
    text: 'Existe-t-il un processus de gestion des incidents ?', 
    group: 'Gestion des incidents', 
    response: null,
    norm: "Processus structuré de détection, classification et résolution des incidents"
  },
  { 
    id: 'inc2', 
    text: 'Comment sont tracés les incidents ?', 
    group: 'Gestion des incidents', 
    response: null,
    norm: "Système de suivi des incidents avec historique et analyses"
  },
  { 
    id: 'inc3', 
    text: 'Les escalades sont-elles bien définies ?', 
    group: 'Gestion des incidents', 
    response: null,
    norm: "Procédure d'escalade claire avec niveaux et responsables identifiés"
  },

  // Maintenance et support
  { 
    id: 'maint1', 
    text: 'Existe-t-il un planning de maintenance préventive ?', 
    group: 'Maintenance et support', 
    response: null,
    norm: "Planning détaillé des maintenances préventives avec fréquences définies"
  },
  { 
    id: 'maint2', 
    text: 'Comment est organisé le support technique ?', 
    group: 'Maintenance et support', 
    response: null,
    norm: "Organisation du support avec niveaux de service définis"
  },
  { 
    id: 'maint3', 
    text: 'Les interventions sont-elles documentées ?', 
    group: 'Maintenance et support', 
    response: null,
    norm: "Documentation complète des interventions avec suivi des actions"
  },

  // Performance opérationnelle
  { 
    id: 'perf1', 
    text: 'Les KPIs opérationnels sont-ils définis ?', 
    group: 'Performance opérationnelle', 
    response: null,
    norm: "Indicateurs clés de performance pertinents et mesurables"
  },
  { 
    id: 'perf2', 
    text: 'Comment sont suivis les objectifs de performance ?', 
    group: 'Performance opérationnelle', 
    response: null,
    norm: "Suivi régulier des KPIs avec tableaux de bord"
  },
  { 
    id: 'perf3', 
    text: 'Existe-t-il un processus d\'amélioration continue ?', 
    group: 'Performance opérationnelle', 
    response: null,
    norm: "Processus d'analyse et d'amélioration basé sur les KPIs"
  },

  // Amélioration continue
  { 
    id: 'amelio1', 
    text: 'Comment sont identifiées les opportunités d\'amélioration ?', 
    group: 'Amélioration continue', 
    response: null,
    norm: "Processus systématique d'identification des axes d'amélioration"
  },
  { 
    id: 'amelio2', 
    text: 'Les retours d\'expérience sont-ils exploités ?', 
    group: 'Amélioration continue', 
    response: null,
    norm: "Capitalisation sur les retours d'expérience et leçons apprises"
  },
  { 
    id: 'amelio3', 
    text: 'Comment est mesuré l\'impact des améliorations ?', 
    group: 'Amélioration continue', 
    response: null,
    norm: "Mesure et suivi de l'efficacité des actions d'amélioration"
  }
];

export function useEvaluationScores(auditType: 'operational' = 'operational') {
  const storageKey = STORAGE_KEY_OPERATIONAL;
  const defaultQuestions = operationalQuestions;

  const [questions, setQuestions] = useState<Question[]>(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const { questions: savedQuestions } = JSON.parse(savedData);
      if (savedQuestions) return savedQuestions;
    }
    return defaultQuestions;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ questions }));
  }, [questions, storageKey]);

  const updateQuestionResponse = useCallback((id: string, response: 'conforme' | 'non-conforme' | 'comment', value?: string) => {
    setQuestions(prev => {
      const updated = prev.map(q => {
        if (q.id === id) {
          if (response === 'comment') {
            return { ...q, comment: value };
          }
          return { ...q, response };
        }
        return q;
      });
      return updated;
    });
  }, []);

  const getGlobalScore = useCallback((): ScoreData => {
    const repondues = questions.filter(q => q.response !== null);
    const conformes = repondues.filter(q => q.response === 'conforme');

    return {
      score: repondues.length === 0 ? 0 : (conformes.length / repondues.length) * 100,
      repondu: (repondues.length / questions.length) * 100,
      nom: 'Global'
    };
  }, [questions]);

  return {
    questions,
    updateQuestionResponse,
    getGlobalScore,
  };
}