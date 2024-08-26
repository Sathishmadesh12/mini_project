const Country = require('./country.model');
const State = require('./state.model');
const Number = require('./number.model');

// Define associations
Country.hasMany(State, { as: 'states', foreignKey: 'countryId' });
Country.hasMany(Number, { as: 'numbers', foreignKey: 'countryId' });

State.belongsTo(Country, { as: 'countries', foreignKey: 'countryId' });
Number.belongsTo(Country, { as: 'countries', foreignKey: 'countryId' });

module.exports = { Country, State, Number };
