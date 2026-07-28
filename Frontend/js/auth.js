// ==========================
// SMARTBUY AUTH SYSTEM
// ==========================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const token = localStorage.getItem("token");

function isLoggedIn() {
    return !!(token && currentUser);
}