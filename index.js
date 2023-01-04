const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
require('dotenv').config()



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_KEY}@cluster0.cvtbcrw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });

async function dbConnect(){
    try {
        await client.connect();
        console.log('Database Connected')
    } catch (error) {
        console.log(error);
        
    }
}
dbConnect();
const AllUser = client.db('meta').collection('users');
const Teams = client.db('meta').collection('team');

app.get('/users', async(req, res)=>{
    try {
        const cursor = AllUser.find({})
        const users = await cursor.toArray();
        const {q} = req.query;
        

  const keys = ["first_name", "gender", "domain"];
  

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
      
    );
  };
  

  q ? res.json({success:true, data:search(users)}) : res.json({success:true, data:users});
    } catch (error) {
        res.send({
            success:false,
            error:error.message
        })
        
    }

})
app.post('/team', async(req,res)=>{
    try {
        const teams = req.body;
        const result = await Teams.insertOne(teams);
        if(result){
            res.send({
                success:true,
                message: "Add Member Successful"

            })
        }
    } catch (error) {
        res.send({
            success:false,
            error:error.message
        })
        
    }
})
app.get('/team', async(req,res)=>{
    try {
        const cursor = Teams.find({});
        const result = await cursor.toArray()
        if(result){
            res.send({
                success:true,
                data:result

            })
        }
    } catch (error) {
        res.send({
            success:false,
            error:error.message
        })
        
    }
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})