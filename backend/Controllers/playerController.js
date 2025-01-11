
// Fonction qui retourne les coordonnées de l'emplacement à utiliser en fonction du nb de joueurs autour de la table
function findCoord(players) {
    console.log('FindCoord appelé')
    var NbPlayer = players.length;
    let x, y;

    switch (NbPlayer+1) {
        case 1:
            x = 100;
            y = 100;
            break;
        case 2:
            x = 500;
            y = 100;
            break;
        case 3:
            x = 700;
            y = 100;
            break;
        case 4:
            x = 100;
            y = 500;
            break;
        case 5:
            x = 400;
            y = 560;
            break;
        case 6:
            x = 700;
            y = 500;
            break;
        default:
            console.log("nb joueurs non valide");
            return null;
    }

    return [x, y]; // Return x and y as an array
}



//Permet de donner de nouvelle coordonnées directement en fonction d'une taille et pas d'un tableau
function findCoord2(taille) {
    let x, y;

    switch (taille+1) {
        case 1:
            x = 100;
            y = 100;
            break;
        case 2:
            x = 400;
            y = 35;
            break;
        case 3:
            x = 700;
            y = 100;
            break;
        case 4:
            x = 100;
            y = 500;
            break;
        case 5:
            x = 400;
            y = 560;
            break;
        case 6:
            x = 700;
            y = 500;
            break;
        default:
            console.log("nb joueurs non valide");
            return null;
    }

    return [x, y]; // Return x and y as an array
}


//Retourne l'indice de la position du joueur dans la partie (0 = BTN, 1 = SB, 2 = BB, 3 = HJ, 4 = LJ, 5 = CO)
function findPositionReelle(nbJoueurs)
{
    // Le nouveau joueur rentre le plus à droite possible donc équivalent au nb de joueurs déjà présent
    return nbJoueurs ;

}




module.exports = {
    findCoord,
    findCoord2,
    findPositionReelle,
};