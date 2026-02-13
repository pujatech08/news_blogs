
const categoryModel = require('../models/Category');
const newsModel     = require('../models/News');
const settingModel  = require('../models/Setting');

const loadCommonData = async(req, res, next)=>{
    try{
         const latestNews = await newsModel.find().populate('category',{'name':1,'slug':1})
                            .populate('author','fullname')
                            .sort({createAt: -1}).limit(5);
        
        const settingData   = await settingModel.findOne();
        const categoryInUse = await newsModel.distinct('category');
        const categories    = await categoryModel.find({'_id':{$in:categoryInUse}});
        res.locals.settingData = settingData;
        res.locals.categories  = categories;
        res.locals.latestNews  = latestNews;
        next();
    }catch(error){
        next(error);
    }
}

module.exports = loadCommonData;