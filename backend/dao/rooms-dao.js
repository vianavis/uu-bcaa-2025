"use strict";
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "rooms.json");

class RoomsDao {
  constructor(storagePath) {
    this.roomStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async getRoom(id) {
    const rooms = await this._loadAllRooms();

    const result = rooms.find(r => {
      return r.id === id;
    });

    return result;
  }

  async createRoom(room) {
    const rooms = await this._loadAllRooms();

    room = {
      ...room,
      id: this._generateId()
    }

    rooms.push(room);

    try {
      await wf(this._getStorageLocation(), JSON.stringify(rooms, null, 2));
      return { status: "OK", data: room };
    } catch (e) {
      return { status: "ERROR", error: e };
    }
  }

  async updateRoom(roomId, room) {
    const rooms = await this._loadAllRooms();
    const oldRoom = rooms.find(room => room.id === roomId);

    if (!oldRoom) {
      return { status: "ERROR-EMPTY", error: `No room found with id = ${roomId}` };
    }

    const newRoom = {
      name: room.name || oldRoom.name,
      description: room.description || oldRoom.description,
      id: roomId
    };

    const newRooms = rooms.filter(r => {
      return r.id !== roomId;
    });
    newRooms.push(newRoom);

    try {
      await wf(this._getStorageLocation(), JSON.stringify(newRooms, null, 2));
      return { status: "OK", data: newRoom };
    } catch (e) {
      return { status: "ERROR", error: e };
    }
  }

  async deleteRoom(roomId) {
    const rooms = await this._loadAllRooms();
    const newRooms = rooms.filter(r => {
      return r.id !== roomId;
    });

    try {
      if (rooms.length > newRooms.length) {
        await wf(this._getStorageLocation(), JSON.stringify(newRooms, null, 2));
        return { status: "OK" };
      } else {
        return { status: "ERROR-EMPTY", error: `No room found with id = ${roomId}`}
      }
    } catch (e) {
      return { status: "ERROR", error: e };
    }
  }

  async _loadAllRooms() {
    let rooms;
    try {
      rooms = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one...");
        rooms = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format. " +
          this._getStorageLocation());
      }
    }
    return rooms;
  }
  
  _getStorageLocation() {
    return this.roomStoragePath;
  }

  _generateId() {
    const id = uuid.v4();
    return id;
  }
}

module.exports = RoomsDao; 