const Packet = require('./Packet');
class MovePlayerPacket extends Packet
{
    constructor(
        runtime_id,
        position,
        pitch,
        yaw,
        head_yaw,
        mode,
        on_ground,
        ridden_runtime_id,
        teleport,
        tick
    ) {
        super("move_player");
        this.value = {
            runtime_id: runtime_id,
            position: position,
            pitch: pitch,
            yaw: yaw,
            head_yaw: head_yaw,
            mode: mode,
            on_ground: on_ground,
            ridden_runtime_id: ridden_runtime_id,
            teleport: teleport,
            tick: tick
        };
    }
}
module.exports = MovePlayerPacket;