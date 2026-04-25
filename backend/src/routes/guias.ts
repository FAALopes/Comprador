import express, { Router } from "express";
import multer from "multer";
import {
  uploadGuia,
  getAllGuias,
  getGuiaById,
  deleteGuia,
  updateGuia,
} from "../controllers/guiasController.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF são permitidos"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Routes
router.post("/upload", upload.single("file"), uploadGuia);
router.get("/", getAllGuias);
router.get("/:id", getGuiaById);
router.patch("/:id", updateGuia);
router.delete("/:id", deleteGuia);

export default router;
