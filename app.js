import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  ref, set, get, update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// Generate Account Number
function generateAccountNumber() {
  return "ACC" + Math.floor(100000 + Math.random() * 900000);
}


// ================= REGISTER =================
window.register = function () {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  let accNo = generateAccountNumber();

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCred => {
      let uid = userCred.user.uid;

      set(ref(db, "users/" + uid), {
        name: name,
        email: email,
        account: accNo,
        balance: 0
      });

      set(ref(db, "accounts/" + accNo), uid);

      alert("Account Created!\nYour Account Number: " + accNo);
      window.location = "index.html";
    })
    .catch(err => alert(err.message));
};


// ================= LOGIN =================
window.login = function () {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location = "dashboard.html")
    .catch(err => alert(err.message));
};


// ================= DASHBOARD =================
onAuthStateChanged(auth, user => {
  if (user && document.getElementById("balance")) {
    let userRef = ref(db, "users/" + user.uid);

    get(userRef).then(snapshot => {
      let data = snapshot.val();
      document.getElementById("balance").innerText = data.balance;
      document.getElementById("accno").innerText = data.account;
    });
  }
});


// ================= DEPOSIT =================
window.deposit = function () {
  updateBalance(true);
};


// ================= WITHDRAW =================
window.withdraw = function () {
  updateBalance(false);
};


// ================= UPDATE BALANCE =================
function updateBalance(isDeposit) {
  let amount = Number(document.getElementById("amount").value);
  let user = auth.currentUser;

  if (!amount || amount <= 0) return alert("Enter valid amount");

  let userRef = ref(db, "users/" + user.uid);

  get(userRef).then(snapshot => {
    let data = snapshot.val();
    let newBal = isDeposit ? data.balance + amount : data.balance - amount;

    if (newBal < 0) return alert("Insufficient balance");

    update(userRef, { balance: newBal });

    alert("Transaction successful");
    location.reload();
  });
}


// ================= LOGOUT =================
window.logout = function () {
  signOut(auth);
  window.location = "index.html";
};
