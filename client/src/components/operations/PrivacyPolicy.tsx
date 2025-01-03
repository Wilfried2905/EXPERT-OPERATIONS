import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onValidate: () => void;
  onBack: () => void;
  isDarkMode: boolean;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onValidate, onBack, isDarkMode }) => {
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [, setLocation] = useLocation();

  const handleValidation = () => {
    if (!accepted) {
      setShowError(true);
      return;
    }
    onValidate();
    setLocation('/operations/main');
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 ${isDarkMode ? 'text-[#FF9900]' : 'text-[#003366]'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className={`text-2xl md:text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-[#003366]'} font-sans`}>
            Politique de Confidentialité et Protection des Données à Caractère Personnel
          </h1>
        </div>

        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg`}>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className={`space-y-8 p-6 text-justify ${isDarkMode ? 'text-[#E0E0E0]' : 'text-[#003366]'} font-sans`}>
              <section>
                <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
                <p>
                  Chez 3R TECHNOLOGIE, nous prenons très au sérieux la protection des données à caractère personnel de nos clients. Ce document décrit de manière claire et transparente la manière dont nous collectons, utilisons, protégeons et partageons vos informations personnelles. En acceptant notre politique de confidentialité, vous nous autorisez à traiter vos données conformément aux termes décrits ci-dessous. Nous nous engageons à respecter la confidentialité de vos informations et à garantir la sécurité des données que vous nous confiez, afin de vous offrir un service de qualité et conforme aux normes en vigueur.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">2. Données Collectées</h2>
                <p>Dans le cadre de nos surveys, nous pouvons être amenés à collecter les données suivantes :</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Informations sur l'identité : nom, prénom, fonction.</li>
                  <li>Coordonnées : adresse e-mail, numéro de téléphone.</li>
                  <li>Informations techniques sur l'environnement évalué : infrastructure, équipements techniques, état des lieux.</li>
                </ul>
                <p className="mt-4">
                  Ces informations sont essentielles pour nous permettre de mener à bien nos analyses et de vous fournir des recommandations pertinentes et personnalisées. Nous nous assurons que seules les données nécessaires à nos prestations sont collectées, de manière à limiter tout excès de collecte inutile.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">3. Utilisation des Données</h2>
                <p>Les données collectées sont utilisées uniquement pour :</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>La réalisation des surveys et la production de rapports détaillés sur l'état de vos infrastructures.</li>
                  <li>L'élaboration de recommandations techniques pour améliorer l'efficacité, la sécurité et la conformité des infrastructures.</li>
                  <li>La communication avec les clients concernant les étapes des surveys, les conclusions, les recommandations et les actions à mener par la suite.</li>
                </ul>
                <p className="mt-4">
                  Nous nous engageons à ne jamais utiliser vos données à des fins de marketing sans votre consentement explicite. Les informations collectées servent exclusivement aux finalités pour lesquelles elles ont été recueillies et dans le strict respect de la réglementation applicable.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">4. Partage des Données</h2>
                <p>
                  Vos données ne seront jamais vendues à des tiers. Toutefois, elles peuvent être partagées avec des partenaires techniques uniquement dans le cadre des services fournis, et uniquement après votre autorisation expresse. Nos partenaires sont tenus de respecter la confidentialité et la sécurité de vos informations, et nous veillons à ce qu'ils adhèrent aux mêmes standards élevés que nous.
                </p>
                <p className="mt-4">
                  En cas de transfert de données à des tiers, nous vous informerons en amont et vous aurez la possibilité de refuser ce partage. Nous prenons des mesures strictes pour garantir que tous les transferts de données soient effectués en conformité avec les lois sur la protection des données.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">5. Durée de Conservation</h2>
                <p>
                  Vos données sont conservées pendant la durée nécessaire à la réalisation des surveys, à la production des rapports et pour se conformer aux obligations légales. Après cette période, elles seront supprimées de manière sécurisée afin de garantir qu'aucune information personnelle ne soit conservée au-delà de ce qui est nécessaire.
                </p>
                <p className="mt-4">
                  Nous révisons régulièrement nos politiques de conservation des données pour nous assurer que vos informations ne sont pas stockées plus longtemps que nécessaire, tout en tenant compte des exigences légales et des obligations contractuelles.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">6. Sécurité des Données</h2>
                <p>
                  Nous mettons en place toutes les mesures techniques et organisationnelles nécessaires pour assurer la sécurité de vos données, notamment via le chiffrement des informations sensibles et l'utilisation de protocoles sécurisés pour la transmission des données. Nous utilisons des pares-feux, des systèmes de détection d'intrusion, et procédons à des audits de sécurité réguliers afin de protéger vos données contre les accès non autorisés, les altérations ou les pertes.
                </p>
                <p className="mt-4">
                  Nous sensibilisons également nos employés à la protection des données personnelles et leur fournissons les outils nécessaires pour respecter les règles de sécurité, garantissant ainsi une protection globale à tous les niveaux.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">7. Vos Droits</h2>
                <p>Conformément à la réglementation en vigueur, vous disposez des droits suivants concernant vos données personnelles :</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li><strong>Droit d'accès</strong> : vous pouvez demander l'accès à vos informations personnelles afin de savoir exactement quelles données sont en notre possession.</li>
                  <li><strong>Droit de rectification</strong> : vous pouvez demander la correction des informations inexactes ou incomplètes afin de garantir l'exactitude des données que nous détenons.</li>
                  <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de vos données dans certaines circonstances, par exemple si elles ne sont plus nécessaires pour les finalités initiales.</li>
                  <li><strong>Droit à la limitation du traitement</strong> : vous pouvez limiter le traitement de vos données en cas de contestation de l'exactitude des données ou si vous vous opposez à leur utilisation.</li>
                  <li><strong>Droit à la portabilité des données</strong> : dans certaines situations, vous pouvez demander à recevoir vos données dans un format structuré, couramment utilisé et lisible par machine, pour les transmettre à un autre responsable de traitement.</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, vous pouvez nous contacter à l'adresse e-mail suivante : infos@3rtechnologie.com. Nous nous engageons à répondre à toutes vos demandes dans les meilleurs délais et à fournir l'assistance nécessaire.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">8. Acceptation de la Politique de Confidentialité</h2>
                <p>
                  En acceptant cette politique de confidentialité, vous reconnaissez avoir pris connaissance des informations ci-dessus et consentez au traitement de vos données personnelles dans les conditions décrites. Vous avez la possibilité de retirer votre consentement à tout moment, mais cela pourrait limiter notre capacité à vous fournir certains services.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">9. Modifications de la Politique de Confidentialité</h2>
                <p>
                  Cette politique de confidentialité peut être modifiée occasionnellement pour répondre à des mises à jour légales, pour refléter des modifications de nos procédures internes ou pour intégrer de nouvelles fonctionnalités. Toute modification vous sera notifiée par e-mail ou via une mise à jour visible sur notre site web, et vous serez invité à consulter ces changements.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">10. Contact</h2>
                <p>
                  Pour toute question concernant cette politique, veuillez nous contacter à l'adresse suivante : infos@3rtechnologie.com. Nous sommes disponibles pour répondre à toutes vos interrogations et vous fournir des informations complémentaires sur la gestion de vos données personnelles.
                </p>
                <p className="mt-4">
                  En cas de litige concernant l'utilisation de vos données personnelles, vous avez également la possibilité de contacter l'autorité de contrôle compétente pour déposer une réclamation.
                </p>
              </section>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-gray-200">
            <div className="flex items-start space-x-3 mb-6">
              <Checkbox
                id="privacy-accept"
                checked={accepted}
                onCheckedChange={(checked: boolean) => {
                  setAccepted(checked);
                  if (checked) setShowError(false);
                }}
                className={`mt-1 ${isDarkMode ? 'border-[#E0E0E0]' : 'border-[#003366]'}`}
              />
              <label
                htmlFor="privacy-accept"
                className={`text-sm ${isDarkMode ? 'text-[#E0E0E0]' : 'text-[#003366]'} font-sans`}
              >
                Je déclare avoir lu et compris la politique de confidentialité et j'accepte le traitement de mes données personnelles conformément à ces conditions.
              </label>
            </div>

            {showError && (
              <div className="flex items-center space-x-2 text-red-500 mb-4">
                <AlertCircle size={16} />
                <span className="text-sm">Veuillez accepter la politique de confidentialité pour continuer.</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className={`flex-1 py-3 rounded font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-[#003366]'
                }`}
              >
                Retour
              </button>
              <button
                onClick={handleValidation}
                className={`flex-1 py-3 rounded font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-[#FF9900] hover:bg-[#E68A00] text-white' 
                    : 'bg-[#003366] hover:bg-[#002B47] text-white'
                }`}
              >
                Valider et continuer
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;