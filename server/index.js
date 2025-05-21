const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

// eslint-disable-next-line no-undef
const videoDirectory = path.join(__dirname, "..", "assets", "videos");

// Replace localhost with the local IP address of your machine to access the server from other devices
const HOST_URL = "http://localhost:3000";

app.get("/videos", (req, res) => {
  fs.readdir(videoDirectory, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory.");
    }

    const videos = files
      .filter((file) => file.endsWith(".mp4"))
      .map((file) => ({
        name: `Video ${file.split(".")[0]}`,
        description: `Description of video ${file.split(".")[0]}`,
        url: `${HOST_URL}/video/${file}`,
      }));

    res.setHeader("Content-Type", "application/json");

    res.json(videos);
  });
});

app.get("/video/:name", (req, res) => {
  const videoPath = path.join(videoDirectory, req.params.name);

  fs.access(videoPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("Video not found.");
    }

    res.setHeader("Content-Type", "video/mp4");

    res.sendFile(videoPath);
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log(`Server is running at ${HOST_URL}`);
});
