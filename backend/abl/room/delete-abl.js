const RoomsDao = require("../../dao/rooms-dao");
let dao = new RoomsDao();

const Ajv = require("ajv").default;
const { deleteRoomSchema } = require("../../schemas/room-schemas");

async function DeleteAbl(roomId, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(deleteRoomSchema, roomId);

    if (!valid) {
        return res.status(400).json({error: ajv.errors});
    }

    const { status, error } = await dao.deleteRoom(roomId);

    if (status === "ERROR-EMPTY") {
        res.status(404).json({ error })
    }

    if (status === "ERROR") {
        res.status(500).json({ error })
    }

    res.status(200).json({ status: "Success" })
}

module.exports = DeleteAbl; 