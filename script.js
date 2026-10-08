/* =====================================================
                    VARIABLES GENERALES
===================================================== */
let modeChoisi = "";
let joueurs = [];
let gagnant = "";
let rotation = 0;
let typeClassement="";
/* =====================================================
                    NAVIGATION ENTRE LES PAGES
===================================================== */
function choisirMode(mode){
    modeChoisi = mode;

    document
        .getElementById("menu")
        .style.display = "none";

    document
        .getElementById("joueurs")
        .style.display = "block";

    document
        .getElementById("retour")
        .style.display = "block";

}

function retour(){
    document
        .querySelectorAll("section")
        .forEach(section => {

            section.style.display = "none";
        });

    document
        .getElementById("menu")
        .style.display = "block";

    document
        .getElementById("retour")
        .style.display = "none";

}

/* =====================================================
                    GESTION DES JOUEURS
===================================================== */
function ajouterJoueur(){
    let nom =
        document.getElementById("nomJoueur").value;

    if(nom.trim() === ""){
        return;
    }

    joueurs.push(nom);
    afficherJoueurs();

    document
        .getElementById("nomJoueur")
        .value = "";

}

function afficherJoueurs(){
    let liste =
        document.getElementById("listeJoueurs");

    liste.innerHTML = "";
    joueurs.forEach(joueur => {

        let element =
            document.createElement("li");

        element.textContent = joueur;
        liste.appendChild(element);
    });

}

/* =====================================================
                    CHANGEMENT D'ETAPE
===================================================== */
function continuer(){
    if(joueurs.length < 2){
        alert("Minimum 2 joueurs");
        return;
    }

    document
        .getElementById("joueurs")
        .style.display = "none";

    if(modeChoisi === "tirage"
        || modeChoisi === "complet"){

        document
            .getElementById("tirage")
            .style.display = "block";

        dessinerRoue();
    }

    if(modeChoisi === "calcul"){

        typeClassement = prompt(
            "Quel type de classement ?\n\n" +
            "1 = Plus de points  (classement croissant)= 1er\n" +
            "2 = Moins de points (classement décroissant) = 1er"
        );

        if(typeClassement === "1"){
            typeClassement = "plusPoints";
        }
        else if(typeClassement === "2"){
            typeClassement = "moinsPoints";
        }
        else{
            alert("Choix invalide");
            return;
        }

        document
            .getElementById("calcul")
            .style.display = "block";

        afficherCalcul();
    }
}

/* =====================================================
                    SYSTEME DE TIRAGE
===================================================== */
function dessinerRoue(){
    let canvas =
        document.getElementById("roue");

    let ctx =
        canvas.getContext("2d");

    let centre = 200;

    let rayon = 200;
    ctx.clearRect(
        0,
        0,
        400,
        400
    );

    let angle =
        (Math.PI * 2) / joueurs.length;

    joueurs.forEach((nom,index)=>{

        let debut =
            index * angle;

        let fin =
            debut + angle;

        ctx.beginPath();
        ctx.moveTo(
            centre,
            centre
        );

        ctx.arc(
            centre,
            centre,
            rayon,
            debut,
            fin
        );

        ctx.fillStyle =
            `hsl(${index*50},70%,60%)`;
        ctx.fill();
        ctx.save();
        ctx.translate(
            centre,
            centre
        );

        ctx.rotate(
            debut + angle/2
        );

        ctx.textAlign = "right";
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";

        ctx.fillText(
            nom,
            180,
            5
        );
        ctx.restore();
    });
}

function lancerTirage(){
    let index =
        Math.floor(
            Math.random()*joueurs.length
        );

    gagnant =
        joueurs[index];

    let part =
        360 / joueurs.length;

    let angleGagnant =
        index * part + part / 2;
    rotation +=
        (5 * 360)
        +
        (360 - angleGagnant);

    let roue =
        document.getElementById("roue");
    roue.style.transition =
        "transform 5s cubic-bezier(.15,.8,.25,1)";
    roue.style.transform =
        `rotate(${rotation}deg)`;

    setTimeout(()=>{
        roue.classList.add("zoom");
        document
            .getElementById("gagnant")
            .textContent =
            "🎉 Gagnant : " + gagnant;

        // Si le mode choisi est "complet",
        // on prépare ensuite le calcul.
        if(modeChoisi === "complet"){
            document.getElementById("continuerTirage").style.display = "block";
        }
    },5200);

}

