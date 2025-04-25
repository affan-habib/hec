/**
 * Pagination utility functions
 */

/**
 * Parse pagination parameters from request query
 * If pagination parameters are not provided or invalid, returns null (show all)
 * 
 * @param {Object} query - Express request query object
 * @param {Object} options - Pagination options
 * @param {number} options.defaultLimit - Default limit if not specified (default: 10)
 * @param {number} options.maxLimit - Maximum allowed limit (default: 100)
 * @returns {Object|null} - Pagination parameters or null if pagination is disabled
 */
const getPaginationParams = (query, options = {}) => {
  const { defaultLimit = 10, maxLimit = 100 } = options;
  
  // Check if pagination is explicitly disabled
  if (query.pagination === 'false' || query.pagination === '0') {
    return null;
  }
  
  // Parse page and limit parameters
  let page = parseInt(query.page);
  let limit = parseInt(query.limit);
  
  // Validate page
  if (isNaN(page) || page < 1) {
    // If page is not provided or invalid, check if limit is provided
    if (!isNaN(limit) && limit > 0) {
      // If only limit is provided, use default page
      page = 1;
    } else {
      // If neither page nor limit is provided, disable pagination
      return null;
    }
  }
  
  // Validate limit
  if (isNaN(limit) || limit < 1) {
    // If limit is not provided or invalid, check if page is provided
    if (page) {
      // If only page is provided, use default limit
      limit = defaultLimit;
    } else {
      // If neither page nor limit is provided, disable pagination
      return null;
    }
  }
  
  // Enforce maximum limit
  limit = Math.min(limit, maxLimit);
  
  // Calculate offset
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    offset
  };
};

/**
 * Create pagination metadata for response
 * 
 * @param {Object} pagination - Pagination parameters
 * @param {number} pagination.page - Current page
 * @param {number} pagination.limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} - Pagination metadata
 */
const getPaginationMetadata = (pagination, total) => {
  if (!pagination) {
    return {
      pagination: false,
      total
    };
  }
  
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  
  return {
    pagination: true,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Apply pagination to a Sequelize query options object
 * 
 * @param {Object} queryOptions - Sequelize query options
 * @param {Object|null} pagination - Pagination parameters or null to disable pagination
 * @returns {Object} - Updated query options
 */
const applyPagination = (queryOptions, pagination) => {
  if (!pagination) {
    return queryOptions;
  }
  
  return {
    ...queryOptions,
    limit: pagination.limit,
    offset: pagination.offset
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMetadata,
  applyPagination
};
