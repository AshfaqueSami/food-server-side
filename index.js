const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txbuo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("delicioumo");
    const packagesCollection = database.collection("packages");
    const bookingsCollection = database.collection("bookings");

    app.get("/packages", async (req, res) => {
      const query = packagesCollection.find({});
      const result = await query.toArray();
      res.json(result);
    });

    app.get("/allbookings", async (req, res) => {
      const query = bookingsCollection.find({});
      const result = await query.toArray();
      res.json(result);
    });

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const filter = bookingsCollection.find(query);
      const result = await filter.toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const doc = req.body;
      const result = await bookingsCollection.insertOne(doc);
      res.json(result);
    });

    app.post("/packages", async (req, res) => {
      const doc = req.body;
      const result = await packagesCollection.insertOne(doc);
      res.json(result);
    });

    app.delete("/bookings", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.json(result);
    });

    app.put("/bookings", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const updateStatus = {
        $set: {
          status: "Approved",
        },
      };
      const result = await bookingsCollection.updateOne(query, updateStatus);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome!!!");
});
app.listen(port, () => {
  console.log("listening to ", port);
});
