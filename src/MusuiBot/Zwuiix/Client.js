const {Vector3} = require("./utils/math/Vector3");
const Location = require("./utils/math/Location");
const CorrectlyMoveHandler = require("./handler/CorrectlyMoveHandler");
const StartGameHandler = require("./handler/StartGameHandler");
const InGamePacketHandler = require("./handler/InGamePacketHandler");
const World = require("./world/World");
const LevelSoundEventPacket = require("./network/packet/LevelSoundEventPacket");
const InventoryTransactionPacket = require("./network/packet/InventoryTransactionPacket");
const AnimatePacket = require("./network/packet/AnimatePacket");
const TextPacket = require("./network/packet/TextPacket");
const CommandHandler = require("./handler/CommandHandler");
const TargetCommand = require("./command/impl/TargetCommand");

class Client
{
    TAG_START_GAME_HANDLER = "startgamehandler"
    TAG_IN_GAME_HANDLER = "ingamepackethandler"
    TAG_CORRECTLY_MOVE_HANDLER = "correctlymovehandler"
    TAG_COMMAND_HANDLER = "commandhandler"
    TAG_MAX_REACH = 3.25;

    /*** @type {NetworkSession}*/
    networkSession;

    /*** @type {Loader}*/
    loader;

    handler = new Map();

    currentTarget = -1;
    canTarget = false;

    id = 0;

    yaw = 0;
    pitch = 0;
    position = new Vector3(0, 0, 0);
    tick = -0;
    input_data= {
        _value: 0n,
        ascend: false,
        descend: false,
        north_jump: false,
        jump_down: false,
        sprint_down: false,
        change_height: false,
        jumping: false,
        auto_jumping_in_water: false,
        sneaking: false,
        sneak_down: false,
        up: false,
        down: false,
        left: false,
        right: false,
        up_left: false,
        up_right: false,
        want_up: false,
        want_down: false,
        want_down_slow: false,
        want_up_slow: false,
        sprinting: false,
        ascend_block: false,
        descend_block: false,
        sneak_toggle_down: false,
        persist_sneak: false,
        start_sprinting: false,
        stop_sprinting: false,
        start_sneaking: false,
        stop_sneaking: false,
        start_swimming: false,
        stop_swimming: false,
        start_jumping: false,
        start_gliding: false,
        stop_gliding: false,
        item_interact: false,
        block_action: false,
        item_stack_request: false,
        handled_teleport: false,
        emoting: false
    };

    velocity = new Vector3(0, 0, 0);
    world = new World(this);
    gamemode = 0;
    constructor(NetworkSession, loader)
    {
        this.networkSession = NetworkSession;
        this.loader = loader;

        this.getHandler().set(this.TAG_START_GAME_HANDLER, new StartGameHandler(this));
        this.getHandler().set(this.TAG_IN_GAME_HANDLER, new InGamePacketHandler(this));
        this.getHandler().set(this.TAG_CORRECTLY_MOVE_HANDLER, new CorrectlyMoveHandler(this));
        this.getHandler().set(this.TAG_COMMAND_HANDLER, new CommandHandler(this));

        this.getCommandHandler().register(new TargetCommand());
    }

    getNetworkSession()
    {
        return this.networkSession;
    }

    getLoader()
    {
        return this.loader;
    }

    getHandler()
    {
        return this.handler;
    }

    getCommandHandler()
    {
        return this.getHandler().get(this.TAG_COMMAND_HANDLER);
    }

    getName()
    {
        return this.getNetworkSession().getExtraData().displayName;
    }

    getUUID()
    {
        return this.getNetworkSession().getExtraData().identity;
    }

    getXUID()
    {
        return this.getNetworkSession().getExtraData().XUID;
    }

    getTitleId()
    {
        return this.getNetworkSession().getExtraData().titleId;
    }

    getProtocol()
    {
        return this.getNetworkSession().getClient().version;
    }

    getId()
    {
        return this.id;
    }

    getCurrentTarget()
    {
        return this.currentTarget;
    }

    setCurrentTarget(target)
    {
        this.currentTarget = target;
    }

    hasTarget()
    {
        return this.currentTarget != -1;
    }

    getCanTarget()
    {
        return this.canTarget;
    }

