const mongoose = require('mongoose');

const commentModel = require('../models/Comments');
const newsModel = require('../models/News');

const allComments = async(req,res)=>{
    try{
        let comments;
        if(req.role === 'admin'){
            comments = await commentModel.find()
                            .populate('article','title')
                            .sort({ createdAt : -1});
        }else{
            const news = await newsModel.find({ author: req.id});
            const newsIds = news.map(news =>news._id);
            comments = await commentModel.find({ author: { $in : newsIds}})
                            .populate('article','title')
                            .sort({ createdAt : -1});
           
        }
       //   res.json(comments);
         res.render('admin/comments',{ role:req.role, comments});
    }catch(error){
        next(error);
    }
}

const updateCommentStatus = async(req, res)=>{

}

const deleteComment = async(req,res)=>{

}

module.exports={
    allComments,
    updateCommentStatus,
    deleteComment
}