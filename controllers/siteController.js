const mongoose = require("mongoose");
const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const commentModel = require('../models/Comments');
const settingModel = require('../models/Setting');
const paginate = require('../utilits/paginate');
const Comments = require("../models/Comments");

const index = async (req, res) => {
    // const news = await newsModel.find()
    //              .populate('category',{'name':1,'slug':1})
    //              .populate('author','fullname')
    //              .sort({ createdAt: -1}); 
    const paginatedNews = await paginate(newsModel, {},
        req.query, {
        populate: [
            { path: 'category', select: 'name slug' },
            { path: 'author', select: 'fullname' }
        ],
        sort: '-createAt'
    })
    // res.json(paginatedNews);
    res.render('index', { paginatedNews, query: req.query });
}

const articleByCategories = async (req, res) => {
    const category = await categoryModel.findOne({ slug: req.params.name });
    if (!category) {
        return res.status(404).send('Category not found');
    }
    // const news = await newsModel.find({category : category._id})
    //              .populate('category',{'name':1,'slug':1})
    //              .populate('author','fullname')
    //              .sort({ createdAt: -1});
    const paginatedNews = await paginate(newsModel, { category: category._id },
        req.query, {
        populate: [
            { path: 'category', select: 'name slug' },
            { path: 'author', select: 'fullname' }
        ],
        sort: '-createAt'
    })

    res.render('category', { paginatedNews, category, query: req.query });
}

const singleArticle = async (req, res) => {
    const news = await newsModel.findById({ _id: req.params.id })
        .populate('category', { 'name': 1, 'slug': 1 })
        .populate('author', 'fullname')
        .sort({ createdAt: -1 });

    const comment = await commentModel.find({ article: req.params.id, status:'approved'}).sort('createdAt')
    res.render('single', { news ,comment});
}

const search = async (req, res) => {
    const searchQuery = req.query.search;
    // const news = await newsModel.find({
    //     $or: [
    //         { title: { $regex: searchQuery, $options: 'i' } },
    //         { content: { $regex: searchQuery, $options: 'i' } }
    //     ]
    // })
    //     .populate('category', { 'name': 1, 'slug': 1 })
    //     .populate('author', 'fullname')
    //     .sort({ createdAt: -1 });
    const paginatedNews = await paginate(newsModel, {
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { content: { $regex: searchQuery, $options: 'i' } }
        ]
    },
        req.query, {
        populate: [
            { path: 'category', select: 'name slug' },
            { path: 'author', select: 'fullname' }
        ],
        sort: '-createAt'
    })

    res.render('search', { paginatedNews, searchQuery, query: req.query });
}

const author = async (req, res) => {
    const author = await userModel.findOne({ _id: req.params.name });
    if (!author) {
        return res.status(404).send('Author not found')
    }
    // const news = await newsModel.find({ author: req.params.name})
    //              .populate('category',{'name':1,'slug':1})
    //              .populate('author','fullname')
    //              .sort({ createdAt: -1});
    const paginatedNews = await paginate(newsModel, { author: req.params.name },
        req.query, {
        populate: [
            { path: 'category', select: 'name slug' },
            { path: 'author', select: 'fullname' }
        ],
        sort: '-createAt'
    })

    res.render('author', { paginatedNews, author, query: req.query });
}

const addComment = async (req, res) => {
      const { name, email, content } = req.body;
      console.log(req.params.id);
      const comment = new commentModel({name, email,content, article: req.params.id})
      await comment.save();
     res.redirect(`/single/${req.params.id}`);
}

module.exports = {
    index,
    articleByCategories,
    singleArticle,
    search,
    author,
    addComment
}