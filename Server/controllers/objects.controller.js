import { ObjectsModel } from "../models/objects.model.js";


export const create = async (req, res) => {

    try {
        const { room_id, object_type_id, description } = req.body;

        // const existingObject = await objectModel.findOne({ where: { object_name } })
        // if (existingobject) {
        //     return res.status(409).json({ message: 'object already exists' });
        // }   

        const object = await objectModel.create({
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