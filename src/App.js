import './App.css';
import Header from './Header';

function App()
{
  return(
    <div className="App">
      <Header />
      <main className="contenu">
      <p>Bienvenue ! Cette appplication vous aide a trouver
         votre ligne de bus a Dakar.</p>
      </main>
    </div>
  );
}

export default Header;