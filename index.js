const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uc5p6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(cors())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteer-network").collection("event-list");
  const volunteerCollection = client.db("volunteer-network").collection("volunteer-registration");
  console.log("Connected Successfully");

  app.post('/addevent',(req, res) => {
    const newEvent = req.body;
    collection.insertOne(newEvent)
    .then((result) => {
        res.send(result.insertedCount > 0)
    })
    .catch(error => {
        console.log(error);
    })
  })

  app.get('/allevent', (req, res) => {
      collection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.get('/singleevent/:id', (req, res) => {
      collection.find({_id: ObjectId(req.params.id) })
      .toArray( (err, documents) => {
          res.send(documents[0])
      })
  })

  app.post('/volunteerRegistration', (req, res) => {
    const newRegistration = req.body;
    volunteerCollection.insertOne(newRegistration)
    .then((result) => {
        res.send(result.insertedCount > 0)
    })
    .catch(error => {
        console.log(error);
    })
  })

  app.get('/volunteerList', (req,res) => {
    volunteerCollection.find({})
    .toArray((err, documents) => {
        res.send(documents)
    })
  })

  app.get('/particularVolunteerEvent/:email', (req, res) => {
      volunteerCollection.find({email: req.params.email})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  app.delete('/delete/:id', (req, res) => {
    volunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })


});

app.get('/', (req,res) => {
    res.send("Hello Express!");
})

app.listen(port)