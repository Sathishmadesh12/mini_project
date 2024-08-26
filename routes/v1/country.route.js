const express = require('express');
const router = express.Router();
const countryController = require('../../controllers/country.controller');

// Create a new country
router.post('/', countryController.createCountry);

// Get all countries with pagination
router.get('/', countryController.getAllCountries);

// Get a country by ID
router.get('/:id', countryController.getCountryById);

// Update a country by ID
router.put('/:id', countryController.updateCountry);

// Delete a country by ID
router.delete('/:id', countryController.deleteCountry);

// Get countries by status (active/inactive)
router.get('/status/:status', countryController.getCountriesByStatus);

module.exports = router;
