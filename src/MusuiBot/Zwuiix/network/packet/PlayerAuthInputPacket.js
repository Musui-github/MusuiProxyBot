const Packet = require('./Packet');

class PlayerAuthInputPacket extends Packet
{
    constructor(
        pitch,
        yaw,
        position,
        move_vector,
        head_yaw,
        input_data,
        input_mode,
        play_mode,
        interaction_model,
        gaze_direction,
        tick,
        delta,
        transaction,
        item_stack_request,
        block_action,
        analog_move_vector,
    ) {
        super("player_auth_input");

        this.value = {
            pitch: pitch,
            yaw: yaw,
            position: position,
            move_vector: move_vector,
            head_yaw: head_yaw,
            input_data: input_data,
            input_mode: input_mode,
            play_mode: play_mode,
            interaction_model: interaction_model,
            gaze_direction: gaze_direction,
            tick: tick,
            delta: delta,
            transaction: transaction,
            item_stack_request: item_stack_request,
            block_action: block_action,
            analogue_move_vector: analog_move_vector
        };
    }

    getPitch()
    {
        return this.getValue().pitch;
    }

    getYaw()
    {
        return this.getValue().yaw;
    }

    getPosition()
    {
        return this.getValue().position;
    }

    getMoveVector()
    {
        return this.getValue().move_vector;
    }

    getHeadYaw()
    {
        return this.getValue().head_yaw;
    }

    getInputData()
    {
        return this.getValue().input_data;
    }

    getInputMode()
    {
        return this.getValue().input_mode;
    }

    getPlayMode()
    {
        return this.getValue().play_mode;
    }

    getInteractionModel()
    {
        return this.getValue().interaction_model;
    }

    getGazeDirection()
    {
        return this.getValue().gaze_direction;
    }

    getTick()
    {
        return this.getValue().tick;
    }

    getDelta()
    {
        return this.getValue().delta;
    }

    getTransaction()
    {
        return this.getValue().transaction;
    }

    getItemStackRequest()
    {
        return this.getValue().item_stack_request;
    }

    getBlockAction()
    {
        return this.getValue().block_action;
    }
}
module.exports = PlayerAuthInputPacket;