---
description: Run Jest tests for a specific component
argument-hint: ComponentName (e.g. Canvas, LayerStack, TilePanels)
---

Run tests for the component named $ARGUMENTS:

```bash
npx jest --testPathPattern="$ARGUMENTS" --watchAll=false
```

If tests fail because of missing Jotai context, wrap the component under test in `<Provider>` from `jotai`. Tests use `data-testid` attributes for querying and `userEvent` for interactions.

If $ARGUMENTS is empty, run the full test suite in watch mode:
```bash
npm run test
```
