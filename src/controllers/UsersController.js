const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

const UserRepository = require("../repositories/UserRepository")
const UserCreateService = require("../services/UserCreateService")

const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password, is_admin = false } = request.body;

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);

    await userCreateService.execute({ name, email, password, is_admin })

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password, is_admin } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)", [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já se encontra registrado.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Para definir uma nova senha, é obrigatório informar a senha anterior."
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga fornecida não está correta.");
      }

      user.password = await hash(password, 8);
    }

    if (is_admin !== undefined && user.id !== request.userId && !user.is_admin) {
      throw new AppError(
        "Você não possui autorização para modificar o campo 'is_admin'", 403
      );
    }

    if (is_admin !== undefined && user.is_admin) {
      user.is_admin = is_admin;
    }

    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      is_admin = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user.is_admin, user_id]
    );

    return response.status(200).json();
  }
}

module.exports = UsersController;
