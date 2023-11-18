const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError");

describe("UserCreateService", () => {

  let userRepositoryInMemory = null;
  let userCreateService = null;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    userCreateService = new UserCreateService(userRepositoryInMemory);
  })

  it("user should be create", async () => {
    const user = {
      name: "User Test",
      email: "usertest@email.com",
      password: "user123"
    };
  
    const userCreated = await userCreateService.execute(user);
  
    expect(userCreated).toHaveProperty("id");
  });

  it("user not should be create with exists email", async () => {
    const admin1 = {
      name: "Admin",
      email: "admin@email.com",
      password: "admin123456"
    };

    const admin2 = {
      name: "ADMIN",
      email: "admin@email.com",
      password: "ADMIN123456789"
    };
  
    await userCreateService.execute(admin1);
    expect(async () => {
      await userCreateService.execute(admin2)
    }).rejects.toEqual(new AppError("Este e-mail já está em uso."));
  });
})