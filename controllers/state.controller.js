const { Op } = require('sequelize');
const httpStatus = require('http-status');
const { StatusCodes } = require('http-status-codes'); // Import StatusCodes from the http-status-codes library
const State = require('../models/state.model'); 
const stateService = require('../services/state.service'); 

// Create a new state
const createState = async (req, res) => {
  try {
    console.log(req.body); // Log request body for debugging

    const { name, code, countryId, status } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or missing name.' });
    }
    if (!code || typeof code !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or missing code.' });
    }
    if (!countryId || typeof countryId !== 'number') {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or missing countryId.' });
    }
    if (status !== undefined && ![0, 1].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid status value.' });
    }

    // Create the State
    const state = await State.create({ name, code, countryId, status });
    return res.status(StatusCodes.CREATED).json({ message: 'State created successfully!', data: state });
  } catch (error) {
    console.error('Error creating state:', error); // Log error for debugging
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating state.', error: error.message });
  }
};


// Get all states with pagination and search
const getAllStates = async (req, res) => {
  try {
    // Get pagination and search parameters
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const search = req.query.search || '';

    // Define the query options for Sequelize
    const { count, rows } = await State.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%`, 
        },
      },
      limit,
      offset: (page - 1) * limit,
    });

    // Send the response with data and pagination info
    res.status(httpStatus.OK).json({
      message: 'States retrieved successfully!',
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    // Handle errors and send response
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving states.',
      error: error.message,
    });
  }
};

// Get a single state by ID
const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const state = await stateService.getStateById(id);
    if (state) {
      res.status(httpStatus.OK).json({
        message: 'State retrieved successfully!',
        data: state
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'State not found.'
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving state.',
      error: error.message
    });
  }
};

// Update a state by ID
const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, status, countryId } = req.body;
    const updatedState = await stateService.updateState(id, { name, code, status, countryId });
    if (updatedState) {
      res.status(httpStatus.OK).json({
        message: 'State updated successfully!',
        data: updatedState
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'State not found.'
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating state.',
      error: error.message
    });
  }
};

// Delete a state by ID
const deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await stateService.deleteState(id);
    if (deleted) {
      res.status(httpStatus.NO_CONTENT).json({
        message: 'State deleted successfully!'
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'State not found.'
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error deleting state.',
      error: error.message
    });
  }
};

module.exports = {
  createState,
  getAllStates,
  getStateById,
  updateState,
  deleteState
};
