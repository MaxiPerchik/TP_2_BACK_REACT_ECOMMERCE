import users from "../data/users.js";
import bcrypt from "bcrypt";


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

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password no corresponde a usuario");
  }

  const token = users.generateAuthToken(user);
  return token;
}

async function updateUser(id, name){
  return users.updateUser(id, name)
}

export default { getAllUsers, addUser, login , updateUser};
