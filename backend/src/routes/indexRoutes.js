import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.render("index.ejs", {
    pageTitle: "Solom Chat",
  });
});

export default router;
