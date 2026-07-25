---
description: End current session
---

Before ending the session:

1. Review work completed during the session.
2. Inspect git status.
3. Review modified files.
4. Run npm run lint when source code changed.
5. Run npm run build when the project should compile.
6. Do not hide errors.

Update docs/context.md with:

- Current project status
- Current milestone
- Completed tasks
- Pending tasks
- Current architecture
- Important business rules
- Decisions taken
- Files modified
- Validation results
- Known issues
- Risks or blockers
- Exact next-session task

Update docs/progress.md with:

- Today's completed work
- Validation performed
- Pending work

Update docs/todo.md:

- Remove completed items
- Add remaining items
- Order work by priority

Update docs/architecture.md only when architecture changed.

Keep documentation clean and avoid duplicates.

Do not commit or push unless explicitly requested.

After updating the documents:

1. Provide a concise session summary
2. Recommend running /compact
3. Remind the user to run:

/compact focus on the current UNIPOLE implementation phase, completed work, modified files, animation architecture, known issues, validation results and exact next task
