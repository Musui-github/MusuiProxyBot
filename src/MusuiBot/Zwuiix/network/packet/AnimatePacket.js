const Packet = require('./Packet');
class AnimatePacket extends Packet
{
    constructor(
        runtime_id,
        action_id,
        boat_rowing_time
    ) {
        super("animate");
        this.value = {
            runtime_entity_id: runtime_id,
            action_id: action_id,
            boat_rowing_time: boat_rowing_time
        };
    }
}
module.exports = AnimatePacket;