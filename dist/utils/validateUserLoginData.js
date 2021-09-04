"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(userData) {
    // Vlidating Email
    var emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!userData.email)
        return {
            error: "Email Needs To Be Provided"
        };
    else if (!userData.email.match(emailPattern)) {
        return {
            error: "Invalid Email Address"
        };
    }
    // Validating Password
    if (!userData.password) {
        return {
            error: "Password Needs To Be Provided"
        };
    }
    else if (userData.password.length < 8) {
        return {
            error: "Password Needs To Be More Than 8 Characters"
        };
    }
    return {
        error: false
    };
}
exports.default = default_1;
