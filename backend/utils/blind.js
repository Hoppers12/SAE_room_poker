// Fonction qui fait poser les blindes à SB et BB
function putBlinds(val_SB,val_BB,players,game) {
    const nbPlayers = players.length
    players.forEach((player) => {

        console.log(player.name , player.p_reelle)
        if (player.p_reelle === 1) {
            game.bet(player,val_SB)


        }// Sil y a que 2 joueurs le BTN pose la BB
        else if (player.p_reelle === 2 || (player.p_reelle === 0 && nbPlayers === 2))
        {
            game.bet(player,val_BB)
        }

    })
}

module.exports = {
    putBlinds,
};