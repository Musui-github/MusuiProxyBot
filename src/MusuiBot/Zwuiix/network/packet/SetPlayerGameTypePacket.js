const Packet = require('./Packet');
class SetPlayerGameTypePacket extends Packet
{
    constructor(
        gamemode
    ) {
        super("set_player_game_type");
        this.value = {
            gamemode: gamemode
        };
    }
}
module.exports = SetPlayerGameTypePacket;