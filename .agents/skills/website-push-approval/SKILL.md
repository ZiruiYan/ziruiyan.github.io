---
name: website-push-approval
description: Require action-time user approval before pushing commits from this repository to GitHub. Use whenever preparing, committing, publishing, or deploying changes in ZiruiYan/ziruiyan.github.io.
---

# Website Push Approval

Treat every push from this repository as a separately gated action.

- Complete local edits, builds, tests, reviews, and local commits without requesting push approval unless the user says otherwise.
- Immediately before any command or tool action that can upload Git commits or refs, stop and show:
  - the target remote and branch;
  - the exact commit hashes and subjects that are not yet on the remote;
  - a concise change summary and the verification already completed.
- Ask the user to explicitly approve that exact push. Do not infer approval from an earlier request to publish, deploy, finish the task, or push a different set of commits.
- After approval, recheck the working tree, target remote and branch, and pending commit list. Push only the reviewed commits. If any reviewed detail changed, present the updated summary and request approval again.
- Treat approval as consumed by the one described push. Every later push requires a new approval.
- Monitoring and verifying an already approved push do not require another push approval.
- If approval is not provided, leave the work local and report its commit and working-tree status.
