const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 

const User = sequelize.define('user', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'admin']],
    },
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  document: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  photo: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
});

module.exports = User;
