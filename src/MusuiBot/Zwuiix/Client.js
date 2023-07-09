const Vector3 = require("./utils/math/Vector3");
const CorrectlyMoveHandler = require("./handler/CorrectlyMoveHandler");

class Client {
    /*** @type {NetworkSession}*/
    networkSession;

    /*** @type {Loader}*/
    loader;

    handler = new Map();

    yaw = 0;
    pitch = 0;
    position = new Vector3(0, 0, 0);
    tick = -0;
    input_data = {
        _value: 0,
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
        item_stack_request: false
    };

    constructor(NetworkSession, loader)
    {
        this.networkSession = NetworkSession;
        this.loader = loader;

        this.getHandler().set("correctlymovehandler", new CorrectlyMoveHandler(this));
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
}
module.exports = Client;