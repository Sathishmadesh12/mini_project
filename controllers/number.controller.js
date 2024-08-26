const httpStatus = require('http-status');
const Number = require('../models/number.model');
const Country = require('../models/country.model'); 
const state =require('../models/state.model');

// Create a new number
const createNumber = async (req, res) => {
    try {
      const { name, phoneNumber, country, status, code, countryId } = req.body;
  
      // Check if the provided countryId exists in the Country table
      const countryRecord = await Country.findByPk(countryId);
      if (!countryRecord) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid countryId: Country not found' });
      }
  
      // Create the new Number record
      const newNumber = await Number.create({ name, phoneNumber, country, status, code, countryId });
  
      // Return a success message along with the created record
      res.status(httpStatus.CREATED).json({
        message: 'Number created successfully!',
        data: newNumber
      });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };
  
// Get all numbers
const getAllNumbers = async (req, res) => {
  try {
    const numbers = await Number.findAll();
    res.status(httpStatus.OK).json(numbers);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Get number by ID
const getNumberById = async (req, res) => {
  try {
    const number = await Number.findByPk(req.params.id);
    if (number) {
      res.status(httpStatus.OK).json(number);
    } else {
      res.status(httpStatus.NOT_FOUND).json({ error: 'Number not found' });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Update a number by ID
const updateNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Number.update(req.body, { where: { id } });
    if (updated) {
      const updatedNumber = await Number.findByPk(id);
      res.status(httpStatus.OK).json(updatedNumber);
    } else {
      res.status(httpStatus.NOT_FOUND).json({ error: 'Number not found' });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Delete a number by ID
const deleteNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Number.destroy({ where: { id } });
    if (deleted) {
      res.status(httpStatus.NO_CONTENT).json();
    } else {
      res.status(httpStatus.NOT_FOUND).json({ error: 'Number not found' });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Export all the functions
module.exports = {
  createNumber,
  getAllNumbers,
  getNumberById,
  updateNumber,
  deleteNumber
};
