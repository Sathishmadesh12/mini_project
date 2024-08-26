// models/country.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../routes/v1/country.route'); // Adjust the path as necessary

class Country extends Model {}

Country.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name cannot be empty"
      },
      len: {
        args: [2, 50],
        msg: "Name should be between 2 and 50 characters"
      }
    }
  },
  code: {
    type: DataTypes.INTEGER, // Changed to INTEGER
    allowNull: false,
    unique: {
      msg: "Code must be unique"
    },
    validate: {
      isInt: {
        msg: "Code must be an integer"
      },
      min: {
        args: [1],
        msg: "Code must be greater than 0"
      }
    }
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isIn: {
        args: [[0, 1]], // Assuming 0 and 1 are the only valid status values
        msg: "Status must be either 0 (inactive) or 1 (active)"
      }
    }
  }
}, {
  sequelize,
  modelName: 'Country'
});

module.exports = Country;
