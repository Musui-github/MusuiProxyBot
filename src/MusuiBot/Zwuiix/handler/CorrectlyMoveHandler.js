const {Vector3, fromObject} = require("../utils/math/Vector3");
const Vector2 = require("../utils/math/Vector2");
const PlayerAuthInputPacket = require('../network/packet/PlayerAuthInputPacket');
const MovePlayerPacket = require('../network/packet/MovePlayerPacket');

class CorrectlyMoveHandler
{
    /**** @param client {Client}*/
    constructor(client)
    {
        client.getNetworkSession().getClient().on('serverbound', (pk) => {
            switch (pk.name) {
                case "player_auth_input":
                    if(client.hasTarget() && client.getCanTarget()) {
                        if(!client.getWorld().getEntityLocations().has(client.getCurrentTarget())) {
                            client.setCurrentTarget(-1);
                        } else {
                            client.setPosition(client.getWorld().getEntityLocations().get(client.getCurrentTarget()));
                            client.getNetworkSession().sendClientBoundDataPacket(new MovePlayerPacket(
                                Number(client.getId()),
                                client.getPosition().asObject(),
                                client.getPitch(),
                                client.getYaw(),
                                client.getYaw(),
                                "normal",
                                true,
                                0,
                                "unknown",
                                32767
                            ));
                            client.attackEntityWithId(client.getCurrentTarget());

                            let packet = new PlayerAuthInputPacket(
                                client.getPitch(),
                                client.getYaw(),
                                client.getPosition().asObject(),
                                {x: 0, z: 0},
                                client.getYaw(),
                                client.getInputData(),
                                'mouse',
                                'normal',
                                'touch',
                                new Vector3(0, 0, 0).asObject(),
                                client.getNextTick(),
                                new Vector3(0, 0, 0).asObject(),
                                undefined,
                                undefined,
                                undefined,
                                {x: 0, z: 0}
                            );
                            pk.params = packet.getValue();
                        }
                    }
                    break;
                case "set_entity_motion":
                    let runtime_entity_id = pk.params.runtime_entity_id;
                    let velocity = pk.params.velocity;
                    let predicted = client.getPosition().add(fromObject(velocity));
                    if (runtime_entity_id == client.getId()) client.setPosition(client.getPosition().add(fromObject(velocity)));
                    break;
            }
        });

        client.getNetworkSession().getClient().on("clientbound", (packet) => {
            let runtime_id;
            switch(packet.name) {
                case "move_player":
                    runtime_id = packet.params.runtime_id;
                    if(runtime_id == client.getId()) {
                        if(packet.params.tick == 32767)
                            break;
                        let position = packet.params.position;
                        client.yaw = packet.params.yaw;
                        client.pitch = packet.params.pitch;
                        client.setPosition(fromObject(position));
                    }
                    break;
                case "move_entity":
                    runtime_id = packet.params.runtime_entity_id;
                    client.getWorld().getEntityLocations().set(runtime_id, fromObject(packet.params.position));
                    client.getWorld().getEntityRotations().set(runtime_id, new Vector2(packet.params.rotation.x, packet.params.rotation.y));
                    break;
            }
        });
    }
}
module.exports = CorrectlyMoveHandler;