# Vercel Setup Guide

This guide explains how to set up Vercel deployment for PR previews of the Storybook.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Admin access to the GitHub repository
3. Access to repository secrets settings

## Setup Steps

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build-storybook`
   - **Output Directory**: `storybook-build`
   - **Install Command**: `npm install`

### 2. Get Vercel Tokens and IDs

After creating the project, you'll need to collect the following information:

#### Get Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token with a descriptive name (e.g., "GitHub Actions - Storybook Previews")
3. Copy the token value

#### Get Organization ID
1. Go to [Vercel Team Settings](https://vercel.com/teams)
2. Click on your team/organization
3. Go to "Settings" tab
4. Copy the "Team ID" (this is your Organization ID)

#### Get Project ID
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Scroll down to "General" section
4. Copy the "Project ID"

### 3. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following repository secrets:

| Secret Name | Description | Value |
|------------|-------------|--------|
| `VERCEL_TOKEN` | Vercel authentication token | The token from step 2 |
| `VERCEL_ORG_ID` | Vercel organization/team ID | The organization ID from step 2 |
| `VERCEL_PROJECT_ID` | Vercel project ID | The project ID from step 2 |

### 4. Configure Vercel Project Settings

1. In your Vercel project dashboard, go to Settings
2. Under "Git", ensure:
   - **Production Branch**: `main`
   - **Preview Branch**: All branches (or configure as needed)
3. Under "Environment Variables", add:
   - `NODE_VERSION`: `20.10.0`

### 5. Test the Setup

1. Create a test branch and make a small change to any component
2. Open a pull request
3. The GitHub Action should trigger automatically
4. Check that:
   - The workflow runs successfully
   - A preview URL is posted as a comment on the PR
   - The Storybook preview loads correctly

## How It Works

### Automatic Triggers
The Vercel preview deployment is triggered when:
- A pull request is opened targeting the `main` branch
- Changes are made to files in:
  - `packages/core/**`
  - `packages/cells/**` 
  - `packages/source/**`
  - `.storybook/**`
  - `vercel.json`

### Deployment Process
1. GitHub Actions checks out the code
2. Installs dependencies with `npm install`
3. Builds Storybook with `npm run build-storybook`
4. Deploys to Vercel using the Vercel Action
5. Posts a comment on the PR with the preview URL

### Preview URLs
- Each PR gets a unique preview URL
- The URL is updated automatically when new commits are pushed
- URLs remain active until the PR is closed

## Troubleshooting

### Common Issues

**Deployment fails with "Project not found"**
- Verify `VERCEL_PROJECT_ID` is correct
- Check that the Vercel token has access to the project

**Build fails during Storybook compilation**
- Check that all dependencies are properly installed
- Verify the build works locally with `npm run build-storybook`

**Preview URL not posted to PR**
- Check GitHub Actions logs for errors
- Verify `GITHUB_TOKEN` has proper permissions
- Ensure the workflow has `pull-requests: write` permission

**Node.js version mismatch**
- Update `NODE_VERSION` in Vercel project settings
- Ensure it matches the version in `.nvmrc` and workflow files

### Getting Help

If you encounter issues:
1. Check the GitHub Actions workflow logs
2. Check the Vercel deployment logs in the Vercel dashboard
3. Verify all secrets are correctly set
4. Ensure the Vercel project configuration matches this guide

## Security Notes

- Keep your Vercel token secure and rotate it regularly
- Use the principle of least privilege for token permissions
- Monitor Vercel usage to avoid unexpected costs
- Review preview deployments before sharing externally