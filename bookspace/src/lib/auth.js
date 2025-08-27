const DUMMY_EMAIL = process.env.DUMMY_EMAIL;
const DUMMY_PASSWORD = process.env.DUMMY_PASSWORD;
const DUMMY_TOKEN = process.env.DUMMY_TOKEN;

function normalize(email) {
  return String(email || "").trim().toLowerCase();
}

const users = [
  // seed dari env (opsional)
  ...(DUMMY_EMAIL && DUMMY_PASSWORD
    ? [{ id: 1, email: normalize(DUMMY_EMAIL), password: DUMMY_PASSWORD }]
    : []),
];

let nextId = users.length + 1;

export function registerUser(email, password) {
  const e = normalize(email);

  if (!e || !password) return { error: "Email dan password wajib diisi" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { error: "Format email tidak valid" };
  if (password.length < 6) return { error: "Password minimal 6 karakter" };

  const exists = users.find((u) => u.email === e);
  if (exists) return { error: "Email sudah terdaftar" };

  const user = { id: nextId++, email: e, password };
  users.push(user);
  return { user: { id: user.id, email: user.email } };
}

export function authenticateUser(email, password) {
  const e = normalize(email);

  if (!e || !password) return { error: "Email dan password wajib diisi" };

  const match = users.find((u) => u.email === e && u.password === password);
  if (!match) return { error: "Email atau password salah" };

  const token = DUMMY_TOKEN
  return { user: { id: match.id, email: match.email }, token };
}
