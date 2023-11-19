const { Router } = require("express");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const CartsController = require("../controllers/CartsController");

const cartsRoutes = Router();
const cartsController = new CartsController();

cartsRoutes.use(ensureAuthenticated);

cartsRoutes.get("/", cartsController.index);
cartsRoutes.post("/", cartsController.create);
cartsRoutes.get("/:id", cartsController.show);
cartsRoutes.delete("/:id", cartsController.delete);
cartsRoutes.patch("/:id", cartsController.update);

module.exports = cartsRoutes;