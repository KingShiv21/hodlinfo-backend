import express from "express";
import axios from "axios";
import { config } from "dotenv"
import cors from "cors"

config({
  path:"./data/config.env",
})

// creating server
const app = express();



// Using Middlewares
app.use(cors(
  {
      origin: [process.env.FRONT_URL]
  }
))



// api / route 
app.route("/").get(async (req, res) => {
  
  // fetching data from the given api
  let data
  await axios.get("https://api.wazirx.com/api/v2/tickers/")
    .then((res) => {
    data = res.data
    }).catch(
      err => console.log(err)
    )

  // converting data into array format
  let topTenResult = Object.values(data)
  
  
  //making featurs used for ejs file / home page
  const keys = Object.keys(data);

  let index ;

  let average = 0;
  for (index = 0; index < 10 ; index++) {
    average += Number(topTenResult[index].last)
  }
  average/=10;
  average = Math.trunc(average)



  let difference = []
  for ( index = 0; index < 10; index++) {
    difference[index] = Number(topTenResult[index].last) -average  
    difference[index] = Math.trunc(difference[index])
  }


  let percentage = []
  for ( index = 0; index < 10; index++) {
    if (difference[index] > 0) {
      percentage[index] = (difference[index] * 100)/Number(topTenResult[index].last)
    }
    else{
      percentage[index] = (difference[index] * 100)/average
    }
    percentage[index] = Math.trunc(percentage[index])
  }

  // rendering home page   
  res.status(200).json({
    records : topTenResult ,keys ,average , difference ,percentage
  })

})

app.listen(5000, () => {
  console.log("Server is working fine");
})
