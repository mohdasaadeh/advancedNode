const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const requireLogin = require("../middlewares/requireLogin");
const keys = require("../config/keys");

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: "eu-north-1",
});

module.exports = (app) => {
  app.get("/api/upload", requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpg`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "advanced-node-mohdasaadeh",
        ContentType: "image/jpg",
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  });
};
