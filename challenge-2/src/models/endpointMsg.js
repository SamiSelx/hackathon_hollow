//the response object must have a uniform structure for all endpoints.

const createResponse = (status, data, message) => {
          return {
              status: status,
              data: data,
              message: message
          };
      };
      
      module.exports = createResponse;