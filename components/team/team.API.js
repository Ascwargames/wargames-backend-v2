const express = require("express");
const Security = require("../../security");
const router = express.Router({ caseSensitive: false });

const {
  signup,
  sendVerification,
  verify,
  login,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateName,
  dashboard,
  downloadTeams,
  viewProfile,
  removeTeam,
  getOtp,
  generateCredentials,
  logout
} = require("./controllers");

// Security.csrfProtection
router.post("/signup.json", Security.csrfProtection, signup);
router.post("/login.json", login);

// Security.csrfProtection
router.post(
  "/verification-code.json",
  Security.validateTempToken,
  Security.csrfProtection,
  sendVerification
);
// Security.csrfProtection
router.post("/verify.json", Security.validateTempToken, Security.csrfProtection, verify);

// Security.csrfProtection
router.patch("/update-password", Security.auth(["user"]), Security.csrfProtection, updatePassword);
// Security.csrfProtection
router.post("/forget-password", Security.csrfProtection,  forgotPassword);
// Security.csrfProtection
router.post("/reset-password", Security.validateTempToken, Security.csrfProtection, resetPassword);
// Security.csrfProtection
router.patch("/team-name", Security.auth(["user"]), Security.csrfProtection, updateName);
router.get("/dashboard", Security.auth(["user", "superadmin"]), dashboard);

// for superadmin
router.get("/otp", Security.auth(["superadmin"]), getOtp);

router.get("/download.json", downloadTeams);

router.get("/profile", Security.auth(["user", "superadmin"]), viewProfile);
router.get("/profile/:id", Security.auth(["user"]), viewProfile);

// for superadmin
router.delete("/", Security.auth(["superadmin"]), removeTeam);

router.get("/generate-credentials.json", generateCredentials);

router.post("/logout", Security.csrfProtection, logout);

module.exports = router;
