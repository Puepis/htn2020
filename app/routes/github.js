const express = require("express");
const router = express.Router();
const fs = require('fs');
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

const getBase64Encoded = (path) => {
    const buff = fs.readFileSync(path);
    const base64Data = buff.toString('base64');
    console.log("encoded data: \n\n", base64Data);
    return base64Data;
}

router.post("/createFile", async (req, res) => {
  const { owner, repo, path } = req.body;
  const commitMsg = "creating test file";
  const content = getBase64Encoded('./sample.txt');
  try {
    // get user info
    const user = await octokit.users.getAuthenticated();
    console.log(user);
    const { name, email } = user.data;

    // create file
    octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      commitMsg,
      content,
      name,
      email,
      name,
      email,
    });

    res.send(user);
  } catch (e) {
    console.error("something went wrong: ", e);
    res.sendStatus(401);
  }
});

module.exports = router;
