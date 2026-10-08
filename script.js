/* =====================================================
                    VARIABLES GENERALES
===================================================== */
let modeChoisi = "";
let joueurs = [];
let gagnant = "";
let rotation = 0;
let typeClassement = "";
let joueurPave = null;
let operationPave = "";



/* =====================================================
                 NAVIGATION ENTRE LES PAGES
===================================================== */

// Choix du mode de jeu
function choisirMode(mode){
    modeChoisi = mode;
    document.getElementById("menu").style.display = "none";
    document.getElementById("joueurs").style.display = "block";
    document.getElementById("retour").style.display = "block";
}


// Retour au menu principal
function retour(){
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById("menu").style.display = "block";
    document.getElementById("retour").style.display = "none";
}



/* =====================================================
                   GESTION DES JOUEURS
===================================================== */

// Ajout d'un joueur
function ajouterJoueur(){
    let nom = document.getElementById("nomJoueur").value;

    if(nom.trim() === ""){
        return;
    }

    joueurs.push(nom);
    afficherJoueurs();
    document.getElementById("nomJoueur").value = "";
}


// Affichage de la liste des joueurs
function afficherJoueurs(){
    let liste = document.getElementById("listeJoueurs");

    liste.innerHTML = "";
    joueurs.forEach(joueur => {
        let element = document.createElement("li");
        element.textContent = joueur;
        liste.appendChild(element);
    });
}



/* =====================================================
                   CHANGEMENT D'ETAPE
===================================================== */

// Passage à l'étape suivante
function continuer(){
    if(joueurs.length < 2){
        alert("Minimum 2 joueurs");
        return;
    }

    document.getElementById("joueurs").style.display = "none";

    if(modeChoisi === "tirage" || modeChoisi === "complet"){
        document.getElementById("tirage").style.display = "block";
        dessinerRoue();
    }

    if(modeChoisi === "calcul"){
        document.getElementById("choixClassement").style.display = "block";
    }
}



/* =====================================================
                   SYSTEME DE TIRAGE
===================================================== */

// Dessin de la roue de tirage
function dessinerRoue(){
    let canvas = document.getElementById("roue");
    let ctx = canvas.getContext("2d");

    let centre = 200;
    let rayon = 200;

    ctx.clearRect(0, 0, 400, 400);

    let angle = (Math.PI * 2) / joueurs.length;

    joueurs.forEach((nom, index) => {
        let debut = -Math.PI / 2 - angle / 2 + index * angle;
        let fin = debut + angle;

        ctx.beginPath();
        ctx.moveTo(centre, centre);
        ctx.arc(centre, centre, rayon, debut, fin);
        ctx.fillStyle = `hsl(${index * 50},70%,60%)`;
        ctx.fill();
        ctx.save();

        ctx.translate(centre, centre);
        ctx.rotate(debut + angle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText(nom, 180, 5);
        ctx.restore();
    });
}


// Lancement du tirage
function lancerTirage(){
    let index = Math.floor(Math.random() * joueurs.length);
    gagnant = joueurs[index];

    let part = 360 / joueurs.length;
    let positionVoulue = -(index * part);
    let rotationActuelle = rotation % 360;
    let difference = positionVoulue - rotationActuelle;

    if(difference < 0){
        difference += 360;
    }

    rotation += (5 * 360) + difference;
    let roue = document.getElementById("roue");
    roue.classList.remove("zoom");
    roue.style.transition = "transform 5s cubic-bezier(.15,.8,.25,1)";
    roue.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        roue.classList.add("zoom");
        document.getElementById("gagnant").textContent = "🎉 Gagnant : " + gagnant;

        if(modeChoisi === "complet"){
            document.getElementById("continuerTirage").style.display = "block";
        }
    }, 5200);
}



/* =====================================================
                   SYSTEME DE CALCUL
===================================================== */

// Choix du type de classement
function choisirClassement(type){
    typeClassement = type;
    document.getElementById("choixClassement").style.display = "none";
    document.getElementById("calcul").style.display = "block";
    afficherCalcul();
}


// Création de l'affichage des joueurs
function afficherCalcul(){
    // Récupération de la zone contenant toutes les cartes
    let listeScores = document.getElementById("listeScores");

    // On vide la zone avant de la recréer
    listeScores.innerHTML = "";

    // Création d'une carte pour chaque joueur
    joueurs.forEach((joueur, index) => {
        // Création de la carte
        let carte = document.createElement("div");
        carte.className = "carteJoueur";

        // Création du nom et du classement
        let nom = document.createElement("div");
        nom.className = "nomJoueurScore";
        nom.innerHTML = `<span class="classementJoueur">${index + 1}️⃣</span> ${joueur}`;

        // Création du score
        let score = document.createElement("div");
        score.className = "scoreJoueur";
        score.textContent = "0";

        // Création de la zone des boutons
        let boutons = document.createElement("div");
        boutons.className = "boutonsScore";

        // Bouton soustraction
        let boutonMoins = document.createElement("button");
        boutonMoins.textContent = "➖";
        boutonMoins.onclick = function(){ouvrirPave(index, "retirer");};

        // Bouton addition
        let boutonPlus = document.createElement("button");
        boutonPlus.textContent = "➕";
        boutonPlus.onclick = function(){ouvrirPave(index, "ajouter");};

        // Assemblage des boutons
        boutons.appendChild(boutonMoins);
        boutons.appendChild(boutonPlus);

        // Assemblage de la carte
        carte.appendChild(nom);
        carte.appendChild(score);
        carte.appendChild(boutons);

        // Ajout de la carte dans la page
        listeScores.appendChild(carte);
    });
}


