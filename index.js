const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

//Middleware
app.use(cors());
app.use(express.json());

//port
const port = process.env.PORT || 5000;

//For knowing that server is working or not
app.get("/", (req, res) => {

    res.send("Server is Running....")

});

//For knowing which port we are use
app.listen(port, () => {

    console.log(`Server is running on port ${port}`);

})


//Connect to MongoDB

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofd8wu3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const carCollection = client.db('CarDB').collection('car');
        const brandCollection = client.db('brandDB').collection('brand');

        //Post car data 
        app.post('/car', async (req, res) => {


            const newCar = req.body;
            console.log(newCar)
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        })

        // Get Car Data

        app.get('/car', async (req, res) => {

            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result)

        })
        
        //Post Brand data 
        app.post('/brand', async (req, res) => {


            const newBrand = req.body;
            console.log(newBrand)
            const result = await brandCollection.insertOne(newBrand);
            res.send(result);
        })

        // Get Brand Data

        app.get('/brand', async (req, res) => {

            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result)

        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


