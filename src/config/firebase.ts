import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(require("../../firebase-adminsdk.json")),
});

export default admin;
