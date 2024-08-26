const { model } = require('mongoose');
const Country = require('../models/country.model');
const state =require('../models/state.model');
// Create a new country
const createCountry = async (name, code, status) => {
  return await Country.create({ name, code, status });
};

// Get all countries with pagination
const getAllCountries = async (page, limit) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Country.findAndCountAll({ limit, offset });
  return { count, rows };
};

// Get a single country by ID
const getCountryById = async (id) => {
  return await Country.findByPk(id);
};

// Update a country by ID
const updateCountry = async (id, name, code, status) => {
  const [updated] = await Country.update({ name, code, status }, { where: { id } });
  if (updated) {
    return await Country.findByPk(id);
  }
  return null;
};

// Delete a country by ID
const deleteCountry = async (id) => {
  return await Country.destroy({ where: { id } });
};

// Get countries by status (active/inactive)
const getCountriesByStatus = async (status) => {
  return await Country.findAll({
    where: {
      status, // 1 for active, 0 for inactive
    },
  });
};

module.exports = {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
  getCountriesByStatus, // Renamed for clarity
};
