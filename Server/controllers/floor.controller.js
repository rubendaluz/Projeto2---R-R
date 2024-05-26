import { FloorModel } from "../models/floor.model.js";


export const create = async (req, res) => {

    try {
        const { floor_name } = req.body;

        const existingFloor = await FloorModel.findOne({ where: { floor_name } })
        if (existingFloor) {
            return res.status(409).json({ message: 'Floor already exists' });
        }   

        const floor = await FloorModel.create({ floor_name });

        return res.json({
            id: floor.id,
            floor_name: floor.floor_name,
        });
    }catch (error) {
        console.error('Error adding florr:', error);
        return res.status(500).json({ message: 'Failed to add floor', error });
    }
}

export const deleteFloor = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the user
    await FloorModel.destroy({ where: { id } });

    return res.json({ message: "Floor deleted successfully" });
  } catch (error) {
    console.error("Error deleting floor:", error);
    return res.status(500).json({ message: "Failed to delete floor" });
  }
};