/*

1. upload single file
2. upload multiple files
3. download a file

*/

const express = require("express")
const multer = require("multer")
const { writeFile, createReadStream } = require("fs-extra")
const { join } = require("path")

const router = express.Router()

const upload = multer({})

const studentsFolderPath = join(__dirname, "../../../public/img/students")

// 1.
router.post("/upload", upload.single("avatar"), async (req, res, next) => {
  // req.file <-- here is where we're gonna find the file
  console.log(req.file.buffer)
  try {
    await writeFile(
      join(studentsFolderPath, req.file.originalname),
      req.file.buffer
    )
  } catch (error) {
    console.log(error)
  }
  res.send("ok")
})

// 2.
router.post(
  "/uploadMultiple",
  upload.array("multipleAvatar", 2),
  async (req, res, next) => {
    // req.files <-- here is where we're gonna find the files
    try {
      const arrayOfPromises = req.files.map((file) =>
        writeFile(join(studentsFolderPath, file.originalname), file.buffer)
      )
      await Promise.all(arrayOfPromises)
      res.send("ok")
    } catch (error) {
      console.log(error)
    }
  }
)

// 3.
router.get("/:name/download", (req, res, next) => {
  // file as a stream (source) [--> transform optional] --> response (destination)
  const source = createReadStream(
    join(studentsFolderPath, `${req.params.name}`)
  )
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.params.name}`
  ) // please open "Save file to disk window" in browsers
  source.pipe(res)

  source.on("error", (error) => {
    next(error)
  })
})

module.exports = router
