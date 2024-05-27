import { ObjectsModel } from "../models/objects.model.js";
import { ObjectTypeModel } from "../models/objectType.model.js";


export const create = async (req, res) => {

    try {
        const { room_id, object_type_id, description } = req.body;

        // const existingObject = await ObjectsModel.findOne({ where: { object_name } })
        // if (existingObject) {
        //     return res.status(409).json({ message: 'object already exists' });
        // }   

        const object = await ObjectsModel.create({
            room_id,
            object_type_id,
            description,
        });

        return res.json({
            id: object.id,
            object_type_id: object.object_type_id,
            description: object.description,
        });
    }catch (error) {
        console.error('Error adding object:', error);
        return res.status(500).json({ message: 'Failed to add object', error });
    }
}

export const list = async (req, res) => {

    try {
        const objectsList = await ObjectsModel.findAll()

        return res.json(objectsList)
    }catch(error) {
        console.error('Error listing objects:', error);
        return res.status(500).json({ message: 'Failed to list objects', error });
    }
    
}

export const deleteObject = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the user
    await ObjectsModel.destroy({ where: { id } });

    return res.json({ message: "Object deleted successfully" });
  } catch (error) {
    console.error("Error deleting object:", error);
    return res.status(500).json({ message: "Failed to delete object" });
  }
};

export const createObjectType = async (req, res) => {

    try {
        const { name } = req.body;

        const existingObjectType = await ObjectTypeModel.findOne({ where: { name } })
        if (existingObjectType) {
            return res.status(409).json({ message: 'object type already exists' });
        }   

        const objectType = await ObjectTypeModel.create({name});

        return res.json({
            id: objectType.id,
            name: objectType.name
        });
    }catch (error) {
        console.error('Error adding object type:', error);
        return res.status(500).json({ message: 'Failed to add object type', error });
    }
}

export const deleteObjectType = async (req, res) => {
  try {
    const { id } = req.params;
    
    await ObjectTypeModel.destroy({ where: { id } });

    return res.json({ message: "Object type deleted successfully" });
  } catch (error) {
    console.error("Error deleting object type:", error);
    return res.status(500).json({ message: "Failed to delete object type" });
  }
};