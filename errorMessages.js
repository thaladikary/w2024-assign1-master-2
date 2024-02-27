const errorMessages = {
  ref: { error: "Invalid ref specified" },
  year: { error: "Invalid year specified" },
  substring: { error: "Invalid substring specified" },
  raceId: { error: "Invalid raceId specified" },
  yearRound: { error: "Invalid year or round specified" },
  startEndYearRef: { error: "Invalid year start or end or ref specified" },
};

function checkValidity(data, condition, errorMessage, res) {
  if (condition(data)) {
    res.send(data);
  } else {
    res.send(errorMessage);
  }
}

//check if the queried data returned anything
function hasLengthGreaterThanZero(data) {
  return data.length > 0;
}

function checkValidRef(data, res) {
  checkValidity(data, hasLengthGreaterThanZero, errorMessages.ref, res);
}

function checkValidYear(data, res) {
  checkValidity(data, hasLengthGreaterThanZero, errorMessages.year, res);
}

function checkValidSubstring(data, res) {
  checkValidity(data, hasLengthGreaterThanZero, errorMessages.substring, res);
}

function checkValidRaceID(data, res) {
  checkValidity(data, hasLengthGreaterThanZero, errorMessages.raceId, res);
}

function checkValidYearRound(data, res) {
  checkValidity(data, hasLengthGreaterThanZero, errorMessages.yearRound, res);
}

function checkValidStartEndRef(data, res) {
  checkValidity(
    data,
    hasLengthGreaterThanZero,
    errorMessages.startEndYearRef,
    res
  );
}

module.exports = {
  checkValidRef,
  checkValidYear,
  checkValidSubstring,
  checkValidRaceID,
  checkValidYearRound,
  checkValidStartEndRef,
};
