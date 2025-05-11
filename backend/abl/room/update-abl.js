const RoomsDao = require("../../dao/rooms-dao");
let dao = new RoomsDao();

const Ajv = require("ajv").default;
const { idSchema, updateRoomSchema } = require("../../schemas/room-schemas");

async function UpdateAbl(roomId, body, res) {
    const ajv = new Ajv();
    const validId = ajv.validate(idSchema, roomId);
    const validBody = ajv.validate(updateRoomSchema, body);

    if (!validId || !validBody) {
        return res.status(400).json({error: ajv.errors});
    }

    const room = {
        name: body.name,
        description: body.description,
    }

    const { data, status, error } = await dao.updateRoom(roomId, room);

    if (data && status === "OK") {
        res.status(201).json(data);
    } else {
        if (status === "ERROR-EMPTY") {
            res.status(404).json({error: "Room not found."});
        }

        if (error) {
            res.status(500).json({error});
        }
    }

}

module.exports = UpdateAbl; 