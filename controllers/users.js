import users from "../data/users.js";

async function getAllUsers() {
  return users.getUsers();
}

async function addUser(user) {
  return users.addUser(user);
}

async function login(email, password) {
  const user = await users.findByCredentials(email, password);

  if (!user) {
    new Error("no se ecnontro el usuerio");
  }
  const token = users.generateAuthToken(user);
  return token;
}
export default { getAllUsers, addUser, login };
