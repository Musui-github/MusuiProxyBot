const {Vector3, fromObject} = require("../utils/math/Vector3");
const Vector2 = require("../utils/math/Vector2");
const PlayerAuthInputPacket = require('../network/packet/PlayerAuthInputPacket');
const MovePlayerPacket = require('../network/packet/MovePlayerPacket');
const PlayerEntity = require("../entity/PlayerEntity");
const deg2rad = require('deg2rad');

class CorrectlyMoveHandler
{
    /**** @param client {Client}*/
    constructor(client)
    {
        client.getNetworkSession().getClient().on('serverbound', (pk) => {
            switch (pk.name) {
                case "player_auth_input":
                    if(client.hasTarget() && client.getCanTarget()) {
                        if(!client.getWorld().getPlayersEntities().has(client.getCurrentTarget())) {
                            client.setCurrentTarget(-1);
                        } else {
                            let currentTarget = client.getWorld().getPlayersEntities().get(client.getCurrentTarget());
                            if (currentTarget instanceof PlayerEntity) {

                                let tickDiff = 1;

                                let pos = currentTarget.getPosition();
                                let newPos = client.getPosition();
                                let xdiff = pos.x - newPos.x;
                                let zdiff = pos.z - newPos.z;
                                let angle = Math.atan2(zdiff, xdiff);
                                let yaw = ((angle * 180) / 3.1415926535898) - 90;
                                let ydiff = pos.y - newPos.y;
                                let v = new Vector2(newPos.x, newPos.z);
                                let dist = v.distance(new Vector2(pos.x, pos.z));
                                angle = Math.atan2(dist, ydiff);
                                let pitch = ((angle * 180) / 3.1415926535898) - 90;
                                client.setYaw(yaw);
                                client.setPitch(pitch);

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
                                if(client.canReachAttack(currentTarget)) {
                                    client.attackEntity(currentTarget);
                                }
                                
                                let x = currentTarget.getPosition().getX() - client.getPosition().getX();
                                let y = currentTarget.getPosition().getY() - client.getPosition().getY();
                                let z = currentTarget.getPosition().getZ() - client.getPosition().getZ();

                                let diff = Math.abs(x) + Math.abs(z);

                                if (x ** 2 + z ** 2 < 0.7) {
                                    client.velocity.x = 0;
                                    client.velocity.z = 0;
                                } else if (diff > 0) {
                                    client.velocity.x = 2.98 * 0.15 * (x / diff);
                                    client.velocity.z = 2.98 * 0.15 * (z / diff);
                                    yaw = -Math.atan2(x / diff, z / diff) * 180 / Math.PI;
                                }
                                pitch = y === 0 ? 0 : deg2rad(-Math.atan2(y, Math.sqrt(x ** 2 + z ** 2)));

                                let dx = client.velocity.x * tickDiff;
                                let dy = client.velocity.y * tickDiff;
                                let dz = client.velocity.z * tickDiff;

                                client.setPosition(client.getPosition().add(new Vector3(dx, dy , dz)));

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

                            //client.setPosition(currentcurrentTarget.getPosition());
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

                    let pEntity = client.getWorld().getPlayersEntities().get(runtime_id);
                    if (pEntity instanceof PlayerEntity) {
                        pEntity.setPosition(fromObject(packet.params.position));
                    }

                    client.getWorld().getEntityLocations().set(runtime_id, fromObject(packet.params.position));
                    client.getWorld().getEntityRotations().set(runtime_id, new Vector2(packet.params.rotation.x, packet.params.rotation.y));
                    break;
            }
        });
    }
}
module.exports = CorrectlyMoveHandler;