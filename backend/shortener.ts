import type { Request, Response } from "express";
import crypto from "crypto";
import QRCode from "qrcode";
import { Redirect } from "./models.js";

interface CreateShortUrlBody {
  url: string;
}

interface ShortcodeParams {
  shortcode: string;
}

export const createShortUrl = async (
  req: Request<object, unknown, CreateShortUrlBody>,
  res: Response,
) => {
  try {
    // 1. Get original URL from req.body
    const url = req.body.url;

    // 2. Validate URL
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    let parsedURL: URL;

    try {
      parsedURL = new URL(url);
    } catch (err) {
      res.status(400).json({ error: `Invalid URL. Error: ${err}` });
      return;
    }

    if (!["http:", "https:"].includes(parsedURL.protocol)) {
      res
        .status(400)
        .json({ error: "URL must begin with http:// or https://" });
      return;
    }

    // Create encoding
    const shortCode = crypto.randomBytes(6).toString("base64url");

    // 4. Save to database
    const redirect = new Redirect({ id: shortCode, url });
    await redirect.save();

    // 5. Return short URL response
    const host = req.headers.host || "localhost";
    const shortUrl = `http://${host}/${shortCode}`;
    res.status(201).json({ shortCode, shortUrl, url });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to create short URL. Error: ${err}` });
  }
};

export const redirectUrl = async (
  req: Request<ShortcodeParams>,
  res: Response,
) => {
  try {
    const shortCode = req.params.shortcode;

    // Find original URL in database and increment clicks
    const redirect = await Redirect.findOneAndUpdate(
      { id: shortCode },
      { $inc: { clicks: 1 } },
    );

    // If not found, return 404
    if (!redirect) {
      return res.status(404).json({ error: "Not found" });
    }

    // If found, redirect to original URL
    res.redirect(redirect.url);
  } catch (err) {
    res.status(500).json({ error: `Internal server error. Error: ${err}` });
  }
};

export const getStats = async (
  req: Request<ShortcodeParams>,
  res: Response,
) => {
  try {
    // 1. Get shortcode from req.params
    const shortCode = req.params.shortcode;

    // 2. Find stats in database
    const redirect = await Redirect.findOne({ id: shortCode });

    // 3. Return stats
    if (!redirect) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(200).json({ clicks: redirect.clicks });
  } catch (err) {
    res.status(500).json({ error: `Internal server error. Error: ${err}` });
  }
};

export const generateQRCode = async (
  req: Request<ShortcodeParams>,
  res: Response,
) => {
  try {
    const shortCode = req.params.shortcode;
    const redirect = await Redirect.findOne({ id: shortCode });

    if (!redirect) {
      return res.status(404).json({ error: "Not found" });
    }

    const host = req.headers.host || "localhost";
    const shortUrl = `http://${host}/${shortCode}`;

    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);
    res.status(200).json({ qrCode: qrCodeDataUrl });
  } catch (err) {
    res.status(500).json({ error: `Internal server error. Error: ${err}` });
  }
};

