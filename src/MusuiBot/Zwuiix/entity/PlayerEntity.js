class PlayerEntity
{
    name;
    uuid;
    deviceId;
    deviceOs;
    runtimeId;
    position;
    rotation;

    constructor(
        name,
        uuid,
        runtimeId,
        position,
        rotation,
        deviceId,
        deviceOs,
    ) {
        this.name = name;
        this.uuid = uuid;
        this.runtimeId = runtimeId;
        this.position = position;
        this.rotation = rotation;
        this.deviceId = deviceId;
        this.deviceOs = deviceOs;
    }

    getName()
    {
        return this.name;
    }

    getUUID()
    {
        return this.uuid;
    }

    getRuntimeId()
    {
        return this.runtimeId;
    }

    getPosition()
    {
        return this.position;
    }

    setPosition(position)
    {
        this.position = position;
    }

    getRotation()
    {
        return this.rotation;
    }

    getDeviceId()
    {
        return this.deviceId;
    }

    getDeviceOs()
    {
        return this.deviceOs;
    }
}
module.exports = PlayerEntity;