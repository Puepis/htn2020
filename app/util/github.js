const { Octokit } = require("@octokit/rest");

const generateOcto = (token) => new Octokit({
  auth: token,
  userAgent: "HTN2020 v1.0.0",
});

module.exports = generateOcto;