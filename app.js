// Generate Account Number
function generateAccountNumber() {
  return "ACC" + Math.floor(100000 + Math.random() * 900000);
}

// Register
function register() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let accNo = generateAccountNumber();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      let uid = userCred.user.uid;

      firebase.database().ref("users/" + uid).set({
        name: name,
        email: email,
        account: accNo,
        balance: 0
      });

      firebase.database().ref("accounts/" + accNo).set(uid);

      alert("Account Created! Your Account No: " + accNo);
      window.location = "index.html";
    })
    .catch(err => alert(err.message));
}

// Login
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => window.location = "dashboard.html")
    .catch(err => alert(err.message));
}

// Load User Dashboard
firebase.auth().onAuthStateChanged(user => {
  if (user && document.getElementById("balance")) {
    let ref = firebase.database().ref("users/" + user.uid);

    ref.on("value", snap => {
      let data = snap.val();
      document.getElementById("balance").innerText = data.balance;
      document.getElementById("accno").innerText = data.account;
    });

    firebase.database().ref("transactions/" + user.uid).on("value", snap => {
      let history = document.getElementById("history");
      history.innerHTML = "";
      snap.forEach(tx => {
        let li = document.createElement("li");
        li.innerText = tx.val();
        history.appendChild(li);
      });
    });
  }
});

// Deposit
function deposit() {
  updateBalance(true);
}

// Withdraw
function withdraw() {
  updateBalance(false);
}

// Update balance function
function updateBalance(isDeposit) {
  let amt = Number(document.getElementById("amount").value);
  let user = firebase.auth().currentUser;
  let ref = firebase.database().ref("users/" + user.uid);

  ref.once("value").then(snap => {
    let bal = snap.val().balance;
    let newBal = isDeposit ? bal + amt : bal - amt;

    if (newBal < 0) return alert("Insufficient balance");

    ref.update({ balance: newBal });

    firebase.database().ref("transactions/" + user.uid).push(
      (isDeposit ? "Deposit: ₹" : "Withdraw: ₹") + amt
    );
  });
}

// Logout
function logout() {
  firebase.auth().signOut();
  window.location = "index.html";
}

// Admin Login
function adminLogin() {
  let pass = document.getElementById("adminPass").value;

  if (pass === "admin123") {
    document.getElementById("adminArea").style.display = "block";
    alert("Admin logged in");
  } else {
    alert("Wrong admin password");
  }
}

// Admin add balance
function addBalanceAdmin() {
  let acc = document.getElementById("adminAcc").value;
  let amt = Number(document.getElementById("adminAmount").value);

  firebase.database().ref("accounts/" + acc).once("value").then(snap => {
    if (!snap.exists()) return alert("Account not found");

    let uid = snap.val();
    let userRef = firebase.database().ref("users/" + uid);

    userRef.once("value").then(s => {
      let bal = s.val().balance;
      userRef.update({ balance: bal + amt });

      firebase.database().ref("transactions/" + uid).push(
        "Admin Added: ₹" + amt
      );

      alert("Balance added successfully");
    });
  });
}
