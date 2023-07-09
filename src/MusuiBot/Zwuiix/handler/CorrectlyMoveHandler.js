const Vector3 = require("../utils/math/Vector3");

class CorrectlyMoveHandler
{
    /**** @param client {Client}*/
    constructor(client)
    {
       client.getNetworkSession().getClient().on('spawn', () => {
           setInterval(() => {
               let pk = new PlayerAuthInputPacket(
                   client.getPitch(),
                   client.getYaw(),
                   client.getPosition().asObject(),
                   {x: 0, z: 0},
                   client.getYaw(),
                   client.getInputData(),
                   'mouse',
                   'normal',
                   'touch',
                   undefined,
                   client.getNextTick(),
                   new Vector3(0, 0, 0).asObject(),
                   undefined,
                   undefined,
                   undefined
               );
               client.getNetworkSession().sendDataPacket(pk);
           }, 50);
       });
    }
}
module.exports = CorrectlyMoveHandler;