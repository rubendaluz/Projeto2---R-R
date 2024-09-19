import { LocationsModel } from "../models/locations.model.js";
// import { LogsModel } from "../models/Logs.model.js";

export const create = async (req, res) => {

    try {
        const { name, floor, building, description } = req.body;

        const existingRoom = await LocationsModel.findOne({ where: { name } })
        if (existingRoom) {
            return res.status(409).json({ message: 'Location already exists' });
        }   

        const room = await LocationsModel.create({ floor, name, building, description });

        return res.json({
            id: room.id,
            floor: room.floor,
            name: room.name,
            building: room.building
        });
    }catch (error) {
        console.error('Error adding room:', error);
        return res.status(500).json({ message: 'Failed to add room', error });
    }
}

export const getAllLocations = async (req, res) => {
  try {
    const { sortOrder } = req.query;

    // Adicione opções de ordenação
    const order = [['name', sortOrder || 'ASC']]; 

    const rooms = await LocationsModel.findAll()
        

    return res.json(rooms);
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    return res.status(500).json({ message: "Failed to retrieve rooms" });
  }
};

export const getLocationsbyId = async (req, res) => {
  try {
    const {id } = req.params;
    const locations = await LocationsModel.findByPk(id);
    return res.json(locations);
  } catch (error) {
    console.error("Error retrieving locations:", error);
    return res.status(500).json({ message: "Failed to retrieve locations" });
  }
}

export const getAllLocationByFloor = async (req, res) => {
  try {
    const { floor } = req.params;
    const locations = await LocationsModel.findAll({ where: { floor } });

    return res.json(locations);
  } catch (error) {
    console.error("Error retrieving locations:", error);
    return res.status(500).json({ message: "Failed to retrieve locations" });
  }
}

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the user
    await LocationsModel.destroy({ where: { id } });

    return res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({ message: "Failed to delete room" });
  }
};

export const updateLocation = async (req, res) => {
    try {
      // const { id } = req.params;
      const { floor, name, building } = req.body;
      // const user_id = req.user.id;

  
      const Location = await LocationsModel.findByPk(id);
      if (!Location) {
        return res.status(404).json({ message: "Location not found" });
      }
  
      // const user = await UsersModel.findByPk(user_id);
      // await LogsModel.create({ description: `${user.name} (${user.id}) atualizou a localização ${location.name} - Piso ${location.floor} para ${name} - Piso ${floor}`  , timeStamps: new Date() , event_type: "update" });
      
      Location.floor = floor;
      Location.name = name;
      Location.building = building;
      Location.description = `${name} - Piso ${floor}`;
  
      await Location.save();
  
      
      return res.json({
        id: Location.id,
        floor: Location.floor,
        name: Location.name,
        building: Location.building,
        description: Location.description,
      });
    } catch (error) {
      console.error("Error updating Location:", error);
      return res.status(500).json({ message: "Failed to update Location" });
    }
  };
