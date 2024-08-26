const fs = require('fs');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const multer = require('multer');
const path = require('path');

// Ensure the 'uploads' directory exists
const ensureUploadsDirectoryExists = () => {
  const uploadDir = 'uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDirectoryExists();
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG images and PDF documents are allowed!'));
  }
};

// Initialize Multer with the configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, 
}).fields([
  { name: 'photo', maxCount: 1},
  { name: 'document', maxCount: 1 },
]);

// Sign up function
const signUp = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: err.message });
    }

    try {
      const { firstname, lastname, username, email, password, dateOfBirth, phoneNumber, role, gender, age, address } = req.body;

      if (!firstname || !lastname || !username || !role || !gender || !email || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: 'Firstname, email, and password are required.',
        });
      }

      const dateOfBirthParsed = new Date(dateOfBirth);
      if (isNaN(dateOfBirthParsed.getTime())) {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: 'Invalid date format for dateOfBirth.',
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: 'User already exists with this email.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        dateOfBirth: dateOfBirthParsed,
        phoneNumber,
        role,
        gender,
        age,
        photo: req.files['photo'] ? req.files['photo'][0].filename : null,
        document: req.files['document'] ? req.files['document'][0].filename : null,
        address,
      });

      res.status(httpStatus.CREATED).json({
        message: 'User created successfully!',
        data: user,
      });
    } catch (error) {
      console.error('Error details:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating user.',
      });
    }
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(httpStatus.OK).json({
      data: users,
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching users.',
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'User not found.',
      });
    }
    res.status(httpStatus.OK).json({
      data: user,
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching user.',
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: err.message });
    }

    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'User not found.',
        });
      }

      const { firstname, lastname, username, email, password, dateOfBirth, phoneNumber, role, gender, age, address } = req.body;

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      user.firstname = firstname || user.firstname;
      user.lastname = lastname || user.lastname;
      user.username = username || user.username;
      user.email = email || user.email;
      user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.role = role || user.role;
      user.gender = gender || user.gender;
      user.age = age || user.age;
      user.address = address || user.address;
      user.photo = req.files['photo'] ? req.files['photo'][0].filename : user.photo;
      user.document = req.files['document'] ? req.files['document'][0].filename : user.document;

      await user.save();

      res.status(httpStatus.OK).json({
        message: 'User updated successfully!',
        data: user,
      });
    } catch (error) {
      console.error('Error details:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating user.',
      });
    }
  });
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'User not found.',
      });
    }

    await user.destroy();
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    console.error('Error details:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error deleting user.',
    });
  }
};

// Export the controllers
module.exports = {
  signUp,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