// Ouverture du pavé numérique
function ouvrirPave(index, operation){
    joueurPave = index;
    operationPave = operation;

    let titre = document.getElementById("titrePave");

    if(operation === "ajouter"){
        titre.textContent = "Ajouter des points";
    }

    if(operation === "retirer"){
        titre.textContent = "Retirer des points";
    }

    document.getElementById("valeurPave").textContent = "0";
    document.getElementById("paveNumerique").classList.add("actif");
}


// Gestion des touches du pavé
function touchePave(chiffre){
    let affichage = document.getElementById("valeurPave");
    let valeur = affichage.textContent;

    if(valeur === "0"){
        valeur = "";
    }

    valeur += chiffre;
    affichage.textContent = valeur;
}


// Effaçage du pavé numérique
function effacerPave(){
    let affichage = document.getElementById("valeurPave");
    let valeur = affichage.textContent;

    if(valeur.length <= 1){
        affichage.textContent = "0";
        return;
    }

    affichage.textContent = valeur.slice(0, -1);
}


// Validation du pavé numérique
function validerPave(){
    let affichage = document.getElementById("valeurPave");
    let valeur = Number(affichage.textContent);

    if(valeur === 0){
        fermerPave();
        return;
    }

    let cartes = document.querySelectorAll(".carteJoueur");
    let carte = cartes[joueurPave];
    let score = carte.querySelector(".scoreJoueur");
    let scoreActuel = Number(score.textContent);

    if(operationPave === "ajouter"){
        scoreActuel += valeur;
    }

    if(operationPave === "retirer"){
        scoreActuel -= valeur;
    }

    score.textContent = scoreActuel;
    fermerPave();
    calculerClassement();
}


// Fermeture du pavé numérique
function fermerPave(){
    document.getElementById("paveNumerique").classList.remove("actif");
}


// Ajout de points via le système de points classique
function ajouterPoints(index){
    let cartes = document.querySelectorAll(".carteJoueur");
    let carte = cartes[index];
    let score_recup = carte.querySelector(".scoreJoueur");
    let score_val = parseInt(score_recup.textContent, 10);
    let valeur_recup = prompt("Points a ajouter : ");

    if(valeur_recup === null || valeur_recup === ""){
        return;
    }

    let valeur = Number(valeur_recup);
    let score_valeur = score_val + valeur;
    let score_str = score_valeur.toString();
    carte.querySelector(".scoreJoueur").textContent = score_str;

    calculerClassement();
}


// Retrait de points via le système de points classique
function retirerPoints(index){
    let cartes = document.querySelectorAll(".carteJoueur");
    let carte = cartes[index];
    let score_recup = carte.querySelector(".scoreJoueur");
    let score_val = parseInt(score_recup.textContent, 10);
    let valeur_recup = prompt("Points a ajouter : ");

    if(valeur_recup === null || valeur_recup === ""){
        return;
    }

    let valeur = Number(valeur_recup);
    let score_valeur = score_val - valeur;
    let score_str = score_valeur.toString();
    carte.querySelector(".scoreJoueur").textContent = score_str;

    calculerClassement();
}


// Calcul du classement des joueurs
function calculerClassement(){
    let cartes = document.querySelectorAll(".carteJoueur");
    let scoresJoueurs = [];

    for(let i = 0; i < cartes.length; i++){
        let nom = joueurs[i];
        let score = Number(cartes[i].querySelector(".scoreJoueur").textContent);
        scoresJoueurs.push({index: i, nom: nom, score: score});
    }

    // Classement croissant (plus de points = 1er)
    if(typeClassement === "plusPoints"){
        scoresJoueurs.sort((a,b) => b.score - a.score);
    }

    // Classement décroissant (moins de points = 1er)
    if(typeClassement === "moinsPoints"){
        scoresJoueurs.sort((a,b) => a.score - b.score);
    }

    for(let position = 0; position < scoresJoueurs.length; position++){
        let indexJoueur = scoresJoueurs[position].index;
        let classement = cartes[indexJoueur].querySelector(".classementJoueur");
        classement.textContent = (position + 1) + "️⃣";
    }
}


// Passage du tirage au système de calcul
function passerAuCalcul(){
    document.getElementById("tirage").style.display = "none";
    document.getElementById("choixClassement").style.display = "block";
}
