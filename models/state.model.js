const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 
const Country = require('./country.model'); 
// Define the State model
const State = sequelize.define('state', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[0, 1]],
    },
    defaultValue: 1,
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'countries', 
      key: 'id',
    },
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE', 
  },
});

module.exports = State;
