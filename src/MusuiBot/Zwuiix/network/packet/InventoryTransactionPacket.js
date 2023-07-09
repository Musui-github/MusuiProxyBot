const Packet = require("./Packet");

class InventoryTransactionPacket extends Packet
{
    constructor(
        type,
        action_type,
        slot,
        item,
        position,
        clickPosition,

        runtimeId,

        block_position,
        block_runtime_id,
        face
    ) {
        super("inventory_transaction");

        this.value = {
            transaction: {
                legacy: { legacy_request_id: 0, legacy_transactions: undefined },
                transaction_type: type,
                actions: [],
                transaction_data: {
                    action_type: action_type,
                    hotbar_slot: slot,
                    held_item: item,
                    player_pos: position,
                    click_pos: clickPosition,

                    entity_runtime_id: runtimeId,

                    block_position: block_position,
                    block_runtime_id: block_runtime_id,
                    face: face,
                }
            }
        };
    }

    getTransactionType()
    {
        return this.getValue().transaction.transaction_type;
    }

    getEntityRuntimeId()
    {
        return this.getValue().transaction.transaction_data.entity_runtime_id;
    }

    getActionType()
    {
        return this.getValue().transaction.transaction_data.action_type;
    }

    getHotbarSlot()
    {
        return this.getValue().transaction.transaction_data.hotbar_slot;
    }

    getItem()
    {
        return this.getValue().transaction.transaction_data.held_item;
    }

    getPosition()
    {
        return this.getValue().transaction.transaction_data.player_pos;
    }

    getClickPosition()
    {
        return this.getValue().transaction.transaction_data.click_pos;
    }
}
module.exports = InventoryTransactionPacket;