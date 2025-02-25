document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("taxForm").addEventListener("submit", function (event) {
        if (!validateForm() || !validatePAN() || !validateAadhaar()) {
            event.preventDefault(); // Stop form submission if validation fails
        }
    });
});

// General Form Validation
function validateForm() {
    let form = document.getElementById("taxForm");
    let inputs = form.getElementsByTagName("input");

    for (let input of inputs) {
        if (!input.checkValidity()) {
            alert(input.title || "Please fill out all required fields correctly.");
            input.focus();
            return false;
        }
    }
    return true;
}

// PAN Validation (ABCDE1234F Format)
function validatePAN() {
    let panInput = document.querySelector("input[name='pan']").value;
    let panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!panRegex.test(panInput)) {
        alert("Invalid PAN! Format should be ABCDE1234F.");
        return false;
    }
    return true;
}

// Aadhaar Validation (12 Digits + UIDAI Checksum)
function validateAadhaar() {
    let aadhaarInput = document.querySelector("input[name='aadhaar']").value;
    let aadhaarRegex = /^\d{12}$/;

    if (!aadhaarRegex.test(aadhaarInput)) {
        alert("Invalid Aadhaar! Must be a 12-digit number.");
        return false;
    }

    if (!verhoeffCheck(aadhaarInput)) {
        alert("Invalid Aadhaar! Failed UIDAI checksum verification.");
        return false;
    }
    return true;
}

// Verhoeff Algorithm for Aadhaar Checksum Validation
const verhoeffTableD = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const verhoeffTableP = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [2, 8, 0, 7, 9, 1, 4, 6, 5, 3],
    [3, 9, 1, 0, 5, 7, 8, 2, 6, 4],
    [4, 2, 8, 6, 7, 3, 9, 5, 0, 1],
    [5, 4, 3, 2, 8, 6, 0, 9, 1, 7],
    [6, 7, 5, 9, 0, 2, 1, 3, 4, 8],
    [7, 0, 4, 5, 3, 9, 2, 8, 7, 6],
    [8, 3, 6, 4, 1, 0, 5, 9, 2, 7],
    [9, 6, 9, 8, 0, 2, 4, 1, 3, 5]
];

const verhoeffTableInv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

function verhoeffCheck(num) {
    let c = 0;
    let numArray = num.split("").reverse().map(Number);
    
    for (let i = 0; i < numArray.length; i++) {
        c = verhoeffTableD[c][verhoeffTableP[i % 8][numArray[i]]];
    }
    return c === 0;
}
