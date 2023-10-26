const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const BooksSchema = require('./models/Books')
const methodOverride = require('method-override')


mongoose.connect("mongodb://127.0.0.1:27017/library")

const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection Error..."))
db.once("open", () => {
    console.log("Connection Successfull!!")
})

const app = express()

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// Show all books
app.get("/", async (req, res) => {
    const data = await BooksSchema.find({});
    res.render("home", { data: data })
})

// Loading the form for creating a book
app.get('/add', (req, res) => {
    res.render('add_book')
})

// Creating book(Adding the book to database)
app.post("/", async (req, res) => {
    var book = new BooksSchema(req.body)
    await book.save().then((val) => {
        res.send("Added Successfully!!")
    }, (reason) => {
        res.send("Error!!" + reason)
    })
})

// Load form to update a book
app.get('/update/:id', async (req, res) => {
    try {
        var data = await BooksSchema.findById(req.params.id)
        res.render('update_book', { data })
    } catch {
        res.send("Error!")
    }
})

// Updating the book in the database
app.put('/:id', async (req, res) => {
    try {
        await BooksSchema.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/`)
    } catch {
        res.send("Error")
    }
})

// Deleting a book
app.delete("/:id", async (req, res) => {
    try {
        await BooksSchema.findByIdAndDelete(req.params.id)
        res.redirect("/")
    } catch {
        res.send("Book not found!")
    }
})

app.listen(3000, () => {
    console.log("Listening on port 3000!")
})
