const HTTPStatus = require('http-status');

const onRequestSuccess = (res, data) => res.status(HTTPStatus.OK).json({
  data,
});

const onRequestError = (res, { message }) => res.status(HTTPStatus.BAD_REQUEST).json({
  message,
});

module.exports = {
  onRequestSuccess,
  onRequestError,
};
