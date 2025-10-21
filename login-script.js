// Get all users from localStorage
function getUsers() {
  const users = localStorage.getItem("gameVaultUsers");
  return users ? JSON.parse(users) : {};
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("gameVaultUsers", JSON.stringify(users));
}

// Check if already logged in
function checkIfLoggedIn() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    showSuccess("Already logged in as " + currentUser);
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// Show signup mode
function showSignup() {
  const form = document.getElementById("loginForm");
  form.innerHTML = `
                <div class="form-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Choose a username"
                        required
                        minlength="3"
                        maxlength="20"
                    >
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Choose a password"
                        required
                        minlength="4"
                    >
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        placeholder="Confirm your password"
                        required
                        minlength="4"
                    >
                </div>

                <button type="submit" class="login-btn">Create Account</button>
                <button type="button" class="login-btn" onclick="location.reload()" style="background: #2a2a3e; box-shadow: none;">Back to Login</button>
            `;

  form.onsubmit = handleSignup;

  document.querySelector(".login-title").textContent = "Create Account";
  document.querySelector(".login-subtitle").textContent =
    "Sign up to start playing";
}

// Handle signup
function handleSignup(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (username.length < 3) {
    showError("Username must be at least 3 characters long");
    return;
  }

  if (password.length < 4) {
    showError("Password must be at least 4 characters long");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  const users = getUsers();

  if (users[username]) {
    showError("Username already exists. Please choose another.");
    return;
  }

  // Create new user
  users[username] = {
    password: password,
    createdAt: new Date().toISOString(),
  };

  saveUsers(users);

  // Set current user
  localStorage.setItem("currentUser", username);

  // Initialize user's game data
  localStorage.setItem(`${username}_memoryGameHistory`, "[]");
  localStorage.setItem(`${username}_wordGameHistory`, "[]");

  showSuccess("Account created! Redirecting...");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username.length < 3) {
    showError("Username must be at least 3 characters long");
    return;
  }

  if (password.length < 4) {
    showError("Password must be at least 4 characters long");
    return;
  }

  const users = getUsers();

  if (!users[username]) {
    showError("Username not found. Please create an account.");
    return;
  }

  if (users[username].password !== password) {
    showError("Incorrect password. Please try again.");
    return;
  }

  // Save current user
  localStorage.setItem("currentUser", username);

  showSuccess("Login successful! Redirecting...");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 3000);
}

// Show success message
function showSuccess(message) {
  const successDiv = document.getElementById("successMessage");
  successDiv.textContent = message;
  successDiv.style.display = "block";
}

// Initialize
document.addEventListener("DOMContentLoaded", checkIfLoggedIn);
