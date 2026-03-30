import { Router } from "express";
import { createShortUrl, redirectUrl, getStats, generateQRCode } from "./shortener.js";

const router = Router();

// Endpoint for generating a short code from an original URL
router.post("/shorten", createShortUrl);

// Endpoint for redirecting from a short code to the original URL
router.get("/:shortcode", redirectUrl);

// Endpoint for getting usage statistics of a short code
router.get("/:shortcode/stats", getStats);

// Endpoint for generating QR Code of a short code
router.get("/:shortcode/qr", generateQRCode);

export default router;
