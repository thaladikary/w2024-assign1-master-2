const errorMessages = {
  ref: { message: "Invalid ref specified" },
  year: { message: "Invalid year specified" },
  substring: { message: "Invalid substring specified" },
  raceId: { message: "Invalid raceId specified" },
  yearRound: { message: "Invalid year or round specified" },
  startEndYearRef: { message: "Invalid year start or end or ref specified" },
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
