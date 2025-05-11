const ChoresDao = require("../../dao/chores-dao");
let dao = new ChoresDao();

const Ajv = require("ajv").default;
const { markChoreCompleteSchema } = require("../../schemas/chore-schemas");

async function MarkCompleteAbl(choreId, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(markChoreCompleteSchema, choreId);

    if (!valid) {
        return res.status(400).json({error: "Invalid input: " + ajv.errors});
    }

    const { data, status, error } = await dao.markChoreComplete(choreId);

    if (data && status === "OK") {
        res.status(201).json(data);
    } else {
        if (status === "ERROR-EMPTY") {
            res.status(404).json({error});
        }

        if (status === "ERROR-START_DATE") {
            res.status(400).json({error});
        }

        if (error) {
            res.status(500).json({error});
        }
    }
}

module.exports = MarkCompleteAbl;