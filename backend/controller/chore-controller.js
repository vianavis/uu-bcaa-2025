const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/chore/create-abl");
const GetAbl = require("../abl/chore/get-abl");
const ListAbl = require("../abl/chore/list-abl");
const UpdateAbl = require("../abl/chore/update-abl");
const DeleteAbl = require("../abl/chore/delete-abl");
const MarkCompleteAbl = require("../abl/chore/mark-complete-abl");

router.get("/", async (req, res) => {
    const body = req.body;
    await ListAbl(body, res);
});

router.get("/:id", async (req, res) => {
    const choreId = req.params.id;
    await GetAbl(choreId, res);
});

router.post("/", async (req, res) => {
    const body = req.body;
    await CreateAbl(body, res);
})

router.put("/:id/update", async (req, res) => {
    const choreId = req.params.id;
    const body = req.body;
    await UpdateAbl(choreId, body, res);
})

router.put("/:id/complete", async (req, res) => {
    const choreId = req.params.id;
    await MarkCompleteAbl(choreId, res);
})

router.delete("/:id/delete", async (req, res) => {
    const choreId = req.params.id;
    await DeleteAbl(choreId, res);
})

module.exports = router;