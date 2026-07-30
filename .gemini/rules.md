# Antigravity Agent Workspace Rules

You are working in the `lengon/cake-recipe-app` project. You MUST ALWAYS strictly adhere to the project's Git Version Control & Development SOP (`GIT_WORKFLOW_STANDARD.md`):

1. **Never mutate/overwrite recipes or files without verification**:
   Before performing large file edits or refactors, check `git status` to ensure clean working state.

2. **Verify Code Execution Before Declaring Completion**:
   After making edits to `code_artifact.html`, `recipes_data.js`, or any application code, ALWAYS run verification scripts (e.g. `node test_in_jsdom.js`) to confirm 0 errors and proper DOM rendering.

3. **Atomic Commit & Auto GitHub Push**:
   After completing any code edit or feature implementation, ALWAYS automatically run:
   - `git add .`
   - `git commit -m "<type>: <description>"`
   - `git push origin main`

4. **Document Changes**:
   Update `walkthrough.md` with brief notes on changes made and verification results.
