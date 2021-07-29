// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
import dotenv from 'dotenv';




// app config

const app = express();
const port = process.env.PORT || 9000;
dotenv.config({path:'./.env'});

const pusher = new Pusher({
    appId: "1242156",
    key: "57e7dbbda2fc579181de",
    secret: "e01d036bbdd71e698a14",
    cluster: "eu",
    useTLS: true
  });

// middlewares
app.use(express.json());
app.use(cors());





// database config
const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(()=> {
    console.log("connection successful...")
}).catch((err) => {
    console.log("connection failed... error => ", err)
});

const db = mongoose.connection;

db.once('open', ()=>{
    console.log("db is connected");

    const messageCollection = db.collection('messagecontents');
    const changeStream = messageCollection.watch();

    changeStream.on('change', (change)=>{
        console.log(change);

        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name:messageDetails.name,
                message:messageDetails.message,
                timestamp:messageDetails.timestamp,
                recieved:messageDetails.recieved
            });
        }else{
            console.log("Error triggering pusher");
        }
    });
});

// ?????

// api routes
app.get('/', (req,res) => {
    res.status(200).send("Hello world");
});

app.get('/messages/sync', (req,res) => {
    Messages.find((err,data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    })
})

app.post("/messages/new", (req,res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err,data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(`new message created \n ${data}`);
        }
    });
});

// listener

app.listen(port, ()=>console.log(`Server running at port numer ${port}`));
// fNRlnfOq7PUMGErI