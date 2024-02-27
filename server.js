const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();

const supaUrl = "https://yubhldtwvohlnkcuksfr.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YmhsZHR3dm9obG5rY3Vrc2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxMTg0NjksImV4cCI6MjAyMzY5NDQ2OX0.mXbaW42SWZMWK0Fk_BifGQubaN3FLt1iHzJnMp5WBDI";

const supabase = supa.createClient(supaUrl, supaAnonKey);

/*
    Returns all the seasons
*/
app.get("/api/seasons", async (req, res) => {
  const { data, error } = await supabase.from("seasons").select();
  res.send(data);
});

/*
    Returns all the circuits
*/
app.get("/api/circuits", async (req, res) => {
  const { data, error } = await supabase.from("circuits").select();
  res.send(data);
});

/*
    Returns just the specified circuit 
*/

app.get("/api/circuits/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("circuits")
    .select()
    .eq("circuitRef", req.params.ref);
  res.send(data);
});

/*
    Returns the circuits used in a given season, orderd by round
*/

app.get("/api/circuits/season/:year", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select("circuits(*), round")
    .eq("year", req.params.year)
    .order("round", { ascending: true });
  res.send(data);
  console.log(error);
});

/*
    Returns all the constructors
*/

app.get("/api/constructors", async (req, res) => {
  const { data, error } = await supabase.from("constructors").select();
  res.send(data);
  console.log("error:" + error);
});

/*
    Returns just the specified constructor
*/

app.get("/api/constructors/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("constructors")
    .select()
    .eq("constructorRef", req.params.ref);
  res.send(data);
  console.log("error:" + error);
});

/* 
    Returns all the drivers 
*/

app.get("/api/drivers", async (req, res) => {
  const { data, error } = await supabase.from("drivers").select();
  res.send(data);
  console.log("error:" + error);
});

/* 
    Returns just the specified driver

*/

app.get("/api/drivers/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select()
    .eq("driverRef", req.params.ref);
  res.send(data);
  console.log("error:" + error);
});

/* 
    Returns the drivers whose surname (case insensitive) begins
    with the provided substring
*/

app.get("/api/drivers/search/:substring", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select()
    .ilike("surname", `${req.params.substring}%`);
  res.send(data);
  console.log("error:" + error);
});

/*
    Returns the drivers within a given race
    /api/drivers/race/1106
*/
app.get("/api/drivers/race/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select(`drivers (*)`)
    .eq("raceId", req.params.raceId);
  res.send(data);
  console.log(error);
});
/*
    Returns just the specified race
*/

app.get("/api/races/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select(
      `raceId, year, round, date, time, url, fp1_date, fp1_time, fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time, circuits (name, location, country)`
    )
    .eq("raceId", req.params.raceId);
  res.send(data);
  console.log(error);
});

/*
    Returns the races within a given season ordered by round
*/

app.get("/api/races/season/:year", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select()
    .eq("year", req.params.year)
    .order("round");
  res.send(data);
  console.log(error);
});

/*
    Returns a specific race within a given season specified by the
    round number    
*/

app.get("/api/races/season/:year/:round", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select()
    .eq("year", req.params.year)
    .eq("round", req.params.round);
  res.send(data);
  console.log(error);
});

/*
    Returns all the races for a given circuit orderd by year
*/

app.get("/api/races/circuits/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select(`circuits!inner(), *`)
    .eq("circuits.circuitRef", req.params.ref)
    .order("year");
  res.send(data);
  console.log(error);
});

/*
    Returns all the races for a given circuit between two years
*/

app.get("/api/races/circuits/:ref/season/:start/:end", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select(`circuits!inner(), *`)
    .eq("circuits.circuitRef", req.params.ref)
    .gte("year", req.params.start)
    .lte("year", req.params.end);
  res.send(data);
  console.log(error);
});

/*
    Returns the results for the specified race
*/

app.get("/api/results/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select(
      `drivers
    (driverRef, code, forename, surname), races (name, round, year,
        date), constructors (name, constructorRef, nationality), *`
    )
    .eq("raceId", req.params.raceId)
    .order("grid");
  res.send(data);
  console.log(error);
});

/*
    Returns all the results for the given driver
*/

app.get("/api/results/driver/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select(`results(*),*`)
    .eq("driverRef", req.params.ref);
  res.send(data);
  console.log(error);
});

/*
    Returns all the results for a given driver between two years
*/

app.get("/api/results/drivers/:ref/seasons/:start/:end", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select(`drivers!inner(*), races!inner(*), *`)
    .eq("drivers.driverRef", req.params.ref)
    .gte("races.year", req.params.start)
    .lte("races.year", req.params.end);
  res.send(data);
  console.log(error);
});

/*
    Returns the qualifying results for the specified race
*/

app.get("/api/qualifying/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("qualifying")
    .select("raceId,driverId,constructorId,number,position")
    .eq("raceId", req.params.raceId)
    .order("position");
  res.send(data);
  console.log(error);
});

/*
    Returns the current season driver standings table for the
    specified race, sorted by position in ascending order.
    Provide the same fields as with results for the driver
*/

app.get("/api/standings/:raceId/drivers", async (req, res) => {
  const { data, error } = await supabase
    .from("driverStandings")
    .select("raceId,driverId,points,positionText,position")
    .eq("raceId", req.params.raceId)
    .order("position");
  res.send(data);
  console.log(error);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
