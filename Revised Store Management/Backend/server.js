// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const app = express();

// mongoose.connect('mongodb://localhost:27017/fileManager', { useNewUrlParser: true, useUnifiedTopology: true });

// const itemSchema = new mongoose.Schema({
//     id: String,
//     name: String,
//     status: String,
//     quantity: Number
// });

// const Item = mongoose.model('Item', itemSchema);

// app.use(bodyParser.json());

// app.post('/saveItem', (req, res) => {
//     const { id, name, status, quantity } = req.body;
//     Item.findOneAndUpdate({ id }, { name, status, quantity }, { upsert: true }, (err, item) => {
//         if (err) return res.status(500).send(err);
//         return res.status(200).send('Item saved');
//     });
// });

// app.get('/getItems', (req, res) => {
//     Item.find({}, (err, items) => {
//         if (err) return res.status(500).send(err);
//         return res.status(200).send(items);
//     });
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });
