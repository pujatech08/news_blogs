const mongoose = require('mongoose');
const userModel = require('../models/User');
const categoryModel = require('../models/Category');
const newsModel = require('../models/News');

const allArticle = async (req, res) => {
    let article;
    if(req.role === 'admin'){
       article = await newsModel.find().populate('category','name').populate('author','fullname');
    }else{
        article = await newsModel.find({ author: req.id}).populate('category','name').populate('author','fullname');
    }
    res.render('admin/articles', { article, role: req.role });
}
const addArticlePage = async (req, res) => {
    const categories = await categoryModel.find();
    res.render('admin/articles/create', { categories, role: req.role });
}
const addArticle = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;
        const article = new newsModel({
            title,
            content,
            category,
            author: req.id,
            image: req.file.filename
        });
        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        // console.log(error);
        // res.status(401).send('article not saved');
        next(error);

    }
}

const updateArticlePage = async (req, res, next) => {
    try {
        const article = await newsModel.findById(req.params.id).populate('category','name').populate('author','fullname');
        if (!article) {
            res.status(404).send('Articles not found');           
        }
        const categories = await categoryModel.find();
         res.render('admin/articles/update', { article,categories, role: req.role });
    } catch (error) {
        next(error)
    }
}
const updateArticle = async (req, res,next) => {
    const id = req.params.id;
    try{
       const { title, content, category} = req.body;
       const article = await newsModel.findById(id);
       if(!article){
         return res.stauts(404).send('Article not found');
       }
       article.title = title;
       article.content = content;
       article.category = category;
       if(req.file){
         article.image = req.file.filename;
       }
       await article.save();
       res.redirect('/admin/article');
    }catch(error){
       next(error);
        
    }
 }
const deleteArticle = async (req, res) => { 
    await newsModel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/article');
}

module.exports = {
    allArticle,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    deleteArticle
}
