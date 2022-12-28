const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Task management is running!");
});

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bathfkv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const addTaskCollection = client.db("taskManager").collection("addTask");

    // post method
    app.post("/addtasks", async (req, res) => {
      const task = req.body;
      const result = await addTaskCollection.insertOne(task);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.error());

app.listen(port, () => {
  console.log(`task management listening on port ${port}`);
});
