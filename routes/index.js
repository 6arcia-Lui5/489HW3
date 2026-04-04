var express = require('express');
var router = express.Router();

const signatures = [
    {
        name: "Alice Johnson",
        email: "alicejohnson@gmail.com",
        city: "Seattle",
        state: "WA",
        type: "Student",
        signerFields: {
            "academic-level": "Sophomore",
            major: "",
        },
        comment: "Agreed!"

    },
    {
        name: "Bob Smith",
        email: "bobsmith@gmail.com",
        city: "Portland",
        state: "OR",
        type: "Military",
        signerFields: {
            branch: "Marine Corps",
            "military-status": "Reservist",
        },
        comment: ""
    }
];

let idCounter = 3;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Petition',
    signatures: signatures,
    errors: [],
    formData: {}
  });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  const {
    name,
    email,
    city,
    state,
    comment,
  } = req.body;

  let type = req.body.type || '' 
  type = type.charAt(0).toUpperCase() + type.slice(1);

  let signerFields = {}

  if (type.toLowerCase() === "student") {
    signerFields["academic-level"] = req.body["academic-level"];
    signerFields["major"] = req.body["major"];
  }

  if (type.toLowerCase() === "military"){
    signerFields["branch"] = req.body["branch"];
    signerFields["military-status"] = req.body["military-status"];
  }
  if (type.toLowerCase() === "faculty") {
    signerFields["role"] = req.body["role"];
    signerFields["department"] = req.body["department"];
  }

  if (type.toLowerCase() === "professional"){
    signerFields["industry-sector"] = req.body["industry-sector"];
    signerFields["company-name"] = req.body["company-name"];
  }

  for (const key in signerFields) {
    if (signerFields[key]) {
      signerFields[key] = signerFields[key].charAt(0).toUpperCase() + signerFields[key].slice(1);
    }
  }
  
  const formData = req.body;

  const errors = [];

  //checks
  if (!name || name.trim().length < 5) {
    errors.push("Please enter a name greater than 5 characters.");
  }

  // 2. Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Enter a valid email (e.g. name@email.com).");
  }

  // 3. City
  if (!city || city.trim() === "") {
    errors.push("Please enter a valid city.");
  }

  // 4. State
  if (!state || state.trim().length !== 2) {
    errors.push("Enter a valid 2-letter state code (e.g., WA, OR).");
  }

  // 5. Type
  if (!type || type === "placeholder") {
    errors.push("Please select a signer type.");
  }

  // 6. Conditional fields
  for (const [key, value] of Object.entries(signerFields)) {
    if (!value || value === "placeholder") {
      errors.push("Please select an option for all required dropdowns.");
      break;
    }
  }

  if (errors.length > 0) {
    // Validation failed → re-render page with errors and previously entered values
    return res.render('index', {
      title: "Petition",
      errors,
      formData,
      signatures
    });
  }

  const newSignature = {
    name: name.trim(),
    email: email.trim(),
    city: city.trim(),
    state: state.trim().toUpperCase(),
    type,
    signerFields,
    comment: comment ? comment.trim() : "",
  };

  signatures.push(newSignature);

  res.redirect('/')
});

module.exports = router;
