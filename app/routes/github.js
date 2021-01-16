const express = require("express");
const router = express.Router();
const { Octokit } = require("@octokit/rest");
const { route } = require("./test");

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
    console.error("List repos error: ", e);
    res.sendStatus(401);
  }
});

router.post("/createRepo", async (req, res) => {
  const name = req.query.name;
  // create github repo
  try {
    const createRes = await octokit.repos.createForAuthenticatedUser({
      name,
    });
    console.log(createRes);
    res.send(createRes);
  } catch (e) {
    console.error("Create repo error: ", e);
    res.sendStatus(401);
  }
});

const getUser = async () => {
  try {
    const res = await octokit.users.getAuthenticated();
    console.log(res);
    return res;
  } catch (e) {
    console.error("couldn't get user: ", e);
  }
};

router.post("/createFile", async (req, res) => {
  const { owner, repo, folder } = req.body;
  const commitMsg = "creating test file";
  try {
    const user = await octokit.users.getAuthenticated();
    console.log(user);
    res.send(user);
  } catch (e) {
    console.error("something went wrong: ", e);
    res.sendStatus(401);
  }
});

module.exports = router;
