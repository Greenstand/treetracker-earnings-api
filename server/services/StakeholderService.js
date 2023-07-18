const axios = require('axios').default;

const TREETRACKER_STAKEHOLDER_API_URL =
  `${process.env.TREETRACKER_STAKEHOLDER_API_URL}/stakeholders` ||
  'http://treetracker-stakeholder-api.stakeholder-api/stakeholders';

const getStakeholderById = async (id) => {
  const response = await axios.get(`${TREETRACKER_STAKEHOLDER_API_URL}/${id}`);

  return response.data.stakeholders[0];
};

module.exports = { getStakeholderById };
