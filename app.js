const express = require('express');
const mongoose = require('mongoose');

const path = require('path');   

mongoose.connect('mongodb://127.0.0.1:27017/camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));  
db.once('open', function() {
    console.log('Database connected');
});

const app = express();


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', (req, res) => {
  res.render('home');
}); 

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});