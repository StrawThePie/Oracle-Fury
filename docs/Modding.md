### Modding Guide

- Create a module folder under `examples/<your-module>` with a `module.json` manifest.
- Author event tables in JSON or YAML arrays matching `event.schema.json`.
- Validate with CLI: `pnpm --filter @oracle-fury/tools build && ofury validate examples/echo-run/events.yaml event.schema.json`.
- Preview RNG: `ofury preview-rolls 12345 _ 10`.