// Use inquirer npm package to get answers to command line questions as the answers will be the data passed to the writeToFile npm package
var inquirer = require("inquirer");

// Need the node filesystem module to run writeToFile
var fs = require("fs");

// Need this to convert html to PDF
var pdf = require('html-pdf');


// Need this so when call the generateHTML function it knows which js file to use
var generateHTML = require("./generateHTML.js");

// Need axios to make API call
const axios = require("axios");


// function init() {
inquirer
    .prompt([
        {
            type: "input",
            message: "What is your Github user name?",
            name: "githubName"
        },

        {
            type: "list",
            message: "Choose a background color for the cards",
            // This array is set so the user can choose a background color for the cards
            // these colors are the ones set in the generateHTML.js
            choices: ["green", "blue", "pink", "red"],
            name: "color"
        }
    ])


    .then(function (response) {


        // console.log(response);


        axios
            .get("https://api.github.com/users/" + response.githubName)
            // response (in this case the variable is res) will have LOTS of data
            .then(function (res) {

                // axios always stores the return from the get in to the .data field for the variable
                // can look at the specific data want
                // console.log(res.data);

                // create one object as generateHTML can take one argument.  Combine the two responses


                // this call goes one level further to get the repo data based on the response from the first axios request
                axios
                    .get("https://api.github.com/users/" + response.githubName + "/repos")
                    // response (in this case the variable is res) will have LOTS of data
                    .then(function (repo) {

                        // axios always stores the return from the get in to the .data field for the variable
                        // can look at the specific data want
                        // console.log("repos call:", repo.data);


                        // create one object as generateHTML can take one argument.  Combine the two responses
                        let html = generateHTML({ ...response, ...res.data })
                        // console.log(html)
                        // console.log(`this is the color ${response.color} and the user ${response.githubName}`)


                        //write file 
                        // put the github username aftewr the profile name in the pdf. to make it more generic then don't need the response.githubName 
                        // also edit the vat html at the top to just use profile.html
                        // fs.writeFile("profile-" + response.githubName + ".html", generateHTML({ ...response, ...res.data }), function (err) {

                        fs.writeFile("./profile.html", generateHTML({ ...response, ...res.data }), function (err) {
                            if (err) {
                                return console.log(err);
                            }

                            console.log("Success!");
                            // init()

                           
                            var html2 = fs.readFileSync('./profile.html', 'utf8');
                            var options = { format: 'Letter' };
                            // create PDF pf html
                            pdf.create(html2, options).toFile('./profile.pdf', function (err, res) {
                                if (err) return console.log(err);
                                // console.log(res); // { filename: '/profile.pdf' }
                            });

                        });


                    });


            })



    })


        // }


// function init() {


// init();
// }
