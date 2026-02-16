// app/api/model-weights/route.ts
// API route to serve model weights from the backend
// This serves the converted weights from the AI Basics project

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Load from public folder (converted from .npz)
    const publicPath = path.join(process.cwd(), "public", "model_weights.json");
    
    console.log("API route called - checking for weights at:", publicPath);
    
    if (fs.existsSync(publicPath)) {
      const fileContents = fs.readFileSync(publicPath, "utf8");
      const weights = JSON.parse(fileContents);
      
      return NextResponse.json(weights, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      });
    }
    
    // If not in public, return error with instructions
    console.log("Weights file not found at:", publicPath);
    return NextResponse.json(
      { 
        error: "Model weights not found. Please run the conversion script first.",
        instructions: "Run: python scripts/convert_npz_to_json.py",
        path: publicPath
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error loading model weights:", error);
    return NextResponse.json(
      { error: "Failed to load model weights", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
