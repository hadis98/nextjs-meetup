import { MongoClient } from "mongodb";
// in api folder you can add js files
// the file names act as path segments in URL
//in this folder you don't create component functions

// in these files we define functions that contains server-side code

// api routes will only run on server
// functions in these files will trigger whenever a request is sent to this route:
//          /api/new-meetup
//          POST /api/new-meetup

//you should export handler function
const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body;

    // const { title, image, address, description } = data;
    const client = await MongoClient.connect(
      "mongodb+srv://hadis:0BThiAXozb65FOmo@mycluster.fd9u8.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data); //it gets an object
    client.close(); //close the connection
    res.status(201).json({ message: "Meetup inserted!" });
  }
};

export default handler;
