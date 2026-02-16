// app/api/predict/route.ts
// Runs your real Python AI Basics model: receives drawn pixels, returns prediction.

import { NextResponse } from "next/server";
import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pixels = body?.pixels;

    if (!Array.isArray(pixels) || pixels.length !== 784) {
      return NextResponse.json(
        { error: "Expected body: { pixels: number[] } with 784 elements" },
        { status: 400 }
      );
    }

    const tmpDir = os.tmpdir();
    const tmpPath = path.join(tmpDir, `mnist-pixels-${Date.now()}.json`);
    fs.writeFileSync(tmpPath, JSON.stringify({ pixels }), "utf8");

    const projectRoot = process.cwd();
    const aiBasicsDir = path.join(projectRoot, "project_raw", "AI Basics");
    const scriptPath = path.join(aiBasicsDir, "predict_web.py");

    if (!fs.existsSync(scriptPath)) {
      fs.unlinkSync(tmpPath);
      return NextResponse.json(
        { error: "Python predict script not found (project_raw/AI Basics/predict_web.py)" },
        { status: 500 }
      );
    }

    const pythonCmd = process.env.PYTHON_CMD || "python";
    let result = spawnSync(pythonCmd, [scriptPath, tmpPath], {
      cwd: aiBasicsDir,
      encoding: "utf8",
      timeout: 15000,
    });
    if (result.error?.message?.includes("ENOENT") && pythonCmd === "python") {
      result = spawnSync("python3", [scriptPath, tmpPath], {
        cwd: aiBasicsDir,
        encoding: "utf8",
        timeout: 15000,
      });
    }

    try {
      fs.unlinkSync(tmpPath);
    } catch {
      // ignore cleanup errors
    }

    if (result.error) {
      return NextResponse.json(
        {
          error: "Python not available on this server. Run the app where Python + NumPy are installed, or use the client-side weights flow.",
          detail: result.error.message,
        },
        { status: 503 }
      );
    }

    if (result.status !== 0) {
      return NextResponse.json(
        { error: "Prediction failed", stderr: result.stderr || result.error },
        { status: 500 }
      );
    }

    const output = result.stdout?.trim() || "{}";
    let data: { prediction?: number; confidences?: number[] };
    try {
      data = JSON.parse(output);
    } catch {
      return NextResponse.json(
        { error: "Invalid output from Python", stdout: output },
        { status: 500 }
      );
    }

    return NextResponse.json({
      prediction: data.prediction ?? 0,
      confidences: Array.isArray(data.confidences) ? data.confidences : new Array(10).fill(0),
    });
  } catch (e) {
    console.error("Predict API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Prediction failed" },
      { status: 500 }
    );
  }
}
