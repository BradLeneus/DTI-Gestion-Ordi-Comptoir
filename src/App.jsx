import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Edit2, Monitor, CheckCircle, XCircle, Search, Filter, Loader2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- CONFIGURATION SUPABASE ---
const VITE_SUPABASE_URL = 'https://ymyiqedxygahvubwrotw.supabase.co';
const VITE_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteWlxZWR4eWdhaHZ1Yndyb3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDQ5MTQsImV4cCI6MjA4Nzc4MDkxNH0.1jzp1VNZI6_L9BBKlHOih9UIE0xP767reLFdMmU7K4w';
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

const LISTE_LOCAUX_DEPARTEMENTS = [
  "A004 Dir. affaires étudiantes", "A005 Aide financière", "A006 Placement étudiant",
  "B001 Animation socioculturelle", "B103 Organisation scolaire", "B200 Lettres",
  "B205 Philosophie", "B215 Dév. pédagogique", "BE101 Services entreprises",
  "BE200 Bélanger", "C030 Reprographie", "C107 Cheminement scolaire",
  "C208 Approvisionnement", "C209 Finances", "C216 Dir. technologies info (TI)",
  "C224 Ressources matérielles", "CH100 Arts visuels", "CH124 Physiothérapie",
  "CH200 Graphisme", "CH224 Design d'intérieur", "CH228 Matériauthèque",
  "CS200 Éducation physique", "D104 Sécurité", "D200 Direction générale",
  "D202 Direction des études", "D203 Ressources humaines", "D299 Communications & promo",
  "DU100 Dir. formation continue", "DU200 RAC", "DU300 Formation Nunavik",
  "DU399 Chaire UNESCO", "E200 Science de la nature", "E300 Langues",
  "F000 Éducation spécialisée", "F100 Éducation à l'enfance", "F200 Travail social", "FC000 Formation continue",
  "G015 Audiovisuel", "G130 Bibliothèque", "H100 Musique", "N100 Namur / Centre interculturel",
  "L100",
  "N101 Namur (clavier anglais)", "N125 MIFI", "R000 Sciences sociales",
  "R100 Psychologie", "S000 Informatique", "S135 École de mode",
  "T006 Bureau international", "T106 Commercialisation de la mode",
  "T200 Design de la mode", "T300 Production de la mode",
  "1 Don",
  "0 Inconnu",
  "PRO",
].sort();

