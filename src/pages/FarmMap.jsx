import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Plus, Trash2, Loader2, MapPin, Leaf, AlertTriangle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTranslation } from '../utils/i18n';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const healthyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const issueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function AddFieldMarker({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

export default function FarmMap() {
  const t = getTranslation;
  const [fields, setFields] = useState(() => {
    const saved = localStorage.getItem('farmbuddy_fields');
    return saved ? JSON.parse(saved) : [];
  });
  const [center, setCenter] = useState([20.5937, 78.9629]); // India center
  const [loading, setLoading] = useState(true);
  const [addingField, setAddingField] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldCrop, setFieldCrop] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      () => setLoading(false),
      { timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('farmbuddy_fields', JSON.stringify(fields));
  }, [fields]);

  const handleMapClick = (latlng) => {
    if (addingField) {
      setPendingLatLng(latlng);
    }
  };

  const confirmField = () => {
    if (!fieldName.trim() || !pendingLatLng) return;
    const newField = {
      id: Date.now(),
      name: fieldName.trim(),
      crop: fieldCrop.trim() || 'Not specified',
      lat: pendingLatLng.lat,
      lng: pendingLatLng.lng,
      status: 'healthy',
      createdAt: new Date().toLocaleDateString(),
    };

    // Check scan history for health status
    const scans = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
    const relatedScan = scans.find(s =>
      s.identity?.toLowerCase().includes(fieldCrop.toLowerCase()) ||
      fieldCrop.toLowerCase().includes(s.identity?.toLowerCase() || '')
    );
    if (relatedScan && relatedScan.severity !== 'Healthy') {
      newField.status = 'issue';
      newField.lastDiagnosis = relatedScan.diagnosis;
    }

    setFields(prev => [...prev, newField]);
    setFieldName('');
    setFieldCrop('');
    setPendingLatLng(null);
    setAddingField(false);
  };

  const deleteField = (id) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const getFieldIcon = (field) => {
    if (field.status === 'issue') return issueIcon;
    if (field.status === 'healthy') return healthyIcon;
    return defaultIcon;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 text-teal animate-spin mb-4" />
      <p className="text-sage font-bold text-sm">{t("Loading map...")}</p>
    </div>
  );

  return (
    <>
      <header className="mb-4 mt-2 flex justify-between items-start">
        <div>
          <h2 className="text-charcoal dark:text-white font-black text-2xl tracking-tighter">{t("Farm Map")}</h2>
          <p className="text-sage font-semibold text-xs mt-1">{fields.length} {t("fields mapped")}</p>
        </div>
        <button
          onClick={() => { setAddingField(!addingField); setPendingLatLng(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
            addingField ? 'bg-coralRed text-white' : 'bg-charcoal text-white'
          }`}
        >
          {addingField ? '✕ Cancel' : <><Plus className="w-4 h-4" /> Add Field</>}
        </button>
      </header>

      {addingField && (
        <div className="bg-teal/10 border border-teal/20 rounded-xl p-3 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal shrink-0" />
          <p className="text-teal text-xs font-bold">Tap on the map to place your field marker</p>
        </div>
      )}

      {/* Map */}
      <div className="rounded-[20px] overflow-hidden border border-sage/20 dark:border-white/10 shadow-xl mb-4" style={{ height: '45vh' }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {addingField && <AddFieldMarker onAdd={handleMapClick} />}
          {fields.map(field => (
            <Marker key={field.id} position={[field.lat, field.lng]} icon={getFieldIcon(field)}>
              <Popup>
                <div className="text-center min-w-[120px]">
                  <p className="font-black text-sm text-charcoal">{field.name}</p>
                  <p className="text-sage text-[10px] font-bold uppercase">{field.crop}</p>
                  {field.lastDiagnosis && (
                    <p className="text-coralRed text-[10px] font-bold mt-1">⚠️ {field.lastDiagnosis}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          {pendingLatLng && (
            <Marker position={[pendingLatLng.lat, pendingLatLng.lng]} icon={defaultIcon}>
              <Popup>New field location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Add Field Form */}
      {pendingLatLng && (
        <div className="bg-white dark:bg-charcoal/80 rounded-[20px] p-5 border border-sage/10 dark:border-white/10 shadow-sm mb-4 animate-in slide-in-from-bottom">
          <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-3">New Field Details</p>
          <div className="flex gap-2 mb-3">
            <input value={fieldName} onChange={e => setFieldName(e.target.value)} placeholder="Field name (e.g. Field A)" className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
            <input value={fieldCrop} onChange={e => setFieldCrop(e.target.value)} placeholder="Crop type" className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
          </div>
          <button onClick={confirmField} disabled={!fieldName.trim()} className="w-full h-10 bg-teal rounded-xl text-white text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-40">
            Save Field
          </button>
        </div>
      )}

      {/* Field List */}
      <h3 className="text-charcoal dark:text-white font-extrabold text-xs uppercase tracking-wider mb-3">{t("Your Fields")}</h3>
      <div className="space-y-2 pb-28">
        {fields.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <MapPin className="w-8 h-8 text-sage mx-auto mb-2" />
            <p className="text-sage font-bold text-sm">No fields mapped yet</p>
            <p className="text-sage text-xs">Tap "Add Field" and click on the map to start</p>
          </div>
        ) : (
          fields.map(field => (
            <div key={field.id} className="bg-white dark:bg-charcoal/60 p-3 rounded-[16px] flex items-center justify-between border border-sage/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${field.status === 'issue' ? 'bg-coralRed/10 text-coralRed' : 'bg-teal/10 text-teal'}`}>
                  {field.status === 'issue' ? <AlertTriangle className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-charcoal dark:text-white font-bold text-sm truncate">{field.name}</p>
                  <p className="text-sage text-[9px] font-bold uppercase tracking-tight">{field.crop} • {field.createdAt}</p>
                </div>
              </div>
              <button onClick={() => deleteField(field.id)} className="text-coralRed p-2 rounded-lg hover:bg-coralRed/10 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
