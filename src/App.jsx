import React, { useState, useEffect } from 'react';

import { Plus, Trash2, Edit2, Monitor, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

import 'bootstrap/dist/css/bootstrap.min.css';
 
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

  "T200 Design de la mode", "T300 Production de la mode",
  " 1 DON",
  "0 Inconnu",
].sort();
 
export default function App() {

  const [computers, setComputers] = useState(() => {

    const saved = localStorage.getItem("inventaire_ordis");

    return saved ? JSON.parse(saved) : [];

  });
 
  useEffect(() => {

    localStorage.setItem("inventaire_ordis", JSON.stringify(computers));

  }, [computers]);
 
  const [searchTerm, setSearchTerm] = useState("");

  const [filterLoc, setFilterLoc] = useState("Tous");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [inputNom, setInputNom] = useState('');

  const [inputDepSearch, setInputDepSearch] = useState('');

  const [isFonctionnel, setIsFonctionnel] = useState(true);

  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
 
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
 
  const selectSuggestion = (value) => {

    setInputDepSearch(value);

    setShowSuggestions(false);

  };
 
  const handleSave = () => {

    if (!inputNom.trim() || !inputDepSearch.trim()) {

      alert("Veuillez remplir tous les champs.");

      return;

    }

    const data = { nom: inputNom, local: inputDepSearch, fonctionnel: isFonctionnel };

    if (editingId) {

      setComputers(computers.map(c => c.id === editingId ? { ...data, id: editingId } : c));

    } else {

      setComputers([...computers, { ...data, id: Date.now() }]);

    }

    closeModal();

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

      {/* HEADER FULL WIDTH */}
<nav className="navbar navbar-dark bg-primary shadow-sm px-3 py-3">
<div className="container-fluid">
<span className="navbar-brand fw-bold d-flex align-items-center gap-2 m-0">
<Monitor size={28} /> 
<span className="d-none d-sm-inline">Gestion d'Inventaire IT</span>
<span className="d-inline d-sm-none">Inventaire IT</span>
</span>
<button className="btn btn-light fw-bold shadow-sm d-flex align-items-center gap-2" onClick={() => openModal()}>
<Plus size={20} /> <span className="d-none d-md-inline">Ajouter un appareil</span>
</button>
</div>
</nav>
 
      {/* MAIN CONTENT AREA */}
<div className="container-fluid flex-grow-1 p-3 p-md-4">
<div className="card border-0 shadow-sm h-100">
<div className="card-body p-0 p-md-3">

            {/* FILTERS SECTION */}
<div className="row g-3 p-3 border-bottom m-0 bg-white sticky-top shadow-sm-mobile">
<div className="col-12 col-md-6">
<div className="input-group">
<span className="input-group-text bg-light border-end-0"><Search size={18} /></span>
<input type="text" className="form-control border-start-0 shadow-none" placeholder="Rechercher un laptop (ex: B200...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
 
            {/* RESPONSIVE TABLE CONTAINER */}
<div className="table-responsive" style={{maxHeight: 'calc(100vh - 250px)', overflowY: 'auto'}}>
<table className="table table-hover align-middle mb-0">
<thead className="table-dark sticky-top">
<tr>
<th className="ps-4 py-3">ID Appareil</th>
<th className="py-3">Local & Département</th>
<th className="py-3 text-center">État</th>
<th className="pe-4 py-3 text-end">Actions</th>
</tr>
</thead>
<tbody className="bg-white">

                  {filteredData.length > 0 ? filteredData.map(c => (
<tr key={c.id}>
<td className="ps-4 fw-bold text-primary">{c.nom}</td>
<td>
<span className="badge bg-secondary-subtle text-secondary border px-2 py-1">

                          {c.local}
</span>
</td>
<td className="text-center">
<div className="form-check form-switch d-inline-block p-0">
<input 

                            className="form-check-input ms-0" 

                            type="checkbox" 

                            style={{width: '2.5rem', height: '1.25rem', cursor: 'pointer'}}

                            checked={c.fonctionnel} 

                            onChange={() => setComputers(computers.map(item => item.id === c.id ? {...item, fonctionnel: !item.fonctionnel} : item))} 

                          />
<div className={`fw-bold small mt-1 ${c.fonctionnel ? 'text-success' : 'text-danger'}`}>

                            {c.fonctionnel ? 'OK' : 'PANNE'}
</div>
</div>
</td>
<td className="text-end pe-4">
<div className="d-flex justify-content-end gap-2">
<button className="btn btn-outline-primary btn-sm rounded-3" onClick={() => openModal(c)}><Edit2 size={16}/></button>
<button className="btn btn-outline-danger btn-sm rounded-3" onClick={() => { if(window.confirm("Supprimer ?")) setComputers(computers.filter(item => item.id !== c.id)) }}><Trash2 size={16}/></button>
</div>
</td>
</tr>

                  )) : (
<tr>
<td colSpan="4" className="text-center py-5 text-muted">
<div className="py-4">
<Search size={48} className="opacity-25 mb-3" />
<p className="h5">Aucun résultat trouvé</p>
</div>
</td>
</tr>

                  )}
</tbody>
</table>
</div>
</div>
</div>
</div>
 
      {/* RESPONSIVE MODAL */}

      {showModal && (
<div className="modal d-block shadow" style={{background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'}}>
<div className="modal-dialog modal-dialog-centered modal-lg mx-2 mx-md-auto">
<div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
<div className="modal-header bg-primary text-white border-0 py-3">
<h5 className="modal-title fw-bold">{editingId ? '🛠 Modifier' : '✨ Nouveau'} PC</h5>
<button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
</div>
<div className="modal-body p-4 bg-white">
<div className="row g-4">
<div className="col-12">
<label className="form-label fw-bold">Nom / Numéro d'inventaire</label>
<input type="text" className="form-control form-control-lg bg-light" placeholder="Ex: B200-PC-01" value={inputNom} onChange={(e) => setInputNom(e.target.value)} />
</div>
<div className="col-12 position-relative">
<label className="form-label fw-bold">Rechercher le Département</label>
<div className="input-group">
<span className="input-group-text bg-light"><Search size={18} /></span>
<input type="text" className="form-control form-control-lg bg-light" placeholder="Tapez le code ou nom..." value={inputDepSearch} onChange={handleDepInputChange} onFocus={() => inputDepSearch.length > 0 && setShowSuggestions(true)} />
</div>

                    {showSuggestions && suggestions.length > 0 && (
<ul className="list-group position-absolute w-100 shadow-xl z-3 mt-1 border" style={{maxHeight: '250px', overflowY: 'auto', left: '0', right: '0', padding: '0 12px'}}>

                        {suggestions.map((s, i) => (
<li key={i} className="list-group-item list-group-item-action cursor-pointer p-3 fw-medium" onClick={() => selectSuggestion(s)} style={{cursor: 'pointer'}}>
<span className="text-primary fw-bold me-2">{s.split(' ')[0]}</span> {s.split(' ').slice(1).join(' ')}
</li>

                        ))}
</ul>

                    )}
</div>
<div className="col-12">
<div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-2 border-dashed">
<div>
<p className="mb-0 fw-bold text-dark">État opérationnel</p>
<small className="text-muted">L'appareil est-il prêt à être utilisé ?</small>
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
 