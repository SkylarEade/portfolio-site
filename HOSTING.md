# Hosting Your Portfolio on AWS (No Local AWS Setup Required)

**You do not need to run anything locally.** Push your repo to GitHub (or GitLab/Bitbucket), connect it to **Amplify Hosting**, and AWS will build and run everything—including your **AI Basics** Python model—on their servers.

---

## Deploy via Amplify Hosting (recommended)

1. **Push your code to Git**
   - Ensure `project_raw/AI Basics/models/mnist_model.npz` is in the repo (so the Lambda build can use it).
   - Push to GitHub, GitLab, or Bitbucket.

2. **Connect the repo to Amplify**
   - In [AWS Amplify Console](https://console.aws.amazon.com/amplify/): **Create new app** → **Host web app**.
   - Connect your Git provider and select this repository and branch.
   - Amplify will use the `amplify.yml` in the repo: it runs **backend** build (`npx ampx pipeline-deploy`) and **frontend** build (`npm run build`) on **AWS’s build servers**. No local credentials needed.

3. **Deploy**
   - Save and deploy. Amplify will:
     - Deploy the backend (auth, data, **Python Lambda** for digit prediction).
     - Build the Next.js app.
     - Inject `amplify_outputs.json` so the site talks to your backend.
   - Your AI Basics model runs in **AWS Lambda**; the site calls it via the Data API.

Your **AI Basics** directory is already part of the repo (`project_raw/AI Basics/`). The Lambda code in `amplify/functions/digit-predict/` uses that logic and copies the model from `project_raw/AI Basics/models/mnist_model.npz` during the build. So you’re not “uploading” a separate service—you push the repo once, and AWS runs it.

---

## If You See “InvalidCredentialError” (only when using sandbox)

That error appears when you run **`npx ampx sandbox`** on your machine and no AWS credentials are configured. You have two options:

**Option A – Don’t use sandbox**  
Use **Amplify Hosting** (steps above). No local AWS credentials required; the pipeline runs in AWS.

**Option B – Use sandbox (e.g. to test the backend locally)**  
Then you must configure credentials once:

1. **Create an access key in AWS**
   - [IAM → Users](https://console.aws.amazon.com/iam/home#/users) → your user → **Security credentials** → **Create access key** (use “CLI” if asked). Copy **Access key ID** and **Secret access key**.

2. **Configure Amplify**
   ```bash
   npx ampx configure profile
   ```
   - Enter a profile name (e.g. `default`).
   - When asked for **accessKeyId** and **secretAccessKey**, paste the values from step 1.

3. **Run sandbox with that profile**
   ```bash
   npx ampx sandbox --profile default
   ```

Or, if you already use the AWS CLI:
   ```bash
   aws configure
   ```
   then:
   ```bash
   npx ampx sandbox --profile default
   ```

---

## Summary

| What you want              | What to do                                                                 |
|----------------------------|----------------------------------------------------------------------------|
| **Host the app (no local)**| Push to Git → Amplify Console → connect repo → deploy. AWS runs everything. |
| **Run backend locally**    | Configure AWS credentials, then `npx ampx sandbox --profile <name>`.      |

Your Python (AI Basics) runs on **AWS Lambda** when the app is deployed via Amplify Hosting; you don’t need to run it on your own machine.
