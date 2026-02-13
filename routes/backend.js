const express = require("express");

const router = express.Router();

const userController     = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const articleController  = require('../controllers/articleController');
const commentController  = require('../controllers/commentController');
const isLoggedIn         = require('../middleware/isLoginedIn');
const isAdmin            = require('../middleware/isAdmin');
const upload             = require('../middleware/multer');
const isValid            = require('../middleware/validation');

// Login Route
router.get('/', userController.loginPage);
router.post('/index',isValid.loginValidation, userController.adminLogin);
router.get('/dashboard',isLoggedIn, userController.dashboard )
router.get('/setting',isLoggedIn,isAdmin, userController.setting )
router.post('/save-settings',isLoggedIn, isAdmin, upload.single('website_logo') , userController.saveSettings )
router.get('/logout', userController.logout);

// user Route
router.get('/users', isLoggedIn, isAdmin, userController.allUser);
router.get('/add-user', isLoggedIn, isAdmin, userController.addUserPage);
router.post('/add-user', isLoggedIn , isAdmin, userController.addUser);
router.get('/update-user/:id',  isLoggedIn, isAdmin, userController.updateUserPage);
router.post('/update-user/:id', isLoggedIn , isAdmin, userController.updateUser);
router.get('/delete-user/:id',  isLoggedIn , isAdmin, userController.deleteUser);

// Category Route
router.get('/category', isLoggedIn , isAdmin, categoryController.allCategory);
router.get('/add-category', isLoggedIn , isAdmin, categoryController.addCategoryPage);
router.post('/add-category', isLoggedIn , isAdmin, categoryController.addCategory);
router.get('/update-category/:id', isLoggedIn , isAdmin, categoryController.updateCategoryPage);
router.post('/update-category/:id', isLoggedIn , isAdmin, categoryController.updateCategory);
router.get('/delete-category/:id', isLoggedIn , isAdmin, categoryController.deleteCategory);

// Article Routes
router.get('/article', isLoggedIn , articleController.allArticle);
router.get('/add-article', isLoggedIn , articleController.addArticlePage);
router.post('/add-article', isLoggedIn , upload.single('image') , articleController.addArticle);
router.get('/update-article/:id', isLoggedIn , articleController.updateArticlePage);
router.post('/update-article/:id', isLoggedIn, upload.single('image') , articleController.updateArticle);
router.get('/delete-article/:id', isLoggedIn , articleController.deleteArticle);

//Comment Routes
router.get('/comments', isLoggedIn , commentController.allComments);
router.post('/update-comment-status/:id', isLoggedIn, commentController.updateCommentStatus);
router.delete('/delete-comment/:id', isLoggedIn, commentController.deleteComment);

// 404 Middleware
router.use(isLoggedIn,(req, res, next ) => {
    res.status(404).render('admin/404',{
        message:'Page not found', 
        role: req.role
    });
});

// 500 Middleware
router.use(isLoggedIn,(err, req, res, next ) => {
    res.status(500).render('admin/500',{
        message: err.message || 'Internal server error', 
        role: req.role
    });
});

// 500 Error Handler
// router.use((err, req,res,next)=>{
//     console.error(err.stack);
//     const status = err.status || 500;
//     // let view;
//     // switch(status){
//     //     case 401:
//     //         view = '404';
//     //         break;
//     //     case 404:
//     //         view ='404';
//     //         break;
//     //     case 500:
//     //         view='500';
//     //         break;
//     //     default:
//     //         view = '500';
//     // }

//     res.status(status).render(errors,{
//         message: err.message || 'Something went wrong',
//         status
//        // role : req.role
//     })
// });

module.exports = router;
