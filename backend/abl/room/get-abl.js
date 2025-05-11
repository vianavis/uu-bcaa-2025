const RoomsDao = require("../../dao/rooms-dao");
let dao = new RoomsDao();

const Ajv = require("ajv").default;
const { getRoomSchema } = require("../../schemas/room-schemas");

async function GetAbl(roomId, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(getRoomSchema, roomId);

    if (!valid) {
        return res.status(400).json({error: "Invalid input: " + ajv.errors});
    }

    const room = await dao.getRoom(roomId);

    if (!room) {
        return res.status(404).json({error: "Room not found"});
    }

    res.json(room);

}

module.exports = GetAbl; 