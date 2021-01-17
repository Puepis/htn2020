const { Octokit } = require("@octokit/rest");

module.exports.generateOcto = (token) => new Octokit({
  auth: token,
  userAgent: "HTN2020 v1.0.0",
});
