const Packet = require('./Packet');

class LevelSoundEventPacket extends Packet
{
    constructor(
        sound_id,
        position,
        block_id,
        is_baby_mob,
        is_global,
    ) {
        super("level_sound_event");
        this.value = {
            sound_id: sound_id,
            position: position,
            block_id: block_id,
            is_baby_mob: is_baby_mob,
            is_global: is_global
        };
    }
}
module.exports =  LevelSoundEventPacket;