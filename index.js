// Use inquirer npm package to get answers to command line questions as the answers will be the data passed to the writeToFile npm package
var inquirer = require("inquirer");

// Need the node filesystem module to run writeToFile
var fs = require("fs");

// Need this so when call the generateHTML function it knows which js file to use
var generateHTML = require("./generateHTML.js");

// Need axios to make API call
const axios = require("axios");

// This array is set so the user can choose a background color for the cards
// these colors are the ones set in the generateHTML.js
// colorsArray = ["green","blue", "pink", "red"]


// const questions = [

// ];
function init() {
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

            console.log(response);


            axios
                .get("https://api.github.com/users/" + response.githubName)
                // response (in this case the variable is res) will have LOTS of data
                .then(function (res) {

                    // axios always stores the return from the get in to the .data field for the variable
                    // can look at the specific data want
                    console.log(res.data);

                    // create one object as generateHTML can take one argument.  Combine the two responses
                


                    axios
                        .get("https://api.github.com/users/" + response.githubName + "/repos")
                        // response (in this case the variable is res) will have LOTS of data
                        .then(function (repo) {

                            // axios always stores the return from the get in to the .data field for the variable
                            // can look at the specific data want
                            console.log("repos call:", repo.data);
                            let stars = 0
                            // loop
                            repo.data.map(e => {
                                stars = stars + e.stargazers_count
                            })
                            console.log("------>",stars)

                            // create one object as generateHTML can take one argument.  Combine the two responses
                            let html = generateHTML({ stars,...response, ...res.data })
                            console.log(html)
                            console.log(`this is the color ${response.color} nd the user ${response.githubName}`)


                            //wirte file 

                            fs.writeFile("profile-" + response.githubName + ".html", generateHTML({ ...response, ...res.data }), function (err) {

                                if (err) {
                                    return console.log(err);
                                }

                                console.log("Success!");
                                init()

                            });

                        });

                })
            })

        }



// function writeToFile(fileName, data) {




// }

// function init() {

// $ npx gitignore node
// $ npm init -y
init();
// }
