client.connect();

client.query(`SELECT * FROM ${answers.table}`, (err, res) => {
  if (err) throw err;

  console.table(res.rows);

  client.end();
});