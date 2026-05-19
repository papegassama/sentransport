import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les donnees depuis le fichier JSON
with open("./api/lignes_ddd.json", "r") as f:
    lignes = json.load(f)

# Charger les arrêts (NOUVEAU - Étape 3)
with open("./api/arrets.json", "r") as f:
    arrets = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })


@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next((l for l in lignes if l["id"] == ligne_id), None)
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)

#=== Exercice 1 : Lab 4
# @app.route("/arrets")
# def get_arrets():
#     # Extraire tous les arrêts de toutes les lignes
#     tous_les_arrets = []
#     for ligne in lignes:
#         tous_les_arrets.extend(ligne["listeArrets"])
    
#     # Supprimer les doublons avec set(), puis reconvertir en liste
#     arrets_sans_doublons = list(set(tous_les_arrets))
    
#     # Trier par ordre alphabétique pour un affichage plus propre
#     arrets_sans_doublons.sort()
    
#     return jsonify({
#         "total": len(arrets_sans_doublons),
#         "arrets": arrets_sans_doublons
#     })
#=== Fin Exercice 1 : Lab 4
#=== Exercice 2 : Lab 4
@app.route("/stats")
def get_stats():
    # Nombre total de lignes
    total_lignes = len(lignes)
    
    # Nombre total d'arrêts (somme de tous les arrets)
    total_arrets = sum(ligne["arrets"] for ligne in lignes)
    
    # Ligne ayant le plus d'arrêts
    ligne_max_arrets = max(lignes, key=lambda l: l["arrets"])
    ligne_max_numero = ligne_max_arrets["numero"]
    ligne_max_nombre = ligne_max_arrets["arrets"]
    
    return jsonify({
        "total_lignes": total_lignes,
        "total_arrets": total_arrets,
        "ligne_max_arrets": {
            "numero": ligne_max_numero,
            "nombre_arrets": ligne_max_nombre
        }
    })
#== Fin Exercice 2 : Lab 4
#=== Exercice 3 : Lab 4
@app.route("/lignes/recherche")
def rechercher_lignes():
    # Récupérer le paramètre q (requête de recherche)
    q = request.args.get("q", "")
    
    # Si le paramètre est vide, retourner toutes les lignes
    if q == "":
        return jsonify({
            "recherche": "",
            "resultats": lignes,
            "nombre": len(lignes)
        })
    
    # Filtrer les lignes (insensible à la casse)
    q_minuscule = q.lower()
    resultats = []
    for ligne in lignes:
        if (q_minuscule in ligne["depart"].lower() or 
            q_minuscule in ligne["arrivee"].lower()):
            resultats.append(ligne)
    
    # Retourner les résultats
    return jsonify({
        "recherche": q,
        "resultats": resultats,
        "nombre": len(resultats)
    })
if __name__ == "__main__":
    app.run(debug=True, port=5000)