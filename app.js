// Register User
function register() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let uid = userCredential.user.uid;

      firebase.database().ref("users/" + uid).set({
        name: name,
        balance: 0
      });

      alert("Account Created Successfully!");
      window.location = "index.html";
    })
    .catch(error => alert(error.message));
}

// Login User
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location = "dashboard.html";
    })
    .catch(error => alert(error.message));
}

// Load Balance
firebase.auth().onAuthStateChanged(user => {
  if (user && document.getElementById("balance")) {
    firebase.database().ref("users/" + user.uid).on("value", snapshot => {
      document.getElementById("balance").innerText = snapshot.val().balance;
    });
  }
});

// Deposit
function deposit() {
  let amount = Number(document.getElementById("amount").value);
  let user = firebase.auth().currentUser;

  let balanceRef = firebase.database().ref("users/" + user.uid + "/balance");

  balanceRef.once("value").then(snapshot => {
    balanceRef.set(snapshot.val() + amount);
  });
}

// Withdraw
function withdraw() {
  let amount = Number(document.getElementById("amount").value);
  let user = firebase.auth().currentUser;

  let balanceRef = firebase.database().ref("users/" + user.uid + "/balance");

  balanceRef.once("value").then(snapshot => {
    let newBalance = snapshot.val() - amount;
    if (newBalance >= 0) {
      balanceRef.set(newBalance);
    } else {
      alert("Insufficient Balance!");
    }
  });
}

// Logout
function logout() {
  firebase.auth().signOut();
  window.location = "index.html";
}
