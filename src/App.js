import { useState } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  // États
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // Tableau des lignes avec leurs arrêts (Étape 1)
  const lignes = [
    { 
      id: 1, 
      numero: "1", 
      depart: "Parcelles Assainies", 
      arrivee: "Plateau", 
      arrets: 14, 
      listeArrets: ["Parcelles U14", "Parcelles U10", "Camberene", "Patte d'Oie", "Grand Dakar", "Colobane", "Ponty", "Plateau"] 
    },
    { 
      id: 2, 
      numero: "7", 
      depart: "Guediawaye", 
      arrivee: "Place Obe", 
      arrets: 18, 
      listeArrets: ["Guediawaye", "Pikine", "Thiaroye", "Keur Massar", "Grand Yoff", "Parcelles", "Liberte 6", "Place Obe"] 
    },
    { 
      id: 3, 
      numero: "15", 
      depart: "Pikine", 
      arrivee: "Medina", 
      arrets: 12, 
      listeArrets: ["Pikine Centre", "Thiaroye Gare", "Hann", "Colobane", "Fass", "Medina"] 
    },
    { 
      id: 4, 
      numero: "23", 
      depart: "Ouakam", 
      arrivee: "Grand Dakar", 
      arrets: 10, 
      listeArrets: ["Ouakam Village", "Mermoz", "Fann", "Point E", "Liberte 5", "Grand Dakar"] 
    },
    { 
      id: 5, 
      numero: "8", 
      depart: "Almadies", 
      arrivee: "Colobane", 
      arrets: 16, 
      listeArrets: ["Almadies", "Ngor", "Yoff", "Ouest Foire", "Liberte 6", "Colobane"] 
    },
    { 
      id: 6, 
      numero: "12", 
      depart: "Yoff", 
      arrivee: "Sandaga", 
      arrets: 11, 
      listeArrets: ["Yoff Village", "Aeroport LSS", "Parcelles U17", "Grand Yoff", "HLM", "Sandaga"] 
    },
  ];

  // Filtrer les lignes selon le texte tapé (Étape 4)
  const lignesFiltrees = lignes.filter(ligne =>
    ligne.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    ligne.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    ligne.numero.includes(recherche)
  );

  // Gérer le clic sur une ligne (Étape 7)
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null); // re-clic = désélectionner
    } else {
      setLigneSelectionnee(ligne); // premier clic = sélectionner
    }
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        {/* Composant Recherche (Étape 2) */}
        <Recherche valeur={recherche} onChange={setRecherche} />
        
        {/* Compteur de résultats */}
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        
        {/* Liste des lignes filtrées (Étape 8) */}
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        
        {/* Affichage conditionnel des détails (Étape 10) */}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;