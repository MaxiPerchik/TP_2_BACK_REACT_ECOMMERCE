import users from "../data/users.js";

async function getAllUsers() {
  return users.getUsers();
}

async function addUser(user) {
  return users.addUser(user);
}

async function findByCredentials(email, password) {
  return users.findByCredentials(email, password);
}

export default { getAllUsers, addUser, findByCredentials };
