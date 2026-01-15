<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAFlZeycy1fIMFB0qa9cMI8O83XhrPduSc",
    authDomain: "bank-we.firebaseapp.com",
    databaseURL: "https://bank-we-default-rtdb.firebaseio.com",
    projectId: "bank-we",
    storageBucket: "bank-we.firebasestorage.app",
    messagingSenderId: "211837143984",
    appId: "1:211837143984:web:d5615cf9c3a5c46a292475"
  };

  window.app = initializeApp(firebaseConfig);
  window.auth = getAuth(app);
  window.db = getDatabase(app);
</script>
