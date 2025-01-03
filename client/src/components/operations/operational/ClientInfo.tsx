import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Définition des équipements par type de salle
const EQUIPMENT_BY_ROOM_TYPE = {
  server: [
    "Serveurs (rack, lame, tour)",
    "Onduleurs (UPS)",
    "Onduleurs (UPS) modulaires avec redondance N+1 ou 2N",
    "Baies de stockage",
    "Switches réseau redondants",
    "Routeurs avec redondance",
    "Systèmes de refroidissement en rangée",
    "Équipements de climatisation de précision",
    "Racks et armoires avec confinement d'allées",
    "Câblage réseau structuré (Cat 6a/7/8)",
    "Systèmes de sécurité biométriques",
    "Systèmes de détection et d'extinction d'incendie (VESDA)",
    "Systèmes de contrôle d'accès RFID",
    "Systèmes de gestion de câbles aériens et sous plancher",
    "Équipements KVM over IP",
    "Systèmes de monitoring environnemental IoT",
    "PDU intelligents avec mesure par prise",
    "Systèmes de détection de fuites d'eau",
    "Chemins de câbles suspendus",
    "Planchers surélevés avec circulation d'air optimisée"
  ],
  energy: [
    "Onduleurs (UPS)",
    "Onduleurs (UPS) avec redondance N+1 ou 2N",
    "Batteries de secours",
    "Distributeurs d'énergie",
    "Transformateurs",
    "Systèmes de gestion de l'énergie avancés",
    "Tableaux électriques intelligents",
    "Générateurs avec commutation automatique",
    "Compteurs d'énergie intelligents",
    "Systèmes d'éclairage de secours LED",
    "Systèmes de ventilation et de refroidissement efficaces",
    "Panneaux de distribution électrique redondants",
    "Systèmes de surveillance de la qualité de l'énergie",
    "Systèmes de protection contre la foudre",
    "Systèmes de récupération de chaleur",
    "Systèmes de stockage d'énergie avancés",
    "Systèmes de gestion de l'énergie renouvelable",
    "Systèmes de refroidissement liquide",
    "Systèmes de distribution électrique modulaires"
  ],
  supervision: [
    "Moniteurs de surveillance haute résolution",
    "Postes de travail avec logiciels DCIM et de supervision",
    "Systèmes de communication unifiés",
    "Pupitres de contrôle ergonomiques",
    "Caméras de surveillance IP",
    "Systèmes d'alerte multicanaux",
    "Systèmes de gestion des incidents (ITSM)",
    "Écrans muraux LED grand format",
    "Stations de travail ergonomiques",
    "Consoles de contrôle opérateurs multi-écrans",
    "Systèmes d'affichage pour KPI en temps réel",
    "Systèmes de vidéoconférence HD",
    "Systèmes de sonorisation d'urgence",
    "Tableaux de bord et interfaces graphiques personnalisables",
    "Systèmes d'analyse prédictive et de Machine Learning",
    "Systèmes de gestion des accès et de l'identité (IAM)",
    "Outils de gestion des changements et de la configuration",
    "Systèmes de surveillance environnementale avancés",
    "Outils de conformité RGPD et de sécurité des données",
    "Systèmes de gestion des incidents"
  ]
};

// Définition des fabricants par équipement
const MANUFACTURERS_BY_EQUIPMENT: Record<string, string[]> = {
  // Salle Serveur
  "Serveurs (rack, lame, tour)": ["Dell", "HP", "IBM", "Lenovo", "Huawei"],
  "Onduleurs (UPS)": ["APC", "Eaton", "Vertiv", "Legrand"],
  "Onduleurs (UPS) modulaires avec redondance N+1 ou 2N": ["APC by Schneider Electric", "Eaton", "Vertiv"],
  "Baies de stockage": ["NetApp", "EMC", "IBM", "Hitachi"],
  "Switches réseau redondants": ["Cisco", "Juniper", "Huawei", "Arista"],
  "Routeurs avec redondance": ["Cisco", "Huawei", "Fortinet", "Palo Alto Networks"],
  "Systèmes de refroidissement en rangée": ["Schneider Electric", "Vertiv", "Rittal"],
  "Équipements de climatisation de précision": ["Schneider Electric", "Stulz", "Vertiv"],
  "Racks et armoires avec confinement d'allées": ["APC", "Rittal", "Panduit"],
  "Câblage réseau structuré (Cat 6a/7/8)": ["Commscope", "Panduit", "Belden"],

  // Salle Énergie
  "Batteries de secours": ["Exide", "EnerSys", "C&D Technologies"],
  "Distributeurs d'énergie": ["Schneider Electric", "ABB", "Siemens"],
  "Transformateurs": ["ABB", "Siemens", "Schneider Electric"],
  "Systèmes de gestion de l'énergie avancés": ["Schneider Electric", "ABB", "Siemens"],
  "Tableaux électriques intelligents": ["Schneider Electric", "ABB", "Siemens"],
  "Générateurs avec commutation automatique": ["Cummins", "Caterpillar", "Kohler"],

  // Salle Supervision
  "Moniteurs de surveillance haute résolution": ["Samsung", "LG", "Dell"],
  "Postes de travail avec logiciels DCIM et de supervision": ["IBM", "SolarWinds", "Schneider Electric"],
  "Systèmes de communication unifiés": ["Cisco", "Avaya", "Microsoft"],
  "Pupitres de contrôle ergonomiques": ["Winsted", "Evans", "Knürr"],
  "Caméras de surveillance IP": ["Axis Communications", "Hikvision", "Dahua"]
};

const ClientInformation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [clients, setClients] = useState([{
    name: '',
    phone: '',
    email: ''
  }]);
  const [technicians, setTechnicians] = useState([{
    name: '',
    phone: '',
    email: ''
  }]);
  const [rooms, setRooms] = useState([{
    type: '',
    length: '',
    width: '',
    height: '',
    equipment: [{
      name: '',
      quantity: '',
      manufacturer: ''
    }]
  }]);

  const addClient = () => {
    if (clients.length < 5) {
      setClients([...clients, { name: '', phone: '', email: '' }]);
    }
  };

  const removeClient = (index: number) => {
    const newClients = [...clients];
    newClients.splice(index, 1);
    setClients(newClients);
  };

  const addTechnician = () => {
    if (technicians.length < 5) {
      setTechnicians([...technicians, { name: '', phone: '', email: '' }]);
    }
  };

  const removeTechnician = (index: number) => {
    const newTechnicians = [...technicians];
    newTechnicians.splice(index, 1);
    setTechnicians(newTechnicians);
  };

  const addRoom = () => {
    setRooms([...rooms, {
      type: '',
      length: '',
      width: '',
      height: '',
      equipment: [{
        name: '',
        quantity: '',
        manufacturer: ''
      }]
    }]);
  };

  const addEquipment = (roomIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].equipment.push({
      name: '',
      quantity: '',
      manufacturer: ''
    });
    setRooms(newRooms);
  };

  const removeRoom = (roomIndex: number) => {
    const newRooms = [...rooms];
    newRooms.splice(roomIndex, 1);
    setRooms(newRooms);
  };

  const removeEquipment = (roomIndex: number, equipmentIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].equipment.splice(equipmentIndex, 1);
    setRooms(newRooms);
  };

  const calculateArea = (length: string, width: string) => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    return (l * w).toFixed(2);
  };

  const calculateVolume = (length: string, width: string, height: string) => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    return (l * w * h).toFixed(2);
  };

  // Récupérer les équipements disponibles pour un type de salle
  const getAvailableEquipment = (roomType: string) => {
    switch (roomType) {
      case 'server':
        return EQUIPMENT_BY_ROOM_TYPE.server;
      case 'energy':
        return EQUIPMENT_BY_ROOM_TYPE.energy;
      case 'supervision':
        return EQUIPMENT_BY_ROOM_TYPE.supervision;
      default:
        return [];
    }
  };

  // Récupérer les fabricants disponibles pour un équipement
  const getAvailableManufacturers = (equipmentName: string) => {
    return MANUFACTURERS_BY_EQUIPMENT[equipmentName] || [];
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          Informations Client et Site
        </h1>

        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg mb-6`}>
          <div className="p-6">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Informations Client
            </h2>
            <div className="mb-6">
              <Input
                placeholder="Nom de l'entreprise"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'} mb-4`}
              />
            </div>
            {clients.map((client, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                    Client {index + 1}
                  </h3>
                  {index > 0 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeClient(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nom et prénoms"
                    value={client.name}
                    onChange={(e) => {
                      const newClients = [...clients];
                      newClients[index].name = e.target.value;
                      setClients(newClients);
                    }}
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                  />
                  <Input
                    placeholder="Contact téléphonique"
                    value={client.phone}
                    onChange={(e) => {
                      const newClients = [...clients];
                      newClients[index].phone = e.target.value;
                      setClients(newClients);
                    }}
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                  />
                  <Input
                    placeholder="Adresse email"
                    type="email"
                    value={client.email}
                    onChange={(e) => {
                      const newClients = [...clients];
                      newClients[index].email = e.target.value;
                      setClients(newClients);
                    }}
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                  />
                </div>
              </div>
            ))}
            {clients.length < 5 && (
              <Button
                onClick={addClient}
                className={`mt-4 ${isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'} text-white`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Client
              </Button>
            )}
          </div>
        </Card>

        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg mb-6`}>
          <div className="p-6">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Informations Technicien 3RT
            </h2>

            {technicians.map((tech, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                    Technicien {index + 1}
                  </h3>
                  {index > 0 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeTechnician(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nom et prénoms"
                    value={tech.name}
                    onChange={(e) => {
                      const newTechnicians = [...technicians];
                      newTechnicians[index].name = e.target.value;
                      setTechnicians(newTechnicians);
                    }}
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                  />
                  <Input
                    placeholder="Contact téléphonique"
                    value={tech.phone}
                    onChange={(e) => {
                      const newTechnicians = [...technicians];
                      newTechnicians[index].phone = e.target.value;
                      setTechnicians(newTechnicians);
                    }}
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                  />
                  <Input
                    placeholder="Adresse email"
                    type="email"
                    value={tech.email}
                    onChange={(e) => {
                      const newTechnicians = [...technicians];
                      newTechnicians[index].email = e.target.value;
                      setTechnicians(newTechnicians);
                    }}
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                  />
                </div>
              </div>
            ))}
            {technicians.length < 5 && (
              <Button
                onClick={addTechnician}
                className={`mt-4 ${isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'} text-white`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Technicien
              </Button>
            )}
          </div>
        </Card>

        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg mb-6`}>
          <div className="p-6">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Situation Géographique
            </h2>
            <Input
              placeholder="Adresse du site"
              className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
            />
          </div>
        </Card>

        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg mb-6`}>
          <div className="p-6">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Salles
            </h2>

            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                    Salle {roomIndex + 1}
                  </h3>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeRoom(roomIndex)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    className={`p-2 rounded border ${
                      isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'
                    }`}
                    value={room.type}
                    onChange={(e) => {
                      const newRooms = [...rooms];
                      newRooms[roomIndex].type = e.target.value;
                      setRooms(newRooms);
                    }}
                  >
                    <option value="">Sélectionner le type de salle</option>
                    <option value="server">Salle Serveur</option>
                    <option value="energy">Salle Énergie</option>
                    <option value="supervision">Salle Supervision</option>
                  </select>
                  <Input
                    placeholder="Longueur (m)"
                    type="number"
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                    value={room.length}
                    onChange={(e) => {
                      const newRooms = [...rooms];
                      newRooms[roomIndex].length = e.target.value;
                      setRooms(newRooms);
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Largeur (m)"
                    type="number"
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                    value={room.width}
                    onChange={(e) => {
                      const newRooms = [...rooms];
                      newRooms[roomIndex].width = e.target.value;
                      setRooms(newRooms);
                    }}
                  />
                  <Input
                    placeholder="Hauteur (m)"
                    type="number"
                    className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                    value={room.height}
                    onChange={(e) => {
                      const newRooms = [...rooms];
                      newRooms[roomIndex].height = e.target.value;
                      setRooms(newRooms);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`p-2 rounded bg-gray-100 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                    Surface: {calculateArea(room.length, room.width)} m²
                  </div>
                  <div className={`p-2 rounded bg-gray-100 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                    Volume: {calculateVolume(room.length, room.width, room.height)} m³
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                    Équipements
                  </h4>
                  {room.equipment.map((eq, eqIndex) => (
                    <div key={eqIndex} className="relative">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                          className={`p-2 rounded border ${
                            isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'
                          }`}
                          value={eq.name}
                          onChange={(e) => {
                            const newRooms = [...rooms];
                            newRooms[roomIndex].equipment[eqIndex].name = e.target.value;
                            newRooms[roomIndex].equipment[eqIndex].manufacturer = '';
                            setRooms(newRooms);
                          }}
                        >
                          <option value="">Sélectionner l'équipement</option>
                          {getAvailableEquipment(room.type).map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                        <Input
                          placeholder="Quantité"
                          type="number"
                          value={eq.quantity}
                          onChange={(e) => {
                            const newRooms = [...rooms];
                            newRooms[roomIndex].equipment[eqIndex].quantity = e.target.value;
                            setRooms(newRooms);
                          }}
                          className={`${isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'}`}
                        />
                        <div className="flex gap-2">
                          <select
                            className={`flex-1 p-2 rounded border ${
                              isDarkMode ? 'bg-[#001F33] text-white' : 'bg-white'
                            }`}
                            value={eq.manufacturer}
                            onChange={(e) => {
                              const newRooms = [...rooms];
                              newRooms[roomIndex].equipment[eqIndex].manufacturer = e.target.value;
                              setRooms(newRooms);
                            }}
                          >
                            <option value="">Sélectionner le fabricant</option>
                            {getAvailableManufacturers(eq.name).map((manufacturer) => (
                              <option key={manufacturer} value={manufacturer}>
                                {manufacturer}
                              </option>
                            ))}
                          </select>
                          {room.equipment.length > 1 && (
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeEquipment(roomIndex, eqIndex)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => addEquipment(roomIndex)}
                    className={`mt-2 ${isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'} text-white`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un équipement
                  </Button>
                </div>
              </div>
            ))}

            <Button
              onClick={addRoom}
              className={`mt-4 ${isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'} text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une salle
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ClientInformation;