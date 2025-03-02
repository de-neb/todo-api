const checkRequiredFields = (requiredFileds) => (req, res, next) => {
  if (!("data" in req.body)) {
    return res.status(400).json({ message: "Missing data in body." });
  }

  const missingFields = requiredFileds.filter(
    (field) => !(field in req.body.data)
  );

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ message: `Missing required fields: ${missingFields}` });
  }

  next();
};

const checkRequiredArrayFields = (requiredFields) => (req, res, next) => {
  if (!("data" in req.body)) {
    return res.status(400).json({ message: "Missing data in body." });
  }

  if (!Array.isArray(req.body.data)) {
    return res
      .status(400)
      .json({ message: "Data must be an array of objects" });
  }

  for (let i = 0; i < req.body.data; i++) {
    const item = req.body.data[i];
    const missingFields = requiredFields.filter((field) => !(field in item));

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing fields in object at index ${i}`,
        missingFields,
      });
    }
  }

  next();
};

const checkOptionalFields = (optionalFields) => (req, res, next) => {
  if (!("data" in req.body)) {
    return res.status(400).json({ message: "Missing data in body." });
  }

  const hasOptionalField = optionalFields.some(
    (field) => field in req.body.data
  );

  if (!hasOptionalField) {
    return res.status(400).json({
      message: `Some fields are missing here ${optionalFields.join(",")}`,
    });
  }

  next();
};

const checkRequiredValues = (fields) => (req, res, next) => {
  if (!("data" in req.body)) {
    return res.status(400).json({ message: "Missing data in body." });
  }

  const invalidFieldValues = fields.filter((field) => {
    const value = req.body.data[field];
    return value === null || value === undefined || value === "";
  });

  if (invalidFieldValues.length > 0) {
    return res
      .status(400)
      .json({
        message: `Missing required values from fields: ${invalidFieldValues}`,
      });
  }

  next();
};

module.exports = {
  checkRequiredFields,
  checkRequiredArrayFields,
  checkOptionalFields,
  checkRequiredValues,
};
