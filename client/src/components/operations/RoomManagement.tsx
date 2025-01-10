import React, { useState } from 'react';
import { 
  Card, 
  CardHeader,
  CardTitle,
  CardContent 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Calculator, MessageSquarePlus } from 'lucide-react';

// Données des équipements par type de salle
const roomEquipment = {
  'Salle Serveur': {
    equipment: [
      { name: 'Serveurs (rack, lame, tour)', manufacturers: ['Dell', 'HP', 'IBM', 'Lenovo', 'Huawei'] },
      { name: 'Onduleurs (UPS)', manufacturers: ['APC', 'Eaton', 'Vertiv', 'Legrand'] },
      { name: 'Onduleurs (UPS) modulaires avec redondance N+1 ou 2N', manufacturers: ['APC by Schneider Electric', 'Eaton', 'Vertiv'] },
      { name: 'Baies de stockage', manufacturers: ['NetApp', 'EMC', 'IBM', 'Hitachi'] },
      { name: 'Switches réseau redondants', manufacturers: ['Cisco', 'Juniper', 'Huawei', 'Arista'] },
      { name: 'Routeurs avec redondance', manufacturers: ['Cisco', 'Huawei', 'Fortinet', 'Palo Alto Networks'] },
      { name: 'Systèmes de refroidissement en rangée', manufacturers: ['Schneider Electric', 'Vertiv', 'Rittal'] },
      { name: 'Équipements de climatisation de précision', manufacturers: ['Schneider Electric', 'Stulz', 'Vertiv'] },
      { name: 'Racks et armoires avec confinement allées', manufacturers: ['APC', 'Rittal', 'Panduit'] },
      { name: 'Câblage réseau structuré (Cat 6a/7/8)', manufacturers: ['Commscope', 'Panduit', 'Belden'] },
      { name: 'Systèmes de sécurité biométriques', manufacturers: ['HID Global', 'Suprema', 'ZKTeco'] },
      { name: 'Systèmes de détection et extinction incendie (VESDA)', manufacturers: ['Xtralis', 'Siemens', 'Honeywell'] },
      { name: 'Systèmes de contrôle accès RFID', manufacturers: ['HID Global', 'Honeywell', 'Lenel'] },
      { name: 'Systèmes de gestion de câbles', manufacturers: ['Panduit', 'Legrand', 'HellermannTyton'] },
      { name: 'Équipements KVM over IP', manufacturers: ['Raritan', 'Vertiv', 'Aten'] },
      { name: 'Systèmes de monitoring IoT', manufacturers: ['APC', 'Vertiv', 'Raritan'] },
      { name: 'PDU intelligents avec mesure par prise', manufacturers: ['APC', 'Raritan', 'Vertiv'] },
      { name: 'Systèmes de détection de fuites', manufacturers: ['APC', 'Vertiv', 'RLE Technologies'] },
      { name: 'Chemins de câbles suspendus', manufacturers: ['Legrand', 'Panduit', 'Snake Tray'] },
      { name: 'Planchers surélevés ventilés', manufacturers: ['Tate', 'Kingspan', 'ASM'] }
    ],
  },
  'Salle Énergie': {
    equipment: [
      { name: 'Onduleurs (UPS)', manufacturers: ['APC by Schneider Electric', 'Eaton', 'Vertiv'] },
      { name: 'Onduleurs redondants N+1 ou 2N', manufacturers: ['APC by Schneider Electric', 'Eaton', 'Vertiv'] },
      { name: 'Batteries de secours', manufacturers: ['Exide', 'EnerSys', 'C&D Technologies'] },
      { name: 'Distributeurs énergie', manufacturers: ['Schneider Electric', 'ABB', 'Siemens'] },
      { name: 'Transformateurs', manufacturers: ['ABB', 'Siemens', 'Schneider Electric'] },
      { name: 'Systèmes de gestion énergie', manufacturers: ['Schneider Electric', 'ABB', 'Siemens'] },
      { name: 'Tableaux électriques intelligents', manufacturers: ['Schneider Electric', 'ABB', 'Siemens'] },
      { name: 'Générateurs automatiques', manufacturers: ['Cummins', 'Caterpillar', 'Kohler'] },
      { name: 'Compteurs énergie intelligents', manufacturers: ['Schneider Electric', 'ABB', 'Siemens'] },
      { name: 'Éclairage secours LED', manufacturers: ['Philips', 'Eaton', 'Acuity Brands'] },
      { name: 'Systèmes ventilation', manufacturers: ['Carrier', 'Trane', 'Johnson Controls'] },
      { name: 'Panneaux distribution redondants', manufacturers: ['Schneider Electric', 'ABB', 'Eaton'] },
      { name: 'Surveillance qualité énergie', manufacturers: ['Fluke', 'Schneider Electric', 'Eaton'] },
      { name: 'Protection foudre', manufacturers: ['DEHN', 'Schneider Electric', 'ABB'] },
      { name: 'Récupération chaleur', manufacturers: ['Schneider Electric', 'ABB', 'Siemens'] },
      { name: 'Stockage énergie avancé', manufacturers: ['Tesla', 'ABB', 'Schneider Electric'] },
      { name: 'Gestion énergie renouvelable', manufacturers: ['ABB', 'Schneider Electric', 'Siemens'] },
      { name: 'Refroidissement liquide', manufacturers: ['Vertiv', 'Schneider Electric', 'Asetek'] },
      { name: 'Distribution électrique modulaire', manufacturers: ['Schneider Electric', 'ABB', 'Eaton'] }
    ],
  },
  'Salle Supervision': {
    equipment: [
      { name: 'Moniteurs haute résolution', manufacturers: ['Samsung', 'LG', 'Dell'] },
      { name: 'Postes DCIM et supervision', manufacturers: ['IBM', 'SolarWinds', 'Schneider Electric'] },
      { name: 'Communication unifiée', manufacturers: ['Cisco', 'Avaya', 'Microsoft'] },
      { name: 'Pupitres ergonomiques', manufacturers: ['Winsted', 'Evans', 'Knürr'] },
      { name: 'Caméras IP', manufacturers: ['Axis Communications', 'Hikvision', 'Dahua'] },
      { name: 'Systèmes alerte multicanaux', manufacturers: ['Everbridge', 'Alertus', 'Singlewire'] },
      { name: 'Gestion incidents ITSM', manufacturers: ['ServiceNow', 'BMC', 'Atlassian'] },
      { name: 'Écrans LED grand format', manufacturers: ['Samsung', 'LG', 'NEC'] },
      { name: 'Stations ergonomiques', manufacturers: ['Herman Miller', 'Steelcase', 'Knoll'] },
      { name: 'Consoles multi-écrans', manufacturers: ['Winsted', 'Evans', 'Knürr'] },
      { name: 'Affichage KPI temps réel', manufacturers: ['Splunk', 'Datadog', 'Grafana'] },
      { name: 'Vidéoconférence HD', manufacturers: ['Cisco', 'Zoom', 'Poly'] },
      { name: 'Sonorisation urgence', manufacturers: ['Bosch', 'TOA', 'Biamp'] },
      { name: 'Tableaux de bord', manufacturers: ['Tableau', 'Power BI', 'Qlik'] },
      { name: 'Analyse prédictive ML', manufacturers: ['IBM Watson', 'SAS', 'Splunk'] },
      { name: 'Gestion IAM', manufacturers: ['Okta', 'Microsoft', 'IBM'] },
      { name: 'Gestion changements', manufacturers: ['ServiceNow', 'BMC', 'Atlassian'] },
      { name: 'Surveillance environnementale', manufacturers: ['APC', 'Vertiv', 'Raritan'] },
      { name: 'Conformité RGPD', manufacturers: ['OneTrust', 'IBM', 'SAP'] },
      { name: 'Gestion incidents', manufacturers: ['ServiceNow', 'BMC', 'Atlassian'] }
    ],
  },
};

