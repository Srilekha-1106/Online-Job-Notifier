//importing all the dependencies required for the project
const webdriver = require("selenium-webdriver");
const cheerio = require("cheerio");
const cron = require("node-cron");
let shell = require("shelljs");
const nodemailer = require("nodemailer");
//To automate the process in the chrome
const driver = new webdriver.Builder().forBrowser("chrome").build();

const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const a = require("cors");

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.get("/", cors(), async(req,res)=>{
    res.send("This is working");
})
//Retreiving the inputs given by the user in the frontend
app.post("/post_name",async(req,res) => {
    let {e} = req.body
    let {l} = req.body
    let {j} = req.body
    let {t} = req.body
    let {d} = req.body
    console.log(e,l,j,t,d);
   const arr = t.split(":");
   if (arr[1]==="00"){
    arr[1]="0";
   }
  
  const r = {
    sunday: 0,
    monday : 1,
    tuesday: 2,
    wednesday : 3,
    thursday:4, 
    friday:5,
    saturday:6,
  }
  //concatinating the string to pass the input for cron job scheduler
  var s = arr[1] + " " + arr[0] + " * * * " + r[d];

//The async-await function waits until the data is received and as soon as the data is received,the process gets started.
async function getJobs(jobQuery, place) {
  try {
    const caseUrl = "https://in.indeed.com/jobs";
    //The base url is updates dynamically by the user inputs
    const url = caseUrl + "?q=" + jobQuery + "&l=" + place + "&from=searchOnHP";
    console.log("Url:", url);
    //After posting get request for the url,it waits till it receives a response,and then continues the procedure
    await driver.get(url);
    //The data from the indeed website in the form of html and it is unstructured.
    const html = await driver.getPageSource();
    //Parsing the unstructured data
    const $ = cheerio.load(html);

    //Specifying the attributes that must be present in the email
    //rawElements is an array of objects extracting all the details of jobs 
    const rawElements = {
      title: [...$(".jobTitle > a > span").contents()].map((el) => el.data),
      company: [...$("span.companyName").contents()].map((el) => el.data),
      location: [...$(".companyLocation").contents()].map((el) => el.data),
      description: [...$("div.job-snippet")].map((e) => cheerio.text($(e)).trim()),
      links: [...$(".jobTitle > a")].map(
        (a) => "https://in.indeed.com" + a.attribs.href
      ),
    };
    //printing the jobs that are stored with the help of map function
    const jobs = rawElements.title.map((_, i) => ({
      title: rawElements.title[i],
      company: rawElements.company[i],
      location: rawElements.location[i],
      description: (rawElements.description[i] || "").trim(),
      link: (rawElements.links[i] || "").trim(),
    }));
    console.log({ jobs });
    return jobs;
  } 
  finally {
    driver.quit();
  }
}

async function task() {
  let retrivedJobs = await getJobs(
    j,  /*role*/
    l /*location*/
  );
  console.log({ retrivedJobs });
  //Specifying the template of how the user get mails.
  const liEles = retrivedJobs.map(
    ({ title, company, location, description, link }) => `
          Title - ${title}
  
          Company - ${company}
  
          Location - ${location}
  
          Description-${description}
  
          Link-${link}
  
        `
  );
  //Giving the credentials
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "srilekhadevineedi@gmail.com",
      pass: "june242001",
    },
  });

  console.log(e);
  //Specifying what to send and whom to send
  const options = {
    from: "srilekhadevineedi@gmail.com",
    to: e,  /*email*/
    subject: "Your hunt for new jobs!",
    text: liEles.join("\n"),
  };
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Sent: " + info.response);
  });
}
task();
//Scheduling the mail updates by the time specified by the user
cron.schedule(s,function(){
    console.log("Schedule is running..");
    if(shell.exec(JSON.stringify(getJobs(j, l))).code!==0){
        console.log("something went wrong");
      task()
}
});

})
//Listening at the port number mentioned in the frontend axios.
app.listen(port, () =>{
  console.log('Listening at http://localhost:4000');
})