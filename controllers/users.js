import { getUsers } from "../data/users.js";

async function getAllUsers() {
  return getUsers();
}

export { getAllUsers };
