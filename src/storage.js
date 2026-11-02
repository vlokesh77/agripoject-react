
const USERS_KEY = "agri_users";
const SESSION_KEY = "agri_session";

// Create default Admin account
const defaultAdmin = {
  id: "admin001",
  name: "Administrator",
  email: "admin@agrimarket.com",
  password: "Admin@123",
  role: "admin"
};

export function getUsers() {
  const users = JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]"
  );

  if (!users.some(user => user.role === "admin")) {
    users.push(defaultAdmin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  return users;
}

// Register Farmer or Buyer
export function signup(user) {
  const users = getUsers();

  if (users.some(
    u => u.email.toLowerCase() === user.email.toLowerCase()
  )) {
    throw new Error("Email already registered");
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: user.name,
    email: user.email.toLowerCase(),
    password: user.password,
    role: user.role
  };

 users.push(newUser);

localStorage.setItem(
  USERS_KEY,
  JSON.stringify(users)
);

const session = {
  id: newUser.id,
  name: newUser.name,
  email: newUser.email,
  role: newUser.role
};

localStorage.setItem(
  SESSION_KEY,
  JSON.stringify(session)
);

return session;
}

// Login
export function login(email, password) {
  const user = getUsers().find(
    u =>
      u.email === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  return session;
}

// Get logged-in user
export function getSession() {
  return JSON.parse(
    localStorage.getItem(SESSION_KEY) || "null"
  );
}

// Logout
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
