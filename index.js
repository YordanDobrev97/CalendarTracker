const express = require('express')
const app = express()
const { engine } = require("express-handlebars");
const router = require('./controllers/routes')
const PORT = 5000

app.engine(
  "hbs",
  engine({
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.use('/', router)

app.listen(PORT, () => console.log(`Server listening at ${PORT} port...`))