const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express()

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs')

// database connection
const db = 'mongodb+srv://peter:Pr@716729@jwt-auth.hokqu.mongodb.net/auth?retryWrites=true&w=majority'
mongoose
	.connect(db, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB Connected"))
	.catch(err => console.log(err))

// route
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes)


// listen
const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})