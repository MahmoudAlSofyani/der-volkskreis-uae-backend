const { PrismaClient } = require("@prisma/client");
const { generatDefaultError, imagesFileFilter } = require("../helpers/common");
const prisma = new PrismaClient();
const moment = require("moment");
const multer = require("multer");
fs = require("fs");

exports.uploadSingleImage = (req, res, next) => {
  try {
    const upload = multer({
      dest: "uploads/",
      fileFilter: imagesFileFilter,
    }).single("imageFile");

    upload(req, res, async (err) => {
      if (req.fileValidationError) {
        res.status(400).send({ msg: req.fileValidationError });
      } else {
        const { file } = req;

        if (file) {
          const _file = await prisma.file.create({
            data: {
              id: file.filename,
              filename: file.filename,
              type: file.mimetype,
            },
          });

          if (_file) {
            req.fileId = _file.id;

            next();
          }
        }
      }
    });
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    let { id } = req.params;

    const path = `${__basedir}/uploads/${id}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    const _file = await prisma.file.findUnique({ where: { id } });

    if (_file) {
      if (range) {
        const parts = range.replace(/bytes/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": _file.type,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        };

        res.writeHead(206, head);
        file.pip(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": _file.type,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
