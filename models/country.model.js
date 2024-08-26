const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Update with your actual path
const state = require('./state.model');
const number = require('./number.model');

// Define the Country model
const Country = sequelize.define('country', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'), 
    allowNull: false,
    defaultValue: 'active', 
  },
});
module.exports = Country;
// Country.hasMany(state,{       //check the hasMany
//   as:"state",sourceKey:"id",foreignKey:"countryId" 
// });
