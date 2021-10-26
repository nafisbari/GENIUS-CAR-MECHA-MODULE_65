const express = require('express');
const { MongoClient } = require('mongodb'); //mongo
require('dotenv').config(); //dotenv
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');


const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

// from mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkydx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri); //to check if it is working

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//node mongo theke async funtion creating
async function run() {
    //try and finally ta o imp tai eta function banayei boshay felbo
    try {
        await client.connect(); // client er sathe connect korlam
        console.log('Connected to database'); // to see client.connect ta kaj hoise ki na

        const database = client.db("carMechaninc"); // creating the database
        const servicesCollection = database.collection('services'); //creating collection


        // ********************************** //
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({}); //jehetu shobgulo ke find kortesi tai empty object dila,

            const services = await cursor.toArray(); //data ke array hishebe dewar jonno

            res.send(services); //to send the data and get it on my url
        })




        // ********************************** //
        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id; // to get the id
            console.log('Getting Specific Servcie', id); // to see je id ta pacchi ki na 

            const query = { _id: ObjectId(id) }; // kheyal kore korte hobe
            const service = await servicesCollection.findOne(query);//to get the single service
            res.json(service);
        })




        // ********************************** //
        //POST API
        app.post('/services', async (req, res) => {

            const service = req.body; //axios body theke data anlama

            console.log('hit the post api', service); // to see the data

            //eta ar lagbe na
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }

            const result = await servicesCollection.insertOne(service);// to insert data ekta ekta kore
            console.log(result); //to see the result on terminal
            res.json(result); // must
        })




        // ********************************** //
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })



    }
    finally {
        // await client.close(); // amader khetre na use korleo cholbe jehetu bar bar use korbo
    }
}
run().catch(console.dir); // // eta must konovabei miss kora jabe na // //


app.get('/', (req, res) => {
    res.send("Running Genius Server")
});

app.listen(port, () => {
    console.log("Running the Gineus Server on", port);
})