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

// Validate username
function validateUsername(username) {
  // Check if empty or only whitespace
  if (!username || username.trim().length === 0) {
    return { valid: false, error: "Username cannot be empty" };
  }

  // Check length (3-20 characters)
  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters long" };
  }
  if (username.length > 20) {
    return { valid: false, error: "Username cannot exceed 20 characters" };
  }

  // Check for valid characters (alphanumeric, underscore, hyphen only)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }

  // Check if starts with a letter
  if (!/^[a-zA-Z]/.test(username)) {
    return { valid: false, error: "Username must start with a letter" };
  }

  // Check for consecutive special characters
  if (/[_-]{2,}/.test(username)) {
    return { valid: false, error: "Username cannot have consecutive underscores or hyphens" };
  }

  // Reserved usernames
  const reservedNames = ['admin', 'root', 'user', 'guest', 'system', 'null', 'undefined'];
  if (reservedNames.includes(username.toLowerCase())) {
    return { valid: false, error: "This username is reserved and cannot be used" };
  }

  return { valid: true };
}

// Validate password
function validatePassword(password) {
  // Check if empty
  if (!password || password.length === 0) {
    return { valid: false, error: "Password cannot be empty" };
  }

  // Check minimum length
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }

  // Check maximum length
  if (password.length > 50) {
    return { valid: false, error: "Password cannot exceed 50 characters" };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character (!@#$%^&* etc.)" };
  }

  // Check for spaces
  if (/\s/.test(password)) {
    return { valid: false, error: "Password cannot contain spaces" };
  }

  // Check for common weak passwords
  const weakPasswords = ['password', 'password123', '12345678', 'qwerty123'];
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
    return { valid: false, error: "Password is too common. Please choose a stronger password" };
  }

  return { valid: true };
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
                    <small style="color: #a0a6b0; font-size: 0.8rem; display: block; margin-top: 0.3rem;">
                        Must be 3-20 characters, start with a letter, use only letters, numbers, _ or -
                    </small>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Choose a password"
                        required
                        minlength="8"
                    >
                    <small style="color: #a0a6b0; font-size: 0.8rem; display: block; margin-top: 0.3rem;">
                        Min 8 chars, must have uppercase, lowercase, number & special character
                    </small>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        placeholder="Confirm your password"
                        required
                        minlength="8"
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

  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    showError(usernameValidation.error);
    return;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    showError(passwordValidation.error);
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  const users = getUsers();

  // Check if username already exists (case-insensitive)
  const existingUser = Object.keys(users).find(
    user => user.toLowerCase() === username.toLowerCase()
  );
  if (existingUser) {
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

  // Check for empty username
  if (!username || username.length === 0) {
    showError("Please enter your username");
    return;
  }

  // Check for empty password
  if (!password || password.length === 0) {
    showError("Please enter your password");
    return;
  }

  const users = getUsers();

  // Find user (case-insensitive search)
  const userKey = Object.keys(users).find(
    user => user.toLowerCase() === username.toLowerCase()
  );

  if (!userKey) {
    showError("Username not found. Please check your username or create an account.");
    return;
  }

  if (users[userKey].password !== password) {
    showError("Incorrect password. Please try again.");
    return;
  }

  // Save current user (use the actual stored username)
  localStorage.setItem("currentUser", userKey);

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