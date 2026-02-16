import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import * as fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const functionDir = __dirname;
const projectRoot = path.resolve(functionDir, "..", "..");
const sourceModelPath = path.join(projectRoot, "project_raw", "AI Basics", "models", "mnist_model.npz");

export const digitPredictFunction = defineFunction(
  (scope) =>
    new Function(scope, "digit-predict", {
      handler: "index.handler",
      runtime: Runtime.PYTHON_3_12,
      timeout: Duration.seconds(30),
      memorySize: 512,
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("dummy"),
          local: {
            tryBundle(outputDir: string) {
              const reqPath = path.join(functionDir, "requirements.txt");
              execSync(
                `python3 -m pip install -r "${reqPath}" -t "${outputDir}" --platform manylinux2014_x86_64 --only-binary=:all:`,
                { stdio: "inherit" }
              );
              for (const name of fs.readdirSync(functionDir)) {
                if (name === "resource.ts" || name === "node_modules") continue;
                const src = path.join(functionDir, name);
                const dest = path.join(outputDir, name);
                if (fs.statSync(src).isDirectory()) continue;
                fs.copyFileSync(src, dest);
              }
              const modelsDir = path.join(outputDir, "models");
              fs.mkdirSync(modelsDir, { recursive: true });
              if (fs.existsSync(sourceModelPath)) {
                fs.copyFileSync(
                  sourceModelPath,
                  path.join(modelsDir, "mnist_model.npz")
                );
              }
              return true;
            },
          },
        },
      }),
    })
);
