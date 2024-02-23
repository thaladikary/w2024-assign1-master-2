const express = require("express");

const app = express();

const port = process.env.PORT;
const supa = require("@supabase/supabase-js");

const supabase = supa.createClient(
  process.env.SUPA_URL,
  process.env.SUPA_ANONKEY
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
