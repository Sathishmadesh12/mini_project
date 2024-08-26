const State = require('../models/state.model'); // Ensure this path is correct

// Create a new state
const createState = async (name, code, status, countryId) => {
  return await State.create({ name, code, status, countryId });
};

// Get all states with pagination
const getAllStates = async (page, limit) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await State.findAndCountAll({ limit, offset });
  return { count, rows };
};

// Get a single state by ID
const getStateById = async (id) => {
  return await State.findByPk(id);
};

// Update a state by ID
const updateState = async (id, name, code, status, countryId) => {
  const [updated] = await State.update({ name, code, status, countryId }, { where: { id } });
  if (updated) {
    return await State.findByPk(id);
  }
  return null;
};

// Delete a state by ID
const deleteState = async (id) => {
  return await State.destroy({ where: { id } });
};

module.exports = {
  createState,
  getAllStates,
  getStateById,
  updateState,
  deleteState
};
