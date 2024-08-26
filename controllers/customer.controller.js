const Customer = require('../models/customer.model'); 
const httpStatus = require('/home/developer/Desktop/boiler/node_modules/http-status');

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    // Ensure the request body is correctly formatted
    const { firstName, lastName, email, phoneNumber, address, status } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !address || status === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Missing required fields' });
    }

    // Create the customer
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      status
    });

    res.status(httpStatus.CREATED).json({
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error) {
    handleError(res, httpStatus.BAD_REQUEST, 'Error creating customer', error);
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
      const customers = await Customer.findAll({
        where: {
          Deleted: false 
        }
      });
  
      res.status(httpStatus.OK).json({
        message: 'Customers retrieved successfully',
        data: customers,
      });
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      handleError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving customers', error);
    }
  };


// Get a customer by ID
const getCustomerById = async (req, res) => {
    try {
      // Find the customer by ID, excluding those marked as deleted
      const customer = await Customer.findOne({
        where: {
          id: req.params.id,
          Deleted: false // Only fetch customers not marked as deleted
        }
      });
  
      if (customer) {
        res.status(httpStatus.OK).json({
          message: 'Customer retrieved successfully',
          data: customer,
        });
      } else {
        res.status(httpStatus.NOT_FOUND).json({ message: 'Customer not found or is deleted' });
      }
    } catch (error) {
      console.error('Error in getCustomerById:', error);
      handleError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving customer', error);
    }
  };
  
// Update a customer by ID
const updateCustomer = async (req, res) => {
  try {
    const [updated] = await Customer.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCustomer = await Customer.findByPk(req.params.id);
      res.status(httpStatus.OK).json({
        message: 'Customer updated successfully',
        data: updatedCustomer,
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({ message: 'Customer not found' });
    }
  } catch (error) {
    handleError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Error updating customer', error);
  }
};

// Delete a customer by ID (soft delete)
const deleteCustomer = async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
  
      if (customer) {
        await Customer.update(
          { Deleted: true },
          { where: { id: req.params.id } }
        );
  
        res.status(httpStatus.OK).json({
          message: 'Customer record marked as deleted.',
        });
      } else {
        res.status(httpStatus.NOT_FOUND).json({ message: 'Customer not found' });
      }
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      handleError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Error marking customer as deleted', error);
    }
  };
  
module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
