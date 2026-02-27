import React, { useState, useEffect } from 'react';

import { createClient } from '@supabase/supabase-js';

import { Plus, Trash2, Edit2, Monitor, CheckCircle, XCircle, Search, Filter, Loader2 } from 'lucide-react';

import 'bootstrap/dist/css/bootstrap.min.css';
 
// --- CONFIGURATION SUPABASE ---

// Remplace ces valeurs par tes clés réelles (Project Settings > API)

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

  "F000 Éducation spécialisée", "F100 Éducation à l'enfance", "F200 Travail social", 

  "G015 Audiovisuel", "G130 Bibliothèque", "H100 Musique", "N100 Namur / Centre interculturel", 

  "N101 Namur (clavier anglais)", "N125 MIFI", "R000 Sciences sociales", 

  "R100 Psychologie", "S000 Informatique", "S135 École de mode", 

  "T006 Bureau international", "T106 Commercialisation de la mode", 

  "T200 Design de la mode", "T300 Production de la mode"

].sort();
 
export default function App() {

  // --- ÉTATS ---

  const [computers, setComputers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterLoc, setFilterLoc] = useState("Tous");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
 
  // États du formulaire

  const [inputNom, setInputNom] = useState('');

  const [inputDepSearch, setInputDepSearch] = useState('');

  const [isFonctionnel, setIsFonctionnel] = useState(true);

  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
 
  // --- APPELS BASE DE DONNÉES ---

  useEffect(() => {

    fetchComputers();

  }, []);
 
  async function fetchComputers() {

    setLoading(true);

    const { data, error } = await supabase

      .from('ordinateurs')

      .select('*')

      .order('created_at', { ascending: false });

    if (error) alert("Erreur de chargement : " + error.message);

    else setComputers(data || []);

    setLoading(false);

  }
 
  const handleSave = async () => {

    if (!inputNom.trim() || !inputDepSearch.trim()) {

      alert("Veuillez remplir tous les champs.");

      return;

    }
 
    const payload = { nom: inputNom, local: inputDepSearch, fonctionnel: isFonctionnel };
 
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

    const { error } = await supabase

      .from('ordinateurs')

      .update({ fonctionnel: !currentStatus })

      .eq('id', id);

    if (!error) fetchComputers();

  };
 
  // --- LOGIQUE UI ---

  const handleDepInputChange = (e) => {

    const value = e.target.value;

    setInputDepSearch(value);

    if (value.length > 0) {

      const filtered = LISTE_LOCAUX_DEPARTEMENTS.filter(dep => 

        dep.toLowerCase().includes(value.toLowerCase())

      );

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

      setEditingId(computer.id);

    } else {

      setInputNom('');

      setInputDepSearch('');

      setIsFonctionnel(true);

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
 
  return (
<div className="min-vh-100 bg-light d-flex flex-column">

      {/* NAVBAR */}
<nav className="navbar navbar-dark bg-primary shadow-sm px-3 py-3">
<div className="container-fluid">
<span className="navbar-brand fw-bold d-flex align-items-center gap-2 m-0">
<Monitor size={28} /> 
<span>Gestion Inventaire <span className="d-none d-md-inline">Connectée</span></span>
</span>
<button className="btn btn-light fw-bold shadow-sm" onClick={() => openModal()}>
<Plus size={20} className="me-1" /> <span className="d-none d-sm-inline">Ajouter un appareil</span>
</button>
</div>
</nav>
 
      {/* CONTENU PRINCIPAL */}
<div className="container-fluid flex-grow-1 p-3 p-md-4">
<div className="card border-0 shadow-sm rounded-4 overflow-hidden">
<div className="card-body p-0">

            {/* FILTRES */}
<div className="row g-3 p-3 border-bottom m-0 bg-white sticky-top shadow-sm">
<div className="col-12 col-md-6">
<div className="input-group">
<span className="input-group-text bg-light border-end-0"><Search size={18} /></span>
<input type="text" className="form-control border-start-0 shadow-none" placeholder="Rechercher par ID ou nom..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
</div>
</div>
<div className="col-12 col-md-6">
<div className="input-group">
<span className="input-group-text bg-light border-end-0"><Filter size={18} /></span>
<select className="form-select border-start-0 shadow-none" value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)}>
<option value="Tous">Tous les départements</option>

                    {LISTE_LOCAUX_DEPARTEMENTS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
</select>
</div>
</div>
</div>
 
            {/* TABLEAU */}
<div className="table-responsive" style={{maxHeight: 'calc(100vh - 250px)', minHeight: '400px'}}>

              {loading ? (
<div className="text-center py-5 mt-5">
<Loader2 className="animate-spin text-primary" size={48} />
<p className="mt-2 text-muted">Synchronisation avec la base de données...</p>
</div>

              ) : (
<table className="table table-hover align-middle mb-0">
<thead className="table-dark sticky-top">
<tr>
<th className="ps-4 py-3">ID Appareil</th>
<th className="py-3">Local / Département</th>
<th className="py-3 text-center">État</th>
<th className="pe-4 py-3 text-end">Actions</th>
</tr>
</thead>
<tbody className="bg-white">

                    {filteredData.length > 0 ? filteredData.map(c => (
<tr key={c.id}>
<td className="ps-4 fw-bold text-primary">{c.nom}</td>
<td><span className="badge bg-secondary-subtle text-secondary border px-2 py-1">{c.local}</span></td>
<td className="text-center">
<div className="form-check form-switch d-inline-block">
<input 

                              className="form-check-input ms-0" 

                              type="checkbox" 

                              style={{width: '2.5rem', height: '1.25rem', cursor: 'pointer'}}

                              checked={c.fonctionnel} 

                              onChange={() => toggleStatus(c.id, c.fonctionnel)} 

                            />
<div className={`fw-bold small mt-1 ${c.fonctionnel ? 'text-success' : 'text-danger'}`}>

                              {c.fonctionnel ? 'OK' : 'PANNE'}
</div>
</div>
</td>
<td className="text-end pe-4">
<button className="btn btn-outline-primary btn-sm rounded-3 me-2" onClick={() => openModal(c)}><Edit2 size={16}/></button>
<button className="btn btn-outline-danger btn-sm rounded-3" onClick={() => handleDelete(c.id)}><Trash2 size={16}/></button>
</td>
</tr>

                    )) : (
<tr>
<td colSpan="4" className="text-center py-5 text-muted">Aucun résultat trouvé.</td>
</tr>

                    )}
</tbody>
</table>

              )}
</div>
</div>
</div>
</div>
 
      {/* MODAL AVEC AUTO-COMPLÉTION */}

      {showModal && (
<div className="modal d-block shadow" style={{background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'}}>
<div className="modal-dialog modal-dialog-centered modal-lg mx-2 mx-md-auto">
<div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
<div className="modal-header bg-primary text-white border-0 py-3">
<h5 className="modal-title fw-bold">{editingId ? '🛠 Modifier' : '✨ Nouveau'} Appareil</h5>
<button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
</div>
<div className="modal-body p-4 bg-white">
<div className="row g-4">
<div className="col-12 col-md-6">
<label className="form-label fw-bold">Nom / Code du Laptop</label>
<input type="text" className="form-control form-control-lg bg-light" placeholder="Ex: B200-PC-01" value={inputNom} onChange={(e) => setInputNom(e.target.value)} />
</div>
<div className="col-12 col-md-6 position-relative">
<label className="form-label fw-bold">Département (Recherche)</label>
<div className="input-group">
<span className="input-group-text bg-light"><Search size={18} /></span>
<input type="text" className="form-control form-control-lg bg-light" placeholder="Chercher un local..." value={inputDepSearch} onChange={handleDepInputChange} />
</div>

                    {showSuggestions && suggestions.length > 0 && (
<ul className="list-group position-absolute w-100 shadow-lg z-3 mt-1" style={{maxHeight: '200px', overflowY: 'auto'}}>

                        {suggestions.map((s, i) => (
<li key={i} className="list-group-item list-group-item-action" onClick={() => { setInputDepSearch(s); setShowSuggestions(false); }} style={{cursor: 'pointer'}}>
<span className="text-primary fw-bold">{s.split(' ')[0]}</span> {s.split(' ').slice(1).join(' ')}
</li>

                        ))}
</ul>

                    )}
</div>
<div className="col-12">
<div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-2 border-dashed">
<div>
<p className="mb-0 fw-bold">État de marche</p>
<small className="text-muted">Cochez si l'appareil est prêt à l'emploi</small>
</div>
<div className="form-check form-switch m-0">
<input className="form-check-input" type="checkbox" style={{width: '3.5rem', height: '1.75rem'}} checked={isFonctionnel} onChange={(e) => setIsFonctionnel(e.target.checked)} />
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
 