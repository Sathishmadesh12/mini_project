const { Op } = require('sequelize'); // Import Sequelize operators
const httpStatus = require('http-status');
const Country = require('../models/country.model');
const State =require('../models/state.model');
const Number =require('../models/number.model');

// const number =require('../models/number.model');

// Create a new country
const createCountry = async (req, res) => {
  try {
    const { name, code, status } = req.body;

    // Validate the status value
    if (status !== 'active' && status !== 'inactive') {
      return res.status(400).json({
        message: 'Invalid status value provided.',
      });
    }

    const country = await Country.create({ name, code, status });
    res.status(201).json({
      message: 'Country created successfully!',
      data: country
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating country.',
      error: error.message
    });
  }
};;

// Get all countries with pagination and search
const getAllCountries = async (req, res) => {
  try {
    // Extract query parameters
    const page = Math.max(+req.query.page || 1, 1);
    const limit = Math.max(+req.query.limit || 10, 1);
    const search = req.query.search || ''; 

    // Log query parameters for debugging
    console.log(`Page: ${page}, Limit: ${limit}, Search: ${search}`);

    // Fetch countries with pagination and search
    const { count, rows } = await Country.findAndCountAll({
      attributes: ['name', 'code', 'status', 'createdAt'], // Include only specific fields
      where: {
        name: {
          [Op.iLike]: `%${search}%`, // Case-insensitive search
        },
      },
      limit,
      offset: (page - 1) * limit,
    });

    // Send response
    res.status(httpStatus.OK).json({
      message: 'Countries retrieved successfully!',
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    // Log error details for debugging
    console.error('Error details:', error);

    // Send error response
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving countries.',
      error: error.message,
    });
  }
};

// Get a single country by ID
const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id, {   
      include: [
        { model: State, as: 'states' },          
        { model: Number, as: 'numbers' }         
      ]
    });

    if (country) {
      res.status(httpStatus.OK).json({
        message: 'Country retrieved successfully!',
        data: country,
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'Country not found.',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving country.',
      error: error.message,
    });
  }
};

// Update a country by ID
const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, status } = req.body;
    const [updated] = await Country.update({ name, code, status }, {
      where: { id },
    });
    if (updated) {
      const updatedCountry = await Country.findByPk(id);
      res.status(httpStatus.OK).json({
        message: 'Country updated successfully!',
        data: updatedCountry,
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'Country not found.',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating country.',
      error: error.message,
    });
  }
};

// Delete a country by ID
const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Country.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(httpStatus.NO_CONTENT).json({
        message: 'Country deleted successfully!',
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'Country not found.',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error deleting country.',
      error: error.message,
    });
  }
};

const getCountriesByStatus = async (req, res) => {
  try {
    const status = req.query.status; // Use query parameter instead of path parameter
    if (!status) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Status query parameter is required.',
      });
    }

    const statusInt = status.toLowerCase() === 'active' ? 1 : status.toLowerCase() === 'inactive' ? 0 : null;

    if (statusInt === null) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Invalid status value provided.',
      });
    }

    const countries = await Country.findAll({
      where: { status: statusInt },
    });

    res.status(httpStatus.OK).json({
      message: `Countries with status ${status} retrieved successfully!`,
      data: countries,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving countries by status.',
      error: error.message,
    });
  }
};

module.exports = {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
  getCountriesByStatus, 
  // getAllCountriesWithReferences
};
