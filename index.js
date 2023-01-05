const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    //add task post method
    app.post("/addtasks", async (req, res) => {
      const task = req.body;
      const result = await addTaskCollection.insertOne(task);
      res.send(result);
    });

    //add task get method
    app.get("/gettasks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = addTaskCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });

    //add task details get method
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await addTaskCollection.find(filter).toArray();
      res.send(result);
    });

    //done task put method
    app.put("/donetask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          done: true,
        },
      };
      const result = await addTaskCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    //undone task put method
    app.put("/undonetask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          done: false,
        },
      };
      const result = await addTaskCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    //add task update method

    app.put("/edittask/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          task: req.body.task,
        },
      };
      const result = await addTaskCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //add task delete method
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addTaskCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.error());

app.listen(port, () => {
  console.log(`task management listening on port ${port}`);
});
