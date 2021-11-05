// Require File Decalration Below.........
const { MongoClient } = require('mongodb');
const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
// Backend Server Start Prot 
const port = process.env.PORT || 8000
// ID No Find
const objectId = require('mongodb').ObjectId
/*
* Database Information
* Name: travely2021
* Password: wQGsMjAeJ0QSEqqU
* */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@travely.zv2dn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database Function

async function travelyDB (){
    try{
        await client.connect();
        const dataBase = client.db('travely21')
        const toursCollection = dataBase.collection('tours')
        const bookingCollection = dataBase.collection('booking')
        // Post Tour API
        app.post('/add-tour', async (req,res)=>{
            const addTour = req.body
            const result = await toursCollection.insertOne(addTour)
            console.log("Backend Result: ", result)
            res.json(result)
        })

        // Get API
        app.get('/all-tours', async (req, res) =>{
            const allTours = toursCollection.find({})
            const result = await allTours.toArray()
            res.json(result)
        })
        // Details Tour Get API
        app.get('/tours/details/:id', async (req,res) =>{
            const id = req.params.id
            const query = {_id: objectId(id)}
            const result = await toursCollection.findOne(query)
            res.json(result)
        })
        // Order Get API
        app.post('/tour-booking', async (req, res)=>{
            const tourBooking = req.body
            const result = await bookingCollection.insertOne(tourBooking)
            res.json(result)
        })
        // My Tours GET API
        app.get('/my-tour/:uid', async (req, res)=>{
            const id= req.params.uid
            // console.log('User ID: ', id)
            const query = {userId: id}
            const result = await bookingCollection.find(query).toArray()
            console.log('user ID: ', result)
            res.json(result)
        })
        // My Tours Delete API
        app.delete('/my-tour/remove/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id: objectId(id)}
            const result = await bookingCollection.deleteOne(query)
            res.json(result)
        })



    }finally {

    }
}
travelyDB().catch(console.dir)




// Root Get API Declaration Below
app.get('/', async (req, res) =>{
    res.send('Backend Server Start Now')
})




app.listen(port, () =>{
    console.log(`'Backend Server Start at http://localhost:${port}`)
})
