import express from "express";

const router = express.Router();

router.get("/chatroom", (_req, res) => {
  res.render("chatroom.ejs", {
    pageTitle: "Chat room",
  });
});

export default router;
