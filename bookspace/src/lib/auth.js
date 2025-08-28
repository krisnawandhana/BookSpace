import "server-only";

const DUMMY_EMAIL = process.env.DUMMY_EMAIL;
const DUMMY_PASSWORD = process.env.DUMMY_PASSWORD;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

const users = [
  // seed dari env (opsional)
  ...(DUMMY_EMAIL && DUMMY_PASSWORD
    ? [{ id: 1, email: normalizeEmail(DUMMY_EMAIL), password: DUMMY_PASSWORD }]
    : []),
];

function makeToken() {
  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  return `dummy.${id}`;
}

let nextUserId  = users.length + 1;

function findUserByEmailAndPassword(email, password) {
  const normalizedEmail = normalizeEmail(email);
  return users.find((u) => u.email === normalizedEmail && u.password === password) || null;
}

function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return users.find((u) => u.email === normalizedEmail) || null;
}

export function registerUser(email, password) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return { error: "Email dan password wajib diisi" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { error: "Format email tidak valid" };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }
  if (findUserByEmail(normalizedEmail)) {
    return { error: "Email sudah terdaftar" };
  }

  const user = { id: String(nextUserId++), email: normalizedEmail, password };
  users.push(user);

  return { user: { id: user.id, email: user.email } };
}

export function authenticateUser(email, password) {
  if (!email || !password) {
    return { error: "Email dan password wajib diisi" };
  }

  const foundUser = findUserByEmailAndPassword(email, password);
  if (!foundUser) {
    return { error: "Email atau password salah" };
  }

  const token = makeToken();
  return { user: { id: foundUser.id, email: foundUser.email }, token };
}
