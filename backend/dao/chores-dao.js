"use strict";
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const RoomsDao = require("./rooms-dao");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "chores.json");

class ChoresDao {
  constructor(storagePath) {
    this.choreStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async getChore(id) {
    const chores = await this._loadAllChores();

    const result = chores.find(r => {
      return r.id === id;
    });

    return result;
  }

  async markChoreComplete(choreId) {
    let chores = await this._loadAllChores();

    const chore = chores.find(r => {
      return r.id === choreId;
    });

    if (!chore) {
        return { status: "ERROR-EMPTY", error: `No chore found with id = ${choreId}`};
    }

    // check that the chore has started
    if (new Date(chore.startDate) > new Date()) {
        return { status: "ERROR-START_DATE", error: "Chore has not yet started"};
    }

    const choreIndex = chores.indexOf(chore);
    const newChore = {
        ...chores[choreIndex],
        dateCompleted: new Date().toISOString()
    }
    chores = chores.filter((c, i) => i !== choreIndex);
    chores.push(newChore);
    
    try {
        await wf(this._getStorageLocation(), JSON.stringify(chores, null, 2));
        return { status: "OK", data: newChore };
    } catch (e) {
        return { status: "ERROR", error: e };
    }
    
  }

  async listChores(filters) {
    const chores = await this._loadAllChores();

    filteredChores = chores.filter((chore, i) => {
        // TODO showPending
        const matchPending = true;

        const directFilters = ["name", "description", "startDate"];
        const matchDirect = directFilters.every(key => !filters[key] ? true : filters[key] === chore[key]);

        const anyFilters = ["roomId", "repeatType", "timeOfDay"];
        const matchAny = anyFilters.every(key => !filters[key] ? true : filters[key].includes(chore[key]));

        const anyOfAnyFilters = ["daysOfWeek"];
        const matchAnyOfAny = anyOfAnyFilters.every(key => !filters[key] ? true : filters[key].some(f => chore[key].includes(f)));
    
        const dateRangeFilters = ["dateCompleted"];
        const matchDateRange = dateRangeFilters.every(key => !filters[key] ? true : new Date(chore[key]) >= new Date(filters[key].start) && new Date(chore[key]) <= new Date(filters[key].end));
    
        return matchDirect && matchAny && matchAnyOfAny && matchDateRange && matchPending;
    })
  }

  async createChore(chore) {
    let roomsDao = new RoomsDao();
    const rooms = await roomsDao._loadAllRooms();
    const assignedRoom = rooms.find(r => r.id === chore.roomId);

    if (!assignedRoom) {
        return {status: "ERROR-INVALID-ROOM_ID", error: "Invalid room id: room does not exist"};
    }

    const newChore = {
        ...chore,
        id: this._generateId()
    }

    const chores = await this._loadAllChores();

    chores.push(newChore);

    try {
      await wf(this._getStorageLocation(), JSON.stringify(chores, null, 2));
      return { status: "OK", data: newChore };
    } catch (e) {
      return { status: "ERROR", error: e };
    }
  }

  async updateChore(choreId, chore) {
    const chores = await this._loadAllChores();
    const oldChore = chores.find(chore => chore.id === choreId);

    if (!oldChore) {
      return { status: "ERROR-EMPTY", error: `No chore found with id = ${choreId}` };
    }

    if (chore.roomId && chore.roomId !== oldChore.roomId) {
        let roomsDao = new RoomsDao();
        const rooms = await roomsDao._loadAllRooms();
        const assignedRoom = rooms.find(r => r.id === chore.roomId);

        if (!assignedRoom) {
            return {status: "ERROR-INVALID-ROOM_ID", error: "Invalid room id: room does not exist"};
        }
    }

    if (chore.repeatType === "weekly" && oldChore.repeatType !== "weekly") {
        if (!chore.daysOfWeek) {
            return {status: "ERROR-MISSING-DAYS_OF_WEEK", error: "Missing daysOfWeek for weekly repeat type"};
        }
    }

    const newChore = {
        ...oldChore,
        name: chore.name || oldChore.name,
        description: chore.description || oldChore.description,
        roomId: chore.roomId || oldChore.roomId,
        startDate: chore.startDate || oldChore.startDate,
        repeatType: chore.repeatType || oldChore.repeatType,
        daysOfWeek: (chore.repeatType === "weekly" || oldChore.repeatType === "weekly") ? chore.daysOfWeek : oldChore.daysOfWeek,
        timeOfDay: chore.timeOfDay || oldChore.timeOfDay,
    }

    const newChores = chores.filter(c => {
      return c.id !== choreId;
    });
    newChores.push(newChore);

    try {
      await wf(this._getStorageLocation(), JSON.stringify(newChores, null, 2));
      return { status: "OK", data: newChore };
    } catch (e) {
      return { status: "ERROR", error: e };
    }
  }

  async deleteChore(choreId) {
    const chores = await this._loadAllChores();
    const newChores = chores.filter(c => {
      return c.id !== choreId;
    });

    try {
      if (chores.length > newChores.length) {
        await wf(this._getStorageLocation(), JSON.stringify(newChores, null, 2));
        return { status: "OK" };
      } else {
        return { status: "ERROR-EMPTY", error: `No chore found with id = ${choreId}`}
      }
    } catch (e) {
      return { status: "ERROR", error: e };
    }
  }

  async _loadAllChores() {
    let chores;
    try {
      chores = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one...");
        chores = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format. " +
          this._getStorageLocation());
      }
    }
    return chores;
  }
  
  _getStorageLocation() {
    return this.choreStoragePath;
  }

  _generateId() {
    const id = uuid.v4();
    return id;
  }
}

module.exports = ChoresDao; 