const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

client.setConfig({ apiKey: "9bcdbeb810e6016a3efa767ce67efea4-us21", server: "us21" });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

app.post("/", (req, res) => {
  let user = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.emailID,
  };

  const run = async () => {
    try {
      const response = await client.lists.batchListMembers("b83303a9c1", {
        members: [
          {
            email_address: user.email,
            status: "subscribed",
            merge_fields: {
              FNAME: user.firstName,
              LNAME: user.lastName,
            },
          },
        ],
      });
      console.log(response);
      if (response.errors.length > 0) {
        res.sendFile(__dirname + "/failure.html");
      } else res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});
// const data = {
//   members: [
//     {
//       email_address: email,
//       status: "subscribed",
//       merge_fields: {
//         FNAME: firstName,
//         LNAME: lastName,
//       },
//     },
//   ],
// };
// let jsonData = JSON.stringify(data);
// const url = "https://us21.api.mailchimp.com/3.0/lists/b83303a9c1";
// const options = {
//   method: "POST",
//   auth: "jay1:5d75db9407184f93c8b224794166b448-us21",
// };

// const request = https.request(url, options, function (response) {
//   response.on("data", function (data) {
//     console.log(JSON.parse(data));
//   });
// });
// request.write(jsonData);
// request.end();

//API Key
//5d75db9407184f93c8b224794166b448-us21

//List ID
//b83303a9c1