interface Equipment {
  name: string;
  quantity: number;
  manufacturer: string;
}

interface Room {
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  surface: number;
  volume: number;
  equipment: Equipment[];
  comments?: string;
}

interface RoomList {
  [key: string]: Room[];
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<RoomList>({
    'Salle Serveur': [],
    'Salle Énergie': [],
    'Salle Supervision': [],
  });

  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [comments, setComments] = useState<{[key: string]: string}>({});

  const calculateDimensions = (length: number, width: number, height: number) => {
    const surface = length * width;
    const volume = surface * height;
    return { surface, volume };
  };

  const addRoom = (roomType: string) => {
    if (rooms[roomType].length < 5) {
      const newRoom: Room = {
        dimensions: { length: '', width: '', height: '' },
        surface: 0,
        volume: 0,
        equipment: [],
        comments: ''
      };
      setRooms({
        ...rooms,
        [roomType]: [...rooms[roomType], newRoom]
      });
    }
  };

  const updateRoomDimensions = (roomType: string, roomIndex: number, field: string, value: string) => {
    const updatedRooms = { ...rooms };
    const room = updatedRooms[roomType][roomIndex];
    room.dimensions[field as keyof typeof room.dimensions] = value;

    if (room.dimensions.length && room.dimensions.width && room.dimensions.height) {
      const { surface, volume } = calculateDimensions(
        parseFloat(room.dimensions.length),
        parseFloat(room.dimensions.width),
        parseFloat(room.dimensions.height)
      );
      room.surface = surface;
      room.volume = volume;
    }

    setRooms(updatedRooms);
  };

  const addEquipment = (roomType: string, roomIndex: number) => {
    const updatedRooms = { ...rooms };
    updatedRooms[roomType][roomIndex].equipment.push({
      name: '',
      quantity: 1,
      manufacturer: ''
    });
    setRooms(updatedRooms);
  };

