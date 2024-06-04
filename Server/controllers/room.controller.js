import { RoomsModel } from "../models/room.model.js";

export const create = async (req, res) => {

    try {
        const { floor, room_name } = req.body;

        const existingRoom = await RoomsModel.findOne({ where: { room_name } })
        if (existingRoom) {
            return res.status(409).json({ message: 'Room already exists' });
        }   

        const room = await RoomsModel.create({ floor, room_name });

        return res.json({
            id: room.id,
            floor: room.floor,
            room_name: room.room_name,
        });
    }catch (error) {
        console.error('Error adding room:', error);
        return res.status(500).json({ message: 'Failed to add room', error });
    }
}

export const getAllRooms = async (req, res) => {
  try {
    const { sortOrder } = req.query;

    // Adicione opções de ordenação
    const order = [['name', sortOrder || 'ASC']]; 

    const rooms = await RoomsModel.findAll()
        

    return res.json(rooms);
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    return res.status(500).json({ message: "Failed to retrieve rooms" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the user
    await RoomsModel.destroy({ where: { id } });

    return res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({ message: "Failed to delete room" });
  }
};

