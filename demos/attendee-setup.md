# Workshop Attendee Setup

Complete this setup before starting the workshop demos. You will clone the public workshop repository and push it to a new, independent repository owned by your persona organization on `tdcj.ghe.com`.

## What You'll Accomplish

By the end of this setup, you will:

- [ ] Have a local copy of the workshop repository
- [ ] Have a new Internal repository in your persona organization
- [ ] Have the Enterprise repository configured as `origin`
- [ ] Retain the public workshop repository as `upstream`
- [ ] Confirm that your Enterprise repository is not a fork

**Estimated Time:** 10 minutes

## Prerequisites

Before starting, confirm that you have:

- Git installed
- [GitHub CLI](https://cli.github.com/) installed
- Access to [tdcj.ghe.com](https://tdcj.ghe.com)
- Credentials for your pre-provisioned persona account
- The name of your persona organization
- Permission to create repositories in that organization

Use your persona identity for all actions on `tdcj.ghe.com`. Do not use a personal GitHub account.

## Step 1: Clone the Public Repository

Open a terminal and run:

```bash
git clone https://github.com/nate-demo/tdcj-copilot-intermediate.git
cd tdcj-copilot-intermediate
```

Confirm that the default branch is `main` and the public repository is currently named `origin`:

```bash
git branch --show-current
git remote -v
```

**Expected Result:** The current branch is `main`, and the `origin` fetch and push URLs point to `https://github.com/nate-demo/tdcj-copilot-intermediate.git`.

## Step 2: Create an Empty Enterprise Repository

1. Sign in to [tdcj.ghe.com](https://tdcj.ghe.com) with your persona account.
2. Open the **New repository** page.
3. Select your persona organization as the **Owner**.
4. Enter `tdcj-copilot-intermediate` as the **Repository name**.
5. Select **Internal** visibility.
6. Leave **Add a README file**, **Add .gitignore**, and **Choose a license** unselected.
7. Create the repository.

> [!IMPORTANT]
> Create a new, empty repository. Do not use **Fork** or an import workflow. Initializing the destination with files can cause the first push to fail.

**Expected Result:** The new repository page shows an empty Internal repository under your persona organization and provides setup commands for pushing an existing repository.

## Step 3: Configure the Git Remotes

Rename the public source remote from `origin` to `upstream`:

```bash
git remote rename origin upstream
```

On the new Enterprise repository page, copy its **HTTPS** URL. Add it as `origin`, replacing `PERSONA-ORG` with the name of your persona organization:

```bash
git remote add origin https://tdcj.ghe.com/PERSONA-ORG/tdcj-copilot-intermediate.git
git remote -v
```

Your remotes should now have these roles:

- `origin`: your persona organization's repository on `tdcj.ghe.com`
- `upstream`: the public workshop source on `github.com`

Check the URLs carefully before pushing. Both the fetch and push URL for each remote should point to the expected host.

## Step 4: Authenticate Git for GitHub Enterprise

Authenticate with your persona account through the browser, configure Git to use the resulting credential, and verify the active identity:

```bash
gh auth login --hostname tdcj.ghe.com --git-protocol https --web
gh auth setup-git --hostname tdcj.ghe.com
gh auth status --hostname tdcj.ghe.com
```

Complete the browser prompt with your `tdcj.ghe.com` persona identity. Before continuing, confirm that `gh auth status` reports the expected persona account and uses HTTPS for Git operations.

> [!IMPORTANT]
> Do not enter an account password into a Git password prompt. If browser authentication is blocked or the reported account is incorrect, stop and ask the workshop instructor for help before pushing.

## Step 5: Push to GitHub Enterprise

Push `main` to the new repository and configure it as the tracked branch:

```bash
git push -u origin main
```

**Expected Result:** The push completes successfully, and your local `main` branch tracks `origin/main`.

## Step 6: Verify the Setup

Refresh your repository page on `tdcj.ghe.com` and confirm:

- [ ] The owner is your persona organization
- [ ] The repository name is `tdcj-copilot-intermediate`
- [ ] The visibility is **Internal**
- [ ] The `main` branch contains the workshop files
- [ ] The page does not show a **forked from** relationship

Verify the local configuration:

```bash
git remote -v
git branch -vv
```

The `origin` URLs must use `tdcj.ghe.com`, the `upstream` URLs must use `github.com/nate-demo`, and `main` must track `origin/main`.

## Troubleshooting

### Push reports permission denied or repository not found

- Confirm that `origin` contains the correct persona organization name.
- Run `gh auth status --hostname tdcj.ghe.com` and confirm that it reports the persona account.
- Confirm that the persona has permission to create and push to repositories in the organization.
- Ask the workshop instructor for help with Enterprise access or authentication policy.

### Push is rejected because the remote contains work

The Enterprise repository was probably initialized with a README, `.gitignore`, or license. Delete and recreate it as an empty repository, then retry the push. Do not force-push over unexpected content.

### The wrong repository is configured as `origin`

Copy the correct HTTPS URL from the Enterprise repository and run:

```bash
git remote set-url origin https://tdcj.ghe.com/PERSONA-ORG/tdcj-copilot-intermediate.git
git remote -v
```

## Continue to the Workshop

Install the dependencies and start the application:

```bash
npm install
npm run dev
```

Then continue with the [Features Demo](features-demo.md).
