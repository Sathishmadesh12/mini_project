const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 
const state = require('../models/country.model');

const Number = sequelize.define('number', { 
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 
  },
  code: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  countryId: { 
    type: DataTypes.INTEGER,
    references: {
      model: 'countries', 
      key: 'id'       
    },
  }
});

module.exports = Number;