  const updateEquipment = (roomType: string, roomIndex: number, equipIndex: number, field: keyof Equipment, value: string | number) => {
    const updatedRooms = { ...rooms };
    const equipment = updatedRooms[roomType][roomIndex].equipment[equipIndex];

    if (field === 'quantity' && typeof value === 'number') {
      equipment[field] = value;
    } else if (typeof value === 'string' && field !== 'quantity') {
      equipment[field] = value;
    }

    setRooms(updatedRooms);
  };

  const removeEquipment = (roomType: string, roomIndex: number, equipIndex: number) => {
    const updatedRooms = { ...rooms };
    updatedRooms[roomType][roomIndex].equipment.splice(equipIndex, 1);
    setRooms(updatedRooms);
  };

  const removeRoom = (roomType: string, roomIndex: number) => {
    const updatedRooms = { ...rooms };
    updatedRooms[roomType].splice(roomIndex, 1);
    setRooms(updatedRooms);
  };

  return (
    <div className="space-y-6">
      {Object.entries(rooms).map(([roomType, roomList]) => (
        <Card key={roomType} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{roomType}</CardTitle>
              {roomList.length < 5 && (
                <Button onClick={() => addRoom(roomType)} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Ajouter {roomType}</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {roomList.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Aucune salle ajoutée. Cliquez sur "Ajouter {roomType}" pour commencer.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {roomList.map((room, roomIndex) => (
                  <div key={roomIndex} className="p-4 border rounded-lg space-y-4">
                    {/* Dimensions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        type="number"
                        placeholder="Longueur (m)"
                        value={room.dimensions.length}
                        onChange={(e) => updateRoomDimensions(roomType, roomIndex, 'length', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Largeur (m)"
                        value={room.dimensions.width}
                        onChange={(e) => updateRoomDimensions(roomType, roomIndex, 'width', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Hauteur (m)"
                        value={room.dimensions.height}
                        onChange={(e) => updateRoomDimensions(roomType, roomIndex, 'height', e.target.value)}
                      />
                      <div className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-gray-500" />
                        <span>Surface: {room.surface}m² | Volume: {room.volume}m³</span>
                      </div>
                    </div>

                    {/* Section Équipements */}
                    <div className="space-y-4">
                      {/* En-tête avec boutons */}
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Équipements</h3>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              const roomKey = `${roomType}-${roomIndex}`;
                              setShowComments(prev => ({
                                ...prev,
                                [roomKey]: !prev[roomKey]
                              }));
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <MessageSquarePlus className="h-4 w-4 mr-2" />
                            <span>+ Ajouter un Commentaire</span>
                          </Button>
                          <Button 
                            onClick={() => addEquipment(roomType, roomIndex)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            <span>Ajouter un équipement</span>
                          </Button>
                        </div>
                      </div>

                      {/* Zone de commentaires */}
                      {showComments[`${roomType}-${roomIndex}`] && (
                        <div className="space-y-2 p-4 bg-gray-50 rounded-md border">
                          <textarea
                            className="w-full min-h-[100px] p-2 border rounded-md bg-white"
                            placeholder="Ajoutez vos commentaires sur les équipements ici..."
                            value={comments[`${roomType}-${roomIndex}`] || ''}
                            onChange={(e) => setComments(prev => ({
                              ...prev,
                              [`${roomType}-${roomIndex}`]: e.target.value
                            }))}
                          />
                          <p className="text-sm text-gray-500 italic">
                            Les commentaires sont sauvegardés automatiquement
                          </p>
                        </div>
                      )}

                      {/* Liste des équipements */}
                      {room.equipment.map((equip, equipIndex) => (
                        <div key={equipIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <Select
                            value={equip.name}
                            onValueChange={(value) => updateEquipment(roomType, roomIndex, equipIndex, 'name', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner équipement" />
                            </SelectTrigger>
                            <SelectContent>
                              {roomEquipment[roomType as keyof typeof roomEquipment].equipment.map((item) => (
                                <SelectItem key={item.name} value={item.name}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Quantité"
                            value={equip.quantity}
                            onChange={(e) => updateEquipment(roomType, roomIndex, equipIndex, 'quantity', parseInt(e.target.value, 10))}
                          />
                          <div className="flex items-center gap-4">
                            <Select
                              value={equip.manufacturer}
                              onValueChange={(value) => updateEquipment(roomType, roomIndex, equipIndex, 'manufacturer', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner fabricant" />
                              </SelectTrigger>
                              <SelectContent>
                                {equip.name && roomEquipment[roomType as keyof typeof roomEquipment].equipment
                                  .find(item => item.name === equip.name)
                                  ?.manufacturers.map((manufacturer) => (
                                    <SelectItem key={manufacturer} value={manufacturer}>
                                      {manufacturer}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeEquipment(roomType, roomIndex, equipIndex)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bouton suppression salle */}
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => removeRoom(roomType, roomIndex)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer la salle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoomManagement;