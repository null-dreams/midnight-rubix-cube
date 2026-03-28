import type { Request, Response } from "express";
import crypto from "crypto";
import { Redirect } from "./models.js";

interface CreateShortUrlBody {
  url: string;
}

interface ShortcodeParams {
  shortcode: string;
}

export const createShortUrl = async (req: Request<{}, any, CreateShortUrlBody>, res: Response) => {
  try {
    // 1. Get original URL from req.body
    const url = req.body.url;
    
    // 2. Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // 3. Generate shortcode
    const tsBuffer = Buffer.alloc(6);
    tsBuffer.writeUIntBE(Date.now(), 0, 0);
    const randomBuffer = crypto.randomBytes(6);
    
    // Combine timestamp and random bytes into a single buffer
    const combinedBuffer = Buffer.concat([tsBuffer, randomBuffer]);
    
    // Create combined encoding
    const shortCode = combinedBuffer.toString("base64url");

    // 4. Save to database
    const redirect = new Redirect({ id: shortCode, url });
    await redirect.save();

    // 5. Return short URL response
    const host = req.headers.host || "localhost";
    const shortUrl = `http://${host}/${shortCode}`;
    res.status(201).json({ shortCode, shortUrl, url });
  } catch (error) {
    res.status(500).json({ error: "Failed to create short URL" });
  }
};

export const redirectUrl = async (req: Request<ShortcodeParams>, res: Response) => {
  try {
    const shortCode = req.params.shortcode;
    
    // Find original URL in database and increment clicks
    const redirect = await Redirect.findOneAndUpdate(
      { id: shortCode },
      { $inc: { clicks: 1 } }
    );
    
    // If not found, return 404
    if (!redirect) {
      return res.status(404).json({ error: "Not found" });
    }
    
    // If found, redirect to original URL
    res.redirect(redirect.url);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStats = async (req: Request<ShortcodeParams>, res: Response) => {
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

  } catch (error) {
    res.status(500).json({error: "Internal server error" });
  }
};
