import { CategoriesModel } from "../models/categories.model";
import { CategoryGroupModel } from "../models/category_group.model";
import { UsersModel } from "../models/users.model";
import { LogsModel } from "../models/logs.js"

export const getAllCategoryGroups = async (req, res) => {
    try {
        const CategoryGroups = await CategoriesModel.findAll();
        return res.json(CategoryGroups);
    } catch (error) {
        console.error('Error listing object types:', error);
        return res.status(500).json({ message: 'Failed to list object types', error });
    }
}

export const deleteCategoryGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user = await UsersModel.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ message: 'Sem permissão para deletar grupo de categoria' });
        }

        const categoryGroup = await CategoryGroupModel.findOne({ where: { id } });
        await LogsModel.create({  description: `${user.name} (${user.id}) deletou o grupo de categoria ${categoryGroup.name} (${categoryGroup.id})`, timeStamps: new Date(), event_type: "delete" });

        await CategoryGroupModel.destroy({ where: { id } });

        return res.json({ message: "Object type deleted successfully" });
    } catch (error) {
        console.error("Error deleting object type:", error);
        return res.status(500).json({ message: "Failed to delete object type" });
    }
};



export const getCategoryGroupById = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryGroup = await CategoryGroupModel.findOne({ where: { id } });

        if (!categoryGroup) {
            return res.status(404).json({ message: 'Category Group not found' });
        }

        return res.json(categoryGroup);
    } catch (error) {
        console.error('Error getting object type:', error);
        return res.status(500).json({ message: 'Failed to get object type', error });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoriesModel.findOne({ where: { id } },
            {
                include: [
                    { model: CategoriesModel, as: 'categoryGroup' },
                ],
            }
        );


        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.json(category);
    } catch (error) {
        console.error('Error getting object type:', error);
        return res.status(500).json({ message: 'Failed to get object type', error });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { name, CategoryGrupe_id } = req.body;

        const user = await UsersModel.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ message: 'Sem permissão para atualizar categoria' });
        }

        const category = await CategoriesModel.findOne({ where: { id } });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const categoryGroup = await CategoryGroupModel.findOne({ where: { id: CategoryGrupe_id } });
        if (!categoryGroup) {
            return res.status(404).json({ message: 'Category Group not found' });
        }

        await LogsModel.create({ description: `${user.name} (${user.id}) atualizou a categoria ${category.name} (${category.id}) para ${name}`, timeStamps: new Date(), event_type: "update" });

        category.name = name;
        category.CategoryGrupe_id = CategoryGrupe_id;
        category.description = `${name} - ${categoryGroup.name}`;

        await category.save();

        return res.json({
            id: category.id,
            name: category.name,
            CategoryGrupe_id: category.CategoryGrupe_id,
            description: category.description,
        });

    } catch (error) {
        console.error('Error updating object type:', error);
        return res.status(500).json({ message: 'Failed to update object type', error });
    }
}

export const updateCategoryGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { name } = req.body;

        const user = await UsersModel.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ message: 'Sem permissão para atualizar grupo de categoria' });
        }

        const categoryGroup = await CategoryGroupModel.findOne({ where: { id } });

        if (!categoryGroup) {
            return res.status(404).json({ message: 'Category Group not found' });
        }

        await LogsModel.create({ description: `${user.name} (${user.id}) atualizou o grupo de categoria ${categoryGroup.name} (${categoryGroup.id}) para ${name}`, timeStamps: new Date(), event_type: "update" });

        categoryGroup.name = name;

        await categoryGroup.save();

        return res.json({
            id: categoryGroup.id,
            name: categoryGroup.name,
        });

    } catch (error) {
        console.error('Error updating object type:', error);
        return res.status(500).json({ message: 'Failed to update object type', error });
    }
}