export default function App() {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLoc, setFilterLoc] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [inputNom, setInputNom] = useState('');
  const [inputDepSearch, setInputDepSearch] = useState('');
  const [isFonctionnel, setIsFonctionnel] = useState(true);
  const [isBonDomaine, setIsBonDomaine] = useState(true);
  const [isOkWifi, setIsOkWifi] = useState(true);
  const [isBatteryOk, setIsBatteryOk] = useState(true);
  const [isAutre, setIsAutre] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchComputers();
  }, []);

  async function fetchComputers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('ordinateurs')
      .select('*')
      .order('nom', { ascending: true });
    if (error) alert("Erreur de chargement : " + error.message);
    else setComputers(data || []);
    setLoading(false);
  }

  const handleSave = async () => {
    if (!inputNom.trim() || !inputDepSearch.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    const payload = { nom: inputNom, local: inputDepSearch, fonctionnel: isFonctionnel, domaine: isBonDomaine, wifi: isOkWifi, battery: isBatteryOk, autre: isAutre };
    if (editingId) {
      const { error } = await supabase.from('ordinateurs').update(payload).eq('id', editingId);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('ordinateurs').insert([payload]);
      if (error) alert(error.message);
    }
    fetchComputers();
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer définitivement cet appareil ?")) {
      const { error } = await supabase.from('ordinateurs').delete().eq('id', id);
      if (!error) fetchComputers();
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const { error } = await supabase.from('ordinateurs').update({ fonctionnel: !currentStatus }).eq('id', id);
    if (!error) fetchComputers();
  };

  const toggleDomaine = async (id, currentDomaine) => {
    const { error } = await supabase.from('ordinateurs').update({ domaine: !currentDomaine }).eq('id', id);
    if (!error) fetchComputers();
  };

  const toggleWifi = async (id, currentWifi) => {
    const { error } = await supabase.from('ordinateurs').update({ wifi: !currentWifi }).eq('id', id);
    if (!error) fetchComputers();
  };

  const toggleBattery = async (id, currentBattery) => {
    const { error } = await supabase.from('ordinateurs').update({ battery: !currentBattery }).eq('id', id);
    if (!error) fetchComputers();
  };

  const toggleAutre = async (id, currentAutre) => {
    const { error } = await supabase.from('ordinateurs').update({ autre: !currentAutre }).eq('id', id);
    if (!error) fetchComputers();
  };

  const handleDepInputChange = (e) => {
    const value = e.target.value;
    setInputDepSearch(value);
    if (value.length > 0) {
      const filtered = LISTE_LOCAUX_DEPARTEMENTS.filter(dep => dep.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const openModal = (computer = null) => {
    if (computer) {
      setInputNom(computer.nom);
      setInputDepSearch(computer.local);
      setIsFonctionnel(computer.fonctionnel);
      setIsBonDomaine(computer.domaine);
      setIsOkWifi(computer.wifi);
      setIsBatteryOk(computer.battery);
      setIsAutre(computer.autre);
      setEditingId(computer.id);
    } else {
      setInputNom('');
      setInputDepSearch('');
      setIsFonctionnel(true);
      setIsBonDomaine(true);
      setIsOkWifi(true);
      setIsBatteryOk(true);
      setIsAutre(false);
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setShowSuggestions(false); };

  const filteredData = computers.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLoc = filterLoc === "Tous" || c.local === filterLoc;
    return matchSearch && matchLoc;
  });

  const totalResults = filteredData.length;
  const fonctionnelCount = filteredData.filter(c => c.fonctionnel).length;
  const domaineCount = filteredData.filter(c => c.domaine).length;
  const wifiCount = filteredData.filter(c => c.wifi).length;
  const batteryCount = filteredData.filter(c => c.battery).length;
  const autreCount = filteredData.filter(c => c.autre).length;

  return (
    <div className="vw-100 min-vh-100 d-flex flex-column m-0 p-0 overflow-x-hidden" style={{ backgroundColor: '#154b34', color: '#98f19d' }}>
      
      {/* NAVBAR - Full Width */}
      <nav className="navbar navbar-dark shadow-sm px-4 py-3 w-100" style={{ backgroundColor: '#154b34', color: '#98f19d' }}>
        <div className="container-fluid p-0">
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2 m-0" style={{ color: '#98f19d' }}>
            <Monitor size={28} />
            <span>Gestion Inventaire </span>
          </span>
          <button className="btn btn-light fw-bold shadow-sm" onClick={() => openModal()} style={{ color: '#98f19d', borderColor: '#98f19d', backgroundColor: '#113c2d' }}>
            <Plus size={20} className="me-1" /> <span className="d-none d-sm-inline">Ajouter un appareil</span>
          </button>
        </div>
      </nav>

      {/* CONTENU PRINCIPAL - container-fluid fills width */}
      <div className="container-fluid flex-grow-1 p-3 p-md-4" style={{ backgroundColor: '#154b34', color: '#98f19d' }}>
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden w-100" style={{ backgroundColor: '#154b34', color: '#98f19d' }}>
                  <div className="card-body p-0 theme-dark">
            {/* FILTRES */}
            <div className="row g-3 p-3 border-bottom m-0 sticky-top shadow-sm w-100" style={{ backgroundColor: '#154b34', color: '#98f19d' }}>
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text" style={{ backgroundColor: '#113c2d', borderRight: '0', color: '#98f19d' }}><Search size={18} /></span>
                  <input type="text" className="form-control border-start-0 shadow-none" style={{ backgroundColor: '#113c2d', color: '#ffffff', borderLeft: '0' }} placeholder="Rechercher par ID ou nom..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text" style={{ backgroundColor: '#113c2d', borderRight: '0', color: '#98f19d' }}><Filter size={18} /></span>
                  <select className="form-select border-start-0 shadow-none" style={{ backgroundColor: '#113c2d', color: '#ffffff', borderLeft: '0' }} value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)}>
                    <option value="Tous">Tous les départements</option>
                    {LISTE_LOCAUX_DEPARTEMENTS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* TABLEAU */}
            <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 220px)', minHeight: '400px' }}>
              {loading ? (
                <div className="text-center py-5 mt-5">
                  <Loader2 className="animate-spin" size={48} style={{ color: '#98f19d' }} />
                  <p className="mt-2" style={{ color: '#98f19d' }}>Synchronisation...</p>
                </div>
              ) : (
                <table className="table table-hover align-middle mb-0 w-100 theme-dark">
                  <thead className="sticky-top theme-dark">
                    <tr>
                      <th className="ps-4 py-3">ID Appareil ({totalResults})</th>
                      <th className="py-3">Local / Département</th>
                      <th className="py-3 text-center">État ({fonctionnelCount})</th>
                      <th className="py-3 text-center">Domaine ({domaineCount})</th>
                      <th className="py-3 text-center">Wifi ({wifiCount})</th>
                      <th className="py-3 text-center">Batterie ({batteryCount})</th>
                      <th className="py-3 text-center">Autre ({autreCount})</th>
                      <th className="pe-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#113c2d', color: '#98f19d' }}>
                    {filteredData.length > 0 ? filteredData.map(c => (
                      <tr key={c.id} style={{ backgroundColor: '#154b34', color: '#98f19d' }}>
                        <td className="ps-4 fw-bold" style={{ color: '#98f19d' }}>{c.nom}</td>
                        <td><span className="badge bg-dark text-light border px-2 py-1">{c.local}</span></td>
                        <td className="text-center">
                          <div className="form-check form-switch d-inline-block">
                            <input className="form-check-input ms-0" type="checkbox" style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} checked={c.fonctionnel} onChange={() => toggleStatus(c.id, c.fonctionnel)} />
                            <div className={`fw-bold small mt-4`} style={{ color: c.fonctionnel ? '#98f19d' : '#f03e3e' }}>{c.fonctionnel ? 'S\'ALLUME' : 'PANNE'}</div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="form-check form-switch d-inline-block">
                            <input className="form-check-input ms-0" type="checkbox" style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} checked={c.domaine} onChange={() => toggleDomaine(c.id, c.domaine)} />
                            <div className={`fw-bold small mt-1`} style={{ color: c.domaine ? '#98f19d' : '#f03e3e' }}>{c.domaine ? 'BON' : 'NON'}</div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="form-check form-switch d-inline-block">
                            <input className="form-check-input ms-0" type="checkbox" style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} checked={c.wifi} onChange={() => toggleWifi(c.id, c.wifi)} />
                            <div className={`fw-bold small mt-1`} style={{ color: c.wifi ? '#98f19d' : '#f03e3e' }}>{c.wifi ? 'OK' : 'NON'}</div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="form-check form-switch d-inline-block">
                            <input className="form-check-input ms-0" type="checkbox" style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} checked={c.battery} onChange={() => toggleBattery(c.id, c.battery)} />
                            <div className={`fw-bold small mt-1`} style={{ color: c.battery ? '#98f19d' : '#f03e3e' }}>{c.battery ? 'OK' : 'NON'}</div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="form-check form-switch d-inline-block">
                            <input className="form-check-input ms-0" type="checkbox" style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} checked={c.autre} onChange={() => toggleAutre(c.id, c.autre)} />
                            <div className={`fw-bold small mt-1`} style={{ color: c.autre ? '#98f19d' : '#f03e3e' }}>{c.autre ? 'OUI' : 'NON'}</div>
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <button className="btn btn-outline-primary btn-sm rounded-3 me-2" onClick={() => openModal(c)}><Edit2 size={16} /></button>
                          <button className="btn btn-outline-danger btn-sm rounded-3" onClick={() => handleDelete(c.id)}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="text-center py-5" style={{ color: '#98f19d' }}>Aucun résultat trouvé.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: '#154b34', color: '#98f19d' }}>
              <div className="modal-header" style={{ backgroundColor: '#154b34', color: '#98f19d', border: '0', padding: '1rem 1rem 0.75rem' }}>
                <h5 className="modal-title fw-bold">{editingId ? ' Modifier' : ' Nouveau'} Appareil</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <div className="modal-body p-4" style={{ backgroundColor: '#113c2d', color: '#98f19d' }}>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold" style={{ color: '#98f19d' }}>Nom / Code du Laptop</label>
                    <input type="text" className="form-control form-control-lg" style={{ backgroundColor: '#113c2d', color: '#98f19d', border: '1px solid #2c5f4e' }} placeholder="Ex: B200-PC-01" value={inputNom} onChange={(e) => setInputNom(e.target.value)} />
                  </div>
                  <div className="col-12 col-md-6 position-relative">
                    <label className="form-label fw-bold" style={{ color: '#98f19d' }}>Département (Recherche)</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#113c2d', color: '#98f19d' }}><Search size={18} /></span>
                      <input type="text" className="form-control form-control-lg" style={{ backgroundColor: '#113c2d', color: '#98f19d', border: '1px solid #2c5f4e' }} placeholder="Chercher un local..." value={inputDepSearch} onChange={handleDepInputChange} />
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 shadow-lg z-3 mt-1" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#113c2d', color: '#98f19d' }}>
                        {suggestions.map((s, i) => (
                          <li key={i} className="list-group-item list-group-item-action" onClick={() => { setInputDepSearch(s); setShowSuggestions(false); }} style={{ cursor: 'pointer', backgroundColor: '#154b34', color: '#98f19d' }}>
                            <span className="fw-bold" style={{ color: '#98f19d' }}>{s.split(' ')[0]}</span> {s.split(' ').slice(1).join(' ')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-2 border-dashed">
                      <div><p className="mb-0 fw-bold">État de marche</p><small className="text-muted">Prêt à l'emploi</small></div>
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" style={{ width: '3.5rem', height: '1.75rem' }} checked={isFonctionnel} onChange={(e) => setIsFonctionnel(e.target.checked)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-2 border-dashed">
                      <div><p className="mb-0 fw-bold">État du domaine</p><small className="text-muted">Domaine configuré</small></div>
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" style={{ width: '3.5rem', height: '1.75rem' }} checked={isBonDomaine} onChange={(e) => setIsBonDomaine(e.target.checked)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-2 border-dashed">
                      <div><p className="mb-0 fw-bold">État du wifi</p><small className="text-muted">Wifi accessible</small></div>
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" style={{ width: '3.5rem', height: '1.75rem' }} checked={isOkWifi} onChange={(e) => setIsOkWifi(e.target.checked)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-2 border-dashed">
                      <div><p className="mb-0 fw-bold">État de la batterie</p><small className="text-muted">Batterie en bonne condition</small></div>
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" style={{ width: '3.5rem', height: '1.75rem' }} checked={isBatteryOk} onChange={(e) => setIsBatteryOk(e.target.checked)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-2 border-dashed">
                      <div><p className="mb-0 fw-bold">Autre problème</p></div>
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" style={{ width: '3.5rem', height: '1.75rem' }} checked={isAutre} onChange={(e) => setIsAutre(e.target.checked)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4">
                <button className="btn btn-light btn-lg px-4 me-auto" onClick={closeModal}>Annuler</button>
                <button className="btn btn-primary btn-lg px-5 fw-bold" onClick={handleSave}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}