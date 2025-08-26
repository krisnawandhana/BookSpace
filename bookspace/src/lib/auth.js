export function authenticateUser(email, password) {
  const DUMMY_EMAIL = process.env.DUMMY_EMAIL;
  const DUMMY_PASSWORD = process.env.DUMMY_PASSWORD;
  const DUMMY_TOKEN = process.env.DUMMY_TOKEN;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi" };
  }
  if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
    const token = DUMMY_TOKEN; // token palsu untuk test
    return { user: { id: 1, email: DUMMY_EMAIL }, token };
  }
  return { error: "Email atau password salah" };
}
