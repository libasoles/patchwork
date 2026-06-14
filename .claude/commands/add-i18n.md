---
description: Add a new i18n string to Patchwork (English + Spanish)
argument-hint: "key and English value (e.g. 'toolbar.undo Undo')"
---

Add a new i18n string for $ARGUMENTS:

1. Open `messages/en.json` and add the key-value pair under the appropriate section
2. Open `messages/es.json` and add the Spanish translation for the same key
3. In the component, use `const t = useTranslations()` (from `next-intl`) and reference with `t('your.key')`

If the string is needed in Zustand store initialization (like layer default names), pass it from `App.tsx` after `router.isReady` — see `getLayerDefaultName` in `src/lib/i18n.ts` as a reference pattern.
