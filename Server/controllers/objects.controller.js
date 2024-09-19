import { ObjectsModel } from "../models/objects.model.js";
import { CategoriesModel } from "../models/categories.model.js";
import { LocationsModel } from "../models/locations.model.js";
import { Detections } from "../models/detection.model.js"; 
import { addUHFTag } from "../utils/mqttListener.js";



export const create = async (req, res) => {
    try {
        const {name, room_id, object_type_id, description,uhfTag } = req.body;
        // const existingObject = await ObjectsModel.findOne({ where: { object_name } })
        // if (existingObject) {
        //     return res.status(409).json({ message: 'object already exists' });
        // }   

      const object = await ObjectsModel.create({
            name,
            room_id,
            object_type_id,
            description,
            uhfTag
        });

        return res.json({
          id: object.id,
          name: object.name,
          room: object.room_id,
          object_type_id: object.object_type_id,
          description: object.description,
          taguhf: object.uhfTag
        });
    }catch (error) {
        console.error('Error adding object:', error);
        return res.status(500).json({ message: 'Failed to add object', error });
    }
}

export const readUhfTag = async (req, res) => {
  try {
    const tag = await addUHFTag();
    res.json({ success: true, uhfTag: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const list = async (req, res) => {
  try {
    const objectsList = await ObjectsModel.findAll({
      include: [
        {
          model: LocationsModel,
          as: 'room',
          attributes: ['id', 'room_name'], // Ajuste os atributos conforme necessário
        },
        {
          model: CategoriesModel,
          as: 'objectType',
          attributes: ['id', 'name'], // Ajuste os atributos conforme necessário
        }
      ]
    });

    return res.json(objectsList);
  } catch (error) {
    console.error('Error listing objects:', error);
    return res.status(500).json({ message: 'Failed to list objects', error });
  }
};

export const editObject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,room_id,object_type_id,description,uhfTag} = req.body;

    await ObjectsModel.update({name,room_id,object_type_id,description,uhfTag}, { where: { id } });
    return res.json({ message: "Object updated successfully" });
  } catch (error) {
    console.error("Error updating object:", error);
    return res.status(500).json({ message: "Failed to update object" });
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

export const getObject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id (assuming it should be a positive integer)
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the object by primary key with associated room and objectType
    const object = await ObjectsModel.findOne({
      where: { id },
      include: [
        {
          model: LocationsModel,
          as: 'room',
          attributes: ['id', 'room_name'], // Adjust attributes as needed
        },
        {
          model: CategoriesModel,
          as: 'objectType',
          attributes: ['id', 'name'], // Adjust attributes as needed
        }
      ]
    });

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    return res.json(object);
  } catch (error) {
    console.error("Error retrieving object:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve object",
      error: error.message
    });
  }
};


export const createObjectType = async (req, res) => {

    try {
        const { name } = req.body;

        const existingObjectType = await CategoriesModel.findOne({ where: { name } })
        if (existingObjectType) {
            return res.status(409).json({ message: 'object type already exists' });
        }   

        const objectType = await CategoriesModel.create({name});

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
    
    await CategoriesModel.destroy({ where: { id } });

    return res.json({ message: "Object type deleted successfully" });
  } catch (error) {
    console.error("Error deleting object type:", error);
    return res.status(500).json({ message: "Failed to delete object type" });
  }
};

// Definindo a função assíncrona que lista os tipos de objetos
export const listTypes = async (req, res) => {
  try {
    // Usando o método estático findAll() do modelo CategoriesModel para obter todos os tipos de objetos
    const objectsTypeList = await CategoriesModel.findAll();

    // Retornando a lista de tipos de objetos como resposta JSON
    return res.json(objectsTypeList);
  } catch (error) {
    // Em caso de erro, logamos o erro no console
    console.error('Error listing objects:', error);

    // Retornamos uma resposta de erro 500 (Internal Server Error) com uma mensagem JSON
    return res.status(500).json({ message: 'Failed to list objects', error });
  }
};


export const listDetections = async (req, res) => {
  try {
    // Buscar todas as detecções no banco de dados
    const detectionList = await Detections.findAll({
      include: [
        {
          model: LocationsModel,
          as: 'old_room',
          attributes: ['room_name'], // Ajuste os atributos conforme necessário
        },
        {
          model: LocationsModel,
          as: 'new_room',
          attributes: ['room_name'], // Ajuste os atributos conforme necessário
        },
        {
          model: ObjectsModel,
          as: 'object',
          attributes: ['uhfTag', 'name'], // Ajuste os atributos conforme necessário
        }
      ]
    });

    // Retornar as detecções em formato JSON
    return res.json(detectionList);
  } catch (error) {
    console.error('Error listing detections:', error);
    return res.status(500).json({ message: 'Failed to list detections', error });
  }
};

export const listDetectionsId = async (req, res) => {
  try {
    const { id } = req.params; // Obter o ID do objeto a partir dos parâmetros da URL

    if (!id) {
      return res.status(400).json({ message: 'Object ID is required' });
    }

    // Buscar as detecções relacionadas ao objeto específico
    const detectionList = await Detections.findAll({
      where: { object_id: id }, // Filtrar as detecções pelo ID do objeto
      include: [
        {
          model: LocationsModel,
          as: 'old_room',
          attributes: ['room_name'], // Ajuste os atributos conforme necessário
        },
        {
          model: LocationsModel,
          as: 'new_room',
          attributes: ['room_name'], // Ajuste os atributos conforme necessário
        },
        {
          model: ObjectsModel,
          as: 'object',
          attributes: ['uhfTag', 'name'], // Ajuste os atributos conforme necessário
        }
      ]
    });

    // Verificar se alguma detecção foi encontrada
    if (detectionList.length === 0) {
      return res.status(404).json({ message: 'No detections found for the specified object' });
    }

    // Retornar as detecções em formato JSON
    return res.json(detectionList);
  } catch (error) {
    console.error('Error listing detections:', error);
    return res.status(500).json({ message: 'Failed to list detections', error });
  }
};

// Função para listar as 5 últimas detecções
export const listLastDetections = async (req, res) => {
  try {
    const detectionList = await Detections.findAll({
      include: [
        {
          model: LocationsModel,
          as: 'old_room',
          attributes: ['room_name']
        },
        {
          model: LocationsModel,
          as: 'new_room',
          attributes: ['room_name']
        },
        {
          model: ObjectsModel,
          as: 'object',
          attributes: ['uhfTag', 'name']
        }
      ],
      order: [['timestamp', 'DESC']], // Ordena por timestamp descendente
      limit: 5 // Limita a 5 resultados mais recentes
    });

    return res.json(detectionList);
  } catch (error) {
    console.error('Error listing detections:', error);
    return res.status(500).json({ message: 'Failed to fetch detections', error });
  }
};




