const submittedForms = [
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

function signerChanged(selectedElement) {
    const container = document.getElementById("signer-dropdown-container");
    container.innerHTML = "";
    container.style.display = "flex";

    if (selectedElement.value === "student") {
        const template = document.getElementById("student-fields");
        container.appendChild(template.content.cloneNode(true));
    } else if (selectedElement.value === "faculty") {
        const template = document.getElementById("faculty-fields");
        container.appendChild(template.content.cloneNode(true));

    }
    else if (selectedElement.value === "military") {
        const template = document.getElementById("military-fields");
        container.appendChild(template.content.cloneNode(true));

    }
    else if (selectedElement.value === "professional") {
        const template = document.getElementById("professional-fields");
        container.appendChild(template.content.cloneNode(true));
    }
    else if (selectedElement.value === "other") {
        const template = document.getElementById("other-fields");
        container.appendChild(template.content.cloneNode(true));

    }
}

function handleSubmit(e) {
    e.preventDefault();

    const errorMsg = document.querySelector(".error-msg")
    errorMsg.style.display = "none";
    let errorFlagged = false;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim().toUpperCase();
    const signer = document.getElementById("signer").value;
    const additionalComment = document.getElementById("comment").value.trim();

    if (!name || name.length < 5) {
        errorFlagged = true;
        errorMsg.textContent = "Please enter a name greater than 5 characters."
    }

    if (!isValidEmail(email)) {
        errorFlagged = true;
        errorMsg.textContent = "Enter an email that contains an \"@\" and a \".\" after the \"@\", with non-empty parts on boths sides. (e.g. name@email.com)";
    }

    if (!city) {
        errorFlagged = true;
        errorMsg.textContent = "Please enter a valid city."
    }

    if (!state || state.length > 2 || state.length < 2) {
        errorFlagged = true;
        errorMsg.textContent = "Enter an valid state. (e.g. WA, ID, OR, CA)";
    }

    if (!signer || signer === "placeholder") {
        errorFlagged = true;
        errorMsg.textContent = "Please select a signer type (e.g. student, faculty, ...)";
    }

    const signerFields = document.querySelectorAll(".signer-information");
    let fieldList = {}

    signerFields.forEach(field => {
        // console.log(field.name)
        // console.log(field.value)
        fieldList[field.name] = field.value;
    })

    if (!allFieldsFilled(signerFields)) {
        errorFlagged = true;
        errorMsg.textContent = "Please select an option for all required dropdowns.";
    } 

    if (errorFlagged) {
        errorMsg.style.display = "block";
    } else {
    errorMsg.style.display = "none";

    const newUser = {
        name: name,
        email: email,
        city: city,
        state: state,
        type: signer,
        signerFields: fieldList,
        comment: additionalComment
    };

    const index = submittedForms.push(newUser) - 1;

    const table = document.getElementById("table-body");

    const newRow  = document.createElement("tr");
    const newName = document.createElement("td");
    const newCity = document.createElement("td");
    const newType = document.createElement("td");
    const newDetails = document.createElement("td");

    newName.textContent = name;
    newCity.textContent = city;
    newType.textContent = signer;

    const moreBtn = document.createElement("a");
    moreBtn.className = "more-button";
    moreBtn.textContent = "More >>";
    moreBtn.setAttribute("data-index", index);
    moreBtn.setAttribute("data-toggle", "modal");
    moreBtn.setAttribute("data-target", "#userModal");

    newDetails.appendChild(moreBtn);

    newRow.appendChild(newName);
    newRow.appendChild(newCity);
    newRow.appendChild(newType);
    newRow.appendChild(newDetails);

    table.appendChild(newRow);

    document.getElementById("petition-form").reset();
    document.getElementById("signer-dropdown-container").style.display = "none";
}

    
}

function isValidEmail(email) {
    const atIndex = email.indexOf("@");
    if (atIndex <= 0) {
        return false;
    }
    
    const domain = email.slice(atIndex + 1);
    if (!domain) {
        return false;
    }

    const dotIndex = domain.indexOf(".");
    if (dotIndex <= 0) {
        return false;
    }

    const afterDot = domain.slice(dotIndex + 1);
    if (!afterDot) {
        return false;
    }
    
    return true;
}

function allFieldsFilled(signerFields) {

    let allFilled = true;

    signerFields.forEach(field => {
        if (field.tagName === "SELECT" && field.value.trim() === "placeholder") {
            allFilled = false;
        }
    });
    return allFilled
}


function showDetails(user) {
  const modal = document.getElementById("userModal");
  const modalTitle = document.getElementById("modalLabel");
  const modalBody = modal.querySelector(".modal-body");

  modalTitle.textContent = "Details: " + user.name;
  modalBody.innerHTML = "";

  const formatKey = (key) =>
    key.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  for (const [key, value] of Object.entries(user)) {

    if (key === "signerFields" && value) {
      for (const [sKey, sValue] of Object.entries(value)) {
        const row = document.createElement("p");
        row.innerHTML = `<strong>${formatKey(sKey)}:</strong> ${sValue || "-"}`;
        modalBody.appendChild(row);
      }
      continue;
    }

    if (typeof value === "object") continue;

    const row = document.createElement("p");
    row.innerHTML = `<strong>${formatKey(key)}:</strong> ${value || "-"}`;
    modalBody.appendChild(row);
  }

  // Show Bootstrap modal manually
  $('#userModal').modal('show');
}