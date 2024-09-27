const express = require('express');
const app = express();
const port = 3000;
const config = {
  host: 'mydatabase',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};
const mysql = require('mysql2/promise');

async function getNameCount() {
  const connection = await mysql.createConnection(config);
  const [rows] = await connection.query('SELECT COUNT(*) AS count FROM person');
  await connection.end();
  return rows[0].count;
}

async function addPerson(personCount) {
  const connection = await mysql.createConnection(config);
  await connection.query(`INSERT INTO person(name) values ('John${personCount}')`);
  await connection.end();
}

async function getAllPerson() {
  const connection = await mysql.createConnection(config);
  const response = await connection.query(`SELECT * FROM person`);
  await connection.end();
  return response;
}

function getListItemFromPersonArray(personArray) {
  return personArray.map(p => `<li>${p.name}</li>`).join('');
}

// routes
app.get('/', async (req, res) => {
  const count = await getNameCount();

  await addPerson(count);

  const allPerson = await getAllPerson();

  const personInArray = getListItemFromPersonArray(allPerson[0]);

  res.send(`<div>
      <h1>Full Cycle Rocks!</h1>
      <ol>
        ${personInArray}
      </ol>
    </div>
    `);
});

app.listen(port, () => {
  console.log("Rodando porta " + port);
});



