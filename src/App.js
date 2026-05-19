import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';
import Carte from './Carte';

function App() {
  // États pour l'API (liste)
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  
  // États pour la recherche
  const [recherche, setRecherche] = useState("");
  
  // États pour le détail (chargé à la demande - Exercice 3)
  const [detailLigne, setDetailLigne] = useState(null);
  const [chargementDetail, setChargementDetail] = useState(false);

  // Fonction pour recharger les données (Exercice 1)
  const rechargerLignes = () => {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  };

  // Charger la liste des lignes au démarrage
  useEffect(() => {
    rechargerLignes();
  }, []);

  // Filtrer les lignes
  const lignesFiltrees = lignes.filter(ligne =>
    ligne.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    ligne.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    ligne.numero.includes(recherche)
  );

  // Gérer le clic : charger les détails via l'API (Exercice 3)
  function handleClickLigne(ligne) {
    // Si on reclique sur la même ligne, on désélectionne
    if (detailLigne && detailLigne.id === ligne.id) {
      setDetailLigne(null);
      return;
    }
    
    // Sinon, on charge les détails
    setChargementDetail(true);
    fetch(`http://localhost:5000/lignes/${ligne.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setDetailLigne(data);
        setChargementDetail(false);
      })
      .catch(error => {
        console.error("Erreur chargement détail:", error);
        setChargementDetail(false);
      });
  }

  // Écran de chargement
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  // Écran d'erreur
  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
            <button onClick={rechargerLignes} className="bouton-recharger">
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        {/* Barre de recherche + bouton recharger (Exercice 1) */}
        <div className="recherche-container">
          <Recherche valeur={recherche} onChange={setRecherche} />
          <button onClick={rechargerLignes} className="bouton-recharger">
            🔄 Recharger
          </button>
        </div>
        
        {/* Compteur de résultats */}
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        
        {/* Liste des lignes filtrées */}
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={detailLigne && detailLigne.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        
        {/* Affichage conditionnel des détails (Exercice 3) */}
        {detailLigne && <DetailLigne ligne={detailLigne} />}
        {chargementDetail && (
          <p className="message-chargement-detail">Chargement des arrêts...</p>
        )}

        <Carte />
      </main>
      <Footer />
    </div>
  );
}

export default App;