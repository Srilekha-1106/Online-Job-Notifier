const express = require("express");

const app = express();
const port = 4000;
const cors = require("cors")

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.get("/", cors(), async(req,res)=>{
    res.send("This is working");
})

app.post("/post_name",async(req,res) => {
    let {e} = req.body
    let {l} = req.body
    let {j} = req.body
    let {t} = req.body
    console.log(e,l,j,t);
})

app.listen(port, () =>{
    console.log('Listening at http://localhost:4000');
})