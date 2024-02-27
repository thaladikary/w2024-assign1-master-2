const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();

const {
  checkValidRef,
  checkValidYear,
  checkValidSubstring,
  checkValidRaceID,
  checkValidYearRound,
  checkValidStartEndRef,
} = require("./errorMessages.js");

const supabase = supa.createClient(
  process.env.supaUrl,
  process.env.supaAnonKey
);

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
  checkValidRef(data, res);
});

/*
    Returns the circuits used in a given season, orderd by round
*/

app.get("/api/circuits/season/:year", async (req, res) => {
  if (typeof req.params.year === "string") {
    res.send({ message: "Invalid year provided" });
  } else {
    const { data, error } = await supabase
      .from("races")
      .select("circuits(*), round")
      .eq("year", req.params.year)
      .order("round", { ascending: true });
    checkValidYear(data, res);
  }
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
  checkValidRef(data, res);
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
    .ilike("driverRef", req.params.ref);
  checkValidRef(data, res);
});

/* 
    Returns the drivers whose surname (case insensitive) begins
    with the provided substring
*/

app.get("/api/drivers/search/:substring", async (req, res) => {
  if (typeof req.params.substring === "number") {
    res.send({ message: "Invalid substring provided" });
  } else {
    const { data, error } = await supabase
      .from("drivers")
      .select()
      .ilike("surname", `${req.params.substring}%`);
    checkValidSubstring(data, res);
  }
});

/*
    Returns the drivers within a given race
    /api/drivers/race/1106
*/
app.get("/api/drivers/race/:raceId", async (req, res) => {
  if (typeof req.params.raceId === "string") {
    res.send({ message: "Invalid raceID specified" });
  } else {
    const { data, error } = await supabase
      .from("results")
      .select(`drivers (*)`)
      .eq("raceId", req.params.raceId);
    checkValidRaceID(data, res);
  }
});
/*
    Returns just the specified race
*/

app.get("/api/races/:raceId", async (req, res) => {
  if (typeof req.params.raceId === "string") {
    res.send({ message: "Invalid raceID specified" });
  } else {
    const { data, error } = await supabase
      .from("races")
      .select(
        `raceId, year, round, date, time, url, fp1_date, fp1_time, fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time, circuits (name, location, country)`
      )
      .eq("raceId", req.params.raceId);
    checkValidRaceID(data, res);
  }
});

/*
    Returns the races within a given season ordered by round
*/

app.get("/api/races/season/:year", async (req, res) => {
  if (typeof req.params.year === "string") {
    res.send({ message: "Invalid year specified" });
  } else {
    const { data, error } = await supabase
      .from("races")
      .select()
      .eq("year", req.params.year)
      .order("round");
    checkValidYear(data, res);
  }
});

/*
    Returns a specific race within a given season specified by the
    round number    
*/

app.get("/api/races/season/:year/:round", async (req, res) => {
  if (
    typeof req.params.year === "string" ||
    typeof req.params.round === "string"
  ) {
    res.send({ message: "Invalid year or round specified" });
  } else {
    const { data, error } = await supabase
      .from("races")
      .select()
      .eq("year", req.params.year)
      .eq("round", req.params.round);
    checkValidYearRound(data, res);
  }
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
  checkValidRef(data, res);
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
  checkValidStartEndRef(data, res);
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
  checkValidRaceID(data, res);
});

/*
    Returns all the results for the given driver
*/

app.get("/api/results/driver/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select(`results(*),*`)
    .eq("driverRef", req.params.ref);
  checkValidRef(data, res);
});

/*
    Returns all the results for a given driver between two years
*/

app.get("/api/results/driver/:ref/seasons/:start/:end", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select(`drivers!inner(*), races!inner(*), *`)
    .eq("drivers.driverRef", req.params.ref)
    .gte("races.year", req.params.start)
    .lte("races.year", req.params.end);
  checkValidStartEndRef(data, res);
});

/*
    Returns the qualifying results for the specified race
*/

app.get("/api/qualifying/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("qualifying")
    .select(
      "qualifyId,number, position,constructorId,q1,q2,q3, races(*), drivers(*), constructors(*)"
    )
    .eq("raceId", req.params.raceId)
    .order("position");
  checkValidRaceID(data, res);
});

/*
    Returns the current season driver standings table for the
    specified race, sorted by position in ascending order.
    Provide the same fields as with results for the driver
*/

app.get("/api/standings/:raceId/drivers", async (req, res) => {
  const { data, error } = await supabase
    .from("driverStandings")
    .select(
      "driverStandingsId, raceId, points, position, positionText, wins, drivers(*)"
    )
    .eq("raceId", req.params.raceId)
    .order("position");
  checkValidRaceID(data, res);
});

/* 
  Returns the current season constructors standings table for
  the specified race, sorted by position in ascending order.
  Provide the same fields as with results for the constructor. 
*/

app.get("/api/standings/:raceId/constructors", async (req, res) => {
  if (typeof req.params.raceId === "string") {
    res.send({ message: "Invalid raceID specified" });
  } else {
    const { data, error } = await supabase
      .from("constructorStandings")
      .select(
        "constructorStandingsId, raceId, points, position, positionText, wins, constructors(*)"
      )
      .eq("raceId", req.params.raceId)
      .order("position");
    checkValidRaceID(data, res);
  }
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