/* =====================================================
                    SYSTEME DE CALCUL
===================================================== */
// Création de l'affichage des joueurs
function afficherCalcul(){
    // Récupération de la zone contenant
    // toutes les cartes
    let listeScores =
        document.getElementById("listeScores");
    // On vide la zone avant de la recréer
    listeScores.innerHTML = "";

    // Création d'une carte pour chaque joueur
    joueurs.forEach((joueur, index) => {
        // Création de la carte
        let carte =
            document.createElement("div");
        carte.className =
            "carteJoueur";

        // Création du nom et du classement
        let nom =
            document.createElement("div");
        nom.className =
            "nomJoueurScore";
        nom.innerHTML =
            `<span class="classementJoueur">
                ${index + 1}️⃣
            </span>
            ${joueur}`;

        // Création du score
        let score =
            document.createElement("div");
        score.className =
            "scoreJoueur";
        score.textContent = "0";

        // Création de la zone des boutons
        let boutons =
            document.createElement("div");
        boutons.className =
            "boutonsScore";

        // Bouton soustraction
        let boutonMoins =
            document.createElement("button");
        boutonMoins.textContent = "➖";
        boutonMoins.onclick = function(){
            retirerPoints(index);
        };

        // Bouton addition
        let boutonPlus =
            document.createElement("button");
        boutonPlus.textContent = "➕";
        boutonPlus.onclick = function(){
            ajouterPoints(index);
        };

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

// Partie réservée au futur système de points
function ajouterPoints(index){
    let cartes=document.querySelectorAll(".carteJoueur");
    let carte=cartes[index];
    let score_recup=carte.querySelector(".scoreJoueur");
    let score_val=parseInt(score_recup.textContent, 10);
    let valeur_recup=prompt("Points a ajouter : ")
    if (valeur_recup===null || valeur_recup===""){
        return;
    }
    let valeur=Number(valeur_recup);
    let score_valeur=score_val+valeur;
    let score_str=score_valeur.toString();
    carte.querySelector(".scoreJoueur").textContent=score_str;

    calculerClassement();
}
function retirerPoints(index){
    let cartes=document.querySelectorAll(".carteJoueur");
    let carte=cartes[index];
    let score_recup=carte.querySelector(".scoreJoueur");
    let score_val=parseInt(score_recup.textContent, 10);
    let valeur_recup=prompt("Points a ajouter : ")
    if (valeur_recup===null || valeur_recup===""){
        return;
    }
    let valeur=Number(valeur_recup);
    let score_valeur=score_val-valeur;
    let score_str=score_valeur.toString();
    carte.querySelector(".scoreJoueur").textContent=score_str;

    calculerClassement();
}

function calculerClassement() {
    let cartes = document.querySelectorAll(".carteJoueur");
    let scoresJoueurs = [];
    for(let i = 0; i < cartes.length; i++) {
        let nom = joueurs[i];
        let score = Number(cartes[i].querySelector(".scoreJoueur").textContent);
        scoresJoueurs.push({
            index: i,
            nom: nom,
            score: score
        });
    }
    //classemnt croissant (plus de point 1er)
    if(typeClassement === "plusPoints") {
        scoresJoueurs.sort((a,b) => b.score - a.score);}

    //classemnt décroissant (moins de point 1er)
    if(typeClassement === "moinsPoints") {
        scoresJoueurs.sort((a,b) => a.score - b.score);}

    for(let position = 0; position < scoresJoueurs.length; position++) {
        let indexJoueur = scoresJoueurs[position].index;
        let classement = cartes[indexJoueur].querySelector(".classementJoueur");
        classement.textContent = (position + 1) + "️⃣";
    }
}

function passerAuCalcul(){
    typeClassement = prompt(
        "Quel type de classement ?\n\n" +
        "1 = Plus de points = 1er\n" +
        "2 = Moins de points = 1er"
    );

    if(typeClassement === "1"){
        typeClassement = "plusPoints";
    }

    else if(typeClassement === "2"){
        typeClassement = "moinsPoints";}

    else{
        alert("Choix invalide");return;}

    document.getElementById("tirage").style.display = "none";
    document.getElementById("calcul").style.display = "block";

    afficherCalcul();
}