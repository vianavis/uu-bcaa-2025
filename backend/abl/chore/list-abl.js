const ChoresDao = require("../../dao/chores-dao");
let dao = new ChoresDao();

const Ajv = require("ajv").default;
const addFormats = require("ajv-formats")
const { listChoreSchema } = require("../../schemas/chore-schemas");

async function ListAbl(body, res) {
    const ajv = new Ajv();
    addFormats(ajv);
    const valid = ajv.validate(listChoreSchema, body);

    if (!valid) {
        return res.status(400).json({error: "Invalid input: " + ajv.errors});
    }

    const { data, status, error } = await dao.listChores(body);

    if (data && status === "OK") {
        res.status(201).json(data);
    } else {
        if (status === "ERROR-MISSING-DAYS_OF_WEEK") {
            res.status(400).json({error});
        }

        res.status(500).json({error});
    }
}

module.exports = ListAbl;