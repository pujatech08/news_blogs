const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const userModel = require('../models/User');
const newsModel = require('../models/News');
const categoryModel = require('../models/Category');
const settingModel = require('../models/Setting');

dotenv.config();

const loginPage = async (req, res) => {
    res.render('admin/login', {
        layout: false
    });
}
const adminLogin = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).send('Invalid username or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password');
        }

        const jwtData = { id: user._id, role: user.role, fullname: user.fullname }
        const token = jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.redirect('/admin/dashboard');
    } catch (error) {
        next(error);
    }

}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/');
}

const dashboard = async (req, res, next) => {
    try {
        let articleCount;
        if (req.role === 'admin') {
            articleCount = await newsModel.countDocuments();
        } else {
            articleCount = await newsModel.countDocuments({ author: req.id });
        }

        const usersCount = await userModel.countDocuments();
        const categoryCount = await categoryModel.countDocuments();
        res.render('admin/dashboard', { role: req.role, fullname: req.fullname, articleCount, usersCount, categoryCount });
    } catch (error) {
        next(error);

    }
}

const setting = async (req, res, next) => {
    try {
        const settings = await settingModel.findOne();
        res.render('admin/setting', { role: req.role, settings });
    }catch(error){
       next(error);
        
    }
}

const saveSettings = async (req, res, next) => {
    const { website_title, footer_description } = req.body;
    const website_logo = req.file ? req.file.filename : null;
    try {
        const settings = await settingModel.findOneAndUpdate(
            {},
            { website_title, website_logo, footer_description },
            { new: true, upsert: true }
        );
        res.redirect('/admin/setting');
    } catch (error) {
        next(error);

    }
}
const allUser = async (req, res) => {
    const userData = await userModel.find();
    res.render('admin/users', { userData, role: req.role });
}
const addUserPage = async (req, res) => {
    res.render('admin/users/create', { role: req.role });
}
const addUser = async (req, res) => {
    await userModel.create(req.body);
    res.redirect('/admin/users');
}
const updateUserPage = async (req, res, next) => {
    try {
        let user = await userModel.findById({ _id: req.params.id })
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('admin/users/update', { user, role: req.role });
    } catch (error) {
        next(error);
    }

}

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { fullname, password, role } = req.body;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            res.status(404).send('User not found');
        }
        user.fullname = fullname || user.fullname;
        if (password) {
            user.password = password;
        }
        user.role = role || user.role;

        await user.save();
        res.redirect('/admin/users');
    } catch (error) {
        next(error);

    }


}
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (!user) {
        res.status(404).send('user not found');
    }
    await user.deleteOne();
    res.redirect('/admin/users');
}

module.exports = {
    loginPage,
    adminLogin,
    logout,
    dashboard,
    setting,
    saveSettings,
    allUser,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
}