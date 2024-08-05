import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import cors from 'cors';

dotenv.config()
const port = 3000
const app = express()
app.use(bodyParser.json())
app.use(cors())

const url = process.env.MONGO_URI
const client = new MongoClient(url)
await client.connect();

const dbName = "passvault"

// get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("passwords")
    const result = await collection.find({}).toArray();
    res.json(result)
})

// save a password
app.post('/', async (req, res) => {
    const newPasswordRecord  = req.body;
    console.log(req.body)
    const db = client.db(dbName);
    const collection = db.collection("passwords")
    const result = await collection.insertOne(newPasswordRecord);
    res.json(result)
})

// delete a password
app.delete('/', async (req, res) => {
    const newPasswordRecord  = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords")
    const result = await collection.deleteOne(newPasswordRecord);
    res.json(result)
})

app.listen(port, () => {
    console.log("Example app http")
})