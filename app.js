const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');   


mongoose.connect('mongodb://localhost:27017/camp',)


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', (req, res) => {
  res.render('home');
}); 

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});