const mongoose = require("mongoose");
const categoryModel = require('../models/Category');

const allCategory = async(req,res)=>{
    const categoryData = await categoryModel.find();
    res.render('admin/categories',{categoryData, role:req.role});
}
const addCategoryPage = async(req,res)=>{
    res.render('admin/categories/create',{role:req.role});
}
const addCategory = async(req,res)=>{
    await categoryModel.create(req.body);
    res.redirect('/admin/category');
}
const updateCategoryPage = async(req,res,next)=>{
    const id = req.params.id;
    try{
        const category = await categoryModel.findById(id);
        if(!category){
            res.status(404).send('Category not found');
        }
       res.render('admin/categories/update',{ category , role: req.role});
    }catch(error){
       next(error);     
    }
   
}

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.redirect('/admin/category');
    } catch (error) {
        next(error);
    }
};


const deleteCategory = async(req,res)=>{
   const id = req.params.id;
   await categoryModel.findByIdAndDelete(id);
   res.redirect('/admin/category');
}

module.exports={
    allCategory,
    addCategoryPage,
    addCategory,
    updateCategoryPage,
    updateCategory,
    deleteCategory
}