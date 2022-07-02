const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { Prohairesis } = require("prohairesis");
const env = require("./env");

const database = new Prohairesis(env.CLEARDB_DATABASE_URL);

const app = express();

app
  .use(morgan("dev"))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())


//create a new user  
  .post("/api/user", async (req, res) => {
    const { username, password } = req.body;

    try {
      await database.query(
        `
            INSERT INTO users (
                username, 
                passwor,
                date_added ) VALUES (
                    @username,
                    @password,
                    NOW()
                )`,
        {
          username: username,
          password: password,
        }
      );

      res.status(200)
      res.end('User created successfully');
    } catch (e) {
      console.error("Error inserting user");
      res.status(500);
      res.end("Error inserting user. Does this user already exist?");
    }
  })


  //loggin in
 .put('/api/user', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await database.query(
        `
            SELECT * FROM users WHERE username = @username AND password = SHA2(@password, 256)
                `,
        {
          username: username,
          password: password,
        }
      );

      res.status(200)
      res.end('User Exists');
    } catch (e) {
      console.error("Error retreiving user");
      res.status(500);
      res.end("Error finding. Does this user already exist?");
    }
  })


  .get('/api/user', async (req, res) => {

    try {
      const users = await database.query(
        `
            SELECT 
                username,
                date_added 
            FROM 
                User 
                `,
        {
          username: username,
          password: password,
        }
      );

      res.status(200)
      res.json(users);
    } catch (e) {
      console.error("Error retreiving user");
      res.status(500);
      res.end("Error finding.");
    }
  });
