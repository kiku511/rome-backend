const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const SELECT_ALL_PEOPLE_QUERY = `
SELECT * 
FROM tbl_person P 
WHERE P.Status = 1`;

const CONNECTION = mysql.createConnection({
  host: "oga-web01.s.uw.edu",
  port: 3300,
  user: "student",
  password: "SQLPass@511",
  database: "rome"
});

CONNECTION.connect(err => {
  if (err) {
    return err;
  }
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("go to /people to see people");
});

app.get("/people/add", (req, res) => {
  const { fname, lname } = req.query;
  console.log("Adding", fname, lname);
  const INSERT_NEW_PERSON_QUERY = `INSERT INTO tbl_person(FirstName, LastName) VALUES('${fname}', '${lname}')`;
  CONNECTION.query(INSERT_NEW_PERSON_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(`Successfully added ${lname} ${lname}`);
    }
  });
});

app.get("/people", (req, res) => {
  CONNECTION.query(SELECT_ALL_PEOPLE_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get("/profile", (req, res) => {
  const { id } = req.query;
  console.log(`Getting data for person with ID #${id}`);
  const SELECT_ONE_PERSON_QUERY = `SELECT FirstName, LastName, Status, Email, MobileNumber, Nationality FROM tbl_person P WHERE P.PersonID = ${id}`;
  CONNECTION.query(SELECT_ONE_PERSON_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results[0]
      });
    }
  });
});

app.listen(4000, () => {
  console.log(`People server listening on port 4000`);
});
