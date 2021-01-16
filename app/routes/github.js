const express = require("express");
const router = express.Router();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN,
  userAgent: "HTN2020 v1.0.0",
});

router.get("/listRepos", async (req, res) => {
  // authenticate user

  // fetch repos
  try {
    const repos = await octokit.repos.listForAuthenticatedUser();
    console.log(repos);
    res.send(repos);
  } catch (e) {
    res.sendStatus(401);
  }
});

module.exports = router;