    setTargeting(value)
    {
        this.canTarget = value;
    }

    getPitch()
    {
        return this.pitch;
    }

    setPitch(value)
    {
        this.pitch = value;
    }

    getYaw()
    {
        return this.yaw;
    }

    setYaw(value)
    {
        this.yaw = value;
    }

    getPosition()
    {
        return this.position;
    }

    setPosition(position)
    {
        this.position = position;
    }

    getLocation()
    {
        return new Location(this.getPosition().getX(), this.getPosition().getY(), this.getPosition().getZ(), this.getYaw(), this.getPitch());
    }

    getInputData()
    {
        return this.input_data;
    }

    isJumping()
    {
        return this.getInputData().jumping;
    }

    setJumping(value = true)
    {
        this.getInputData().jumping = value;
    }

    isSneaking()
    {
        return this.getInputData().sneaking;
    }

    setSneaking(value = true)
    {
        this.getInputData().sneaking = value;
    }

    isSprinting()
    {
        return this.getInputData().sprinting;
    }

    setSprinting(value = true)
    {
        this.getInputData().sprinting = value;
    }

    getTick()
    {
        return this.tick;
    }

    getNextTick()
    {
        return ++this.tick;
    }

    getWorld()
    {
        return this.world;
    }

    getGamemode()
    {
        return this.gamemode;
    }

    setGamemode(number)
    {
        this.gamemode = number;
    }

    attackEntity(entity)
    {
        /*this.getNetworkSession().sendServerBoundDataPacket(new LevelSoundEventPacket(
            'AttackNoDamage',
            this.getPosition(),
            0,
            false,
            false
        ));*/
        this.getNetworkSession().sendServerBoundDataPacket(new InventoryTransactionPacket(
            'item_use_on_entity',
            'attack',
            0,
            {network_id: 0},
            this.getPosition().asObject(),
            new Vector3(0,0,0).asObject(),
            entity.getRuntimeId()
        ));

        let swingPacket = new AnimatePacket(this.getId(), "swing_arm", 0);
        this.getNetworkSession().sendServerBoundDataPacket(swingPacket);
        this.getNetworkSession().sendClientBoundDataPacket(swingPacket);
    }

    canReachAttack(entity)
    {
        let distance = entity.getPosition().distance(this.getPosition());
        if(distance > this.TAG_MAX_REACH) {
            return false;
        }

        let directionVector = this.getLocation().getDirectionVector();
        let response = false;
        for(let i = 0.0; i <= this.TAG_MAX_REACH; i = i + 0.1){
            let pos = entity.getPosition();
            let x = directionVector.getX() * i + this.getPosition().getX();
            let y = directionVector.getY() * i + this.getPosition().getY();
            let z = directionVector.getZ() * i + this.getPosition().getZ();
            if(
                (Math.abs(Math.round(x) - Math.round(pos.getX())) <= this.TAG_MAX_REACH) &&
                (Math.abs(Math.round(y) - Math.round(pos.getY())) <= this.TAG_MAX_REACH) &&
                (Math.abs(Math.round(z) - Math.round(pos.getZ())) <= this.TAG_MAX_REACH)

            ) {
                response = true;
                break;
            }
        }

        return response;
    }

    rightClickWithSlot(slot)
    {
        let pk = new InventoryTransactionPacket(
            'item_use',
            'click_air',
            0,
            {network_id: 0},
            this.getPosition().asObject(),
            new Vector3(0,0,0).asObject(),
            undefined,
            new Vector3(0, 0, 0).asObject(),
            0,
            0,
        );
        this.getNetworkSession().sendServerBoundDataPacket(pk);
    }

    sendMessage(message, sendToServer)
    {
        let pkt = new TextPacket(sendToServer ? "chat" : "raw", message, this.getName(), this.getXUID(), "");
        sendToServer
            ? this.getNetworkSession().sendServerBoundDataPacket(pkt)
            : this.getNetworkSession().sendClientBoundDataPacket(pkt);
    }

    sendClientTipMessage(message)
    {
        let pkt = new TextPacket("tip", message, this.getName(), this.getXUID(), "");
        this.getNetworkSession().sendClientBoundDataPacket(pkt);
    }
}
module.exports = Client;