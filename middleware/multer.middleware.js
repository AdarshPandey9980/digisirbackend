import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(15, (err, bytes) => {
      const fileName = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fileName);
    });
  },
});

export const upload = multer({ storage });
