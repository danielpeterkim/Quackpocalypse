import express from "express";;

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("This is a server!");
});

const setupRoutes = (app) => {
  app.use("/", router);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default setupRoutes;
