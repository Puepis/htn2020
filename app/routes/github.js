const express = require("express");
const router = express.Router();
const fs = require("fs");
const { default: generateOcto } = require("../util/github");

var token;

router.get("/authenticate", async (req, res) => {
  token = process.env.ACCESS_TOKEN;
});

router.get("/syncAuthToken", async (req, res) => {
  // store token
  res.send(200);
});

router.get("/listRepos", async (req, res) => {
  const octokit = generateOcto(token);
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
  const octokit = generateOcto(token);
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

const getBase64Encoded = (path) => {
  const buff = fs.readFileSync(path);
  const base64Data = buff.toString("base64");
  console.log("encoded data: ", base64Data);
  return base64Data;
};

router.post("/createFile", async (req, res) => {
  const octokit = generateOcto(token);
  const { repo, path } = req.body;
  console.log("repo: ", repo);
  console.log("path : ", path);
  const commitMsg = "creating test file";
  const content = getBase64Encoded("sample.txt");
  try {
    // get user info
    const user = await octokit.users.getAuthenticated();
    //console.log(user);
    const { login, name, email } = user.data;

    // create file
    const createRes = await octokit.repos.createOrUpdateFileContents({
      login,
      repo,
      path,
      commitMsg,
      content,
      name,
      email,
      name,
      email,
    });

    res.send(createRes);
  } catch (e) {
    console.error("something went wrong: ", e);
    res.sendStatus(401);
  }
});

module.exports = router;
