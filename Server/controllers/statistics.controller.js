import { UsersModel } from "../models/users.model.js";
import { ObjectsModel } from "../models/objects.model.js";
import { CategoriesModel } from "../models/categories.model.js";
import { LocationsModel } from "../models/locations.model.js";
import { Detections } from "../models/detection.model.js";
import { projeto2_db } from "../config/context/database.js" 

export const listCounts = async (req, res) => {
  try {
    // Contar o número de ativos
    const assetsCount = await ObjectsModel.count();

    // Contar o número de utilizadores
    const usersCount = await UsersModel.count();

    const detectionsCount = await Detections.count();

    // Retornar os contadores em formato JSON
    return res.json({ assetsCount, usersCount, detectionsCount });
  } catch (error) {
    console.error('Error listing counts:', error);
    return res.status(500).json({ message: 'Failed to list counts', error });
  }
};

export const getCategoryDistributionData = async (req, res) => {
    try {
        // Consulta para obter a contagem de ativos por categoria
        const categories = await ObjectsModel.findAll({
            attributes: [
                'object_type_id', // ID do tipo de objeto
                [projeto2_db.fn('COUNT', projeto2_db.col('Objects.id')), 'count'] // Contagem de ativos
            ],
            include: [
                {
                    model: CategoriesModel,
                    as: 'objectType', // Alias definido na associação
                    attributes: ['name'] // Nome da categoria para o gráfico
                }
            ],
            group: ['objectType.id'] // Agrupa pelo ID do tipo de objeto
        });

        // Extraindo labels e valores para o gráfico
        const labels = categories.map(c => c.objectType.name || 'Desconhecido'); // Default para 'Desconhecido'
        const values = categories.map(c => c.get('count') || 0); // Default para 0

        // Retornar os dados em formato JSON
        res.json({
            labels: labels,
            values: values
        });
    } catch (error) {
        console.error('Error fetching category distribution data:', error);
        res.status(500).json({ message: 'Failed to fetch category distribution data', error });
    }
};

export const getRoomDistributionData = async (req, res) => {
    try {
        // Consulta para obter a contagem de ativos por sala
        const rooms = await LocationsModel.findAll({
            attributes: [
                [projeto2_db.col('room.room_name'), 'name'],
                [projeto2_db.fn('COUNT', projeto2_db.col('Objects.id')), 'count']
            ],
            include: [
                {
                    model: RoomsModel,
                    as: 'room', // Alias definido nas associações
                    attributes: [] // Não precisa de atributos do modelo RoomsModel aqui
                }
            ],
            group: ['room.name'] // Agrupa por nome da sala
        });

        // Extraindo labels e valores para o gráfico
        const labels = rooms.map(r => r.get('room_name'));
        const values = rooms.map(r => r.get('count'));

        // Retornar os dados em formato JSON
        res.json({
            labels: labels,
            values: values
        });
    } catch (error) {
        console.error('Error fetching room distribution data:', error);
        res.status(500).json({ message: 'Failed to fetch room distribution data', error });
    }
};