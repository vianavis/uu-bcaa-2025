const RoomsDao = require("../../dao/rooms-dao");
let dao = new RoomsDao();

async function ListAbl(res) {
    const rooms = await dao._loadAllRooms();

    res.json(rooms);
}

module.exports = ListAbl; 