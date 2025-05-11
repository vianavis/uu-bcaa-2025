const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/room/create-abl");
const GetAbl = require("../abl/room/get-abl");
const ListAbl = require("../abl/room/list-abl");
const UpdateAbl = require("../abl/room/update-abl");
const DeleteAbl = require("../abl/room/delete-abl");

router.get("/", async (req, res) => {
    await ListAbl(res);
});

router.get("/:id", async (req, res) => {
    const roomId = req.params.id;
    await GetAbl(roomId, res);
});

router.post("/", async (req, res) => {
    const body = req.body;
    await CreateAbl(body, res);
})

router.put("/:id/update", async (req, res) => {
    const roomId = req.params.id;
    const body = req.body;
    await UpdateAbl(roomId, body, res);
})

router.delete("/:id/delete", async (req, res) => {
    const roomId = req.params.id;
    await DeleteAbl(roomId, res);
})

module.exports = router;