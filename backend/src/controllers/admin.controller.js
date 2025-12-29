const notImplementedResponse = (res) => {
  return res.status(501).json({ success: false, message: 'Not implemented', errors: [] });
};

const listUsers = async (req, res) => {
  // TODO: implement user listing logic
  return notImplementedResponse(res);
};

const activateUser = async (req, res) => {
  // TODO: implement user activation logic
  return notImplementedResponse(res);
};

const deactivateUser = async (req, res) => {
  // TODO: implement user deactivation logic
  return notImplementedResponse(res);
};

module.exports = { listUsers, activateUser, deactivateUser };
