# Oracle Fury

A deterministic narrative RPG engine with relationships, downtime phases, and comprehensive safety filters.

## Overview

Oracle Fury is a TypeScript-first monorepo implementing a narrative RPG engine designed for:
- **Deterministic gameplay**: Same seed produces same story events
- **Relationship dynamics**: Heat/Bond system with decay mechanics
- **Downtime phases**: Hyperspace, Camp, and Base activities
- **Safety-first design**: Comprehensive content filtering with admin overrides
- **Modular content**: Data-driven modules for campaigns and expansions

## Architecture

```
oracle-fury/
├── packages/
│   ├── core/          # Engine library
│   ├── app/           # React web UI
│   └── tools/         # CLI utilities
├── examples/          # Demo campaigns
├── docs/              # Documentation
└── server/            # (Future) Auth & sync
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server
pnpm dev

# Run tests
pnpm test
```

## Core Features

### 1. Seeded Random Number Generation
- Deterministic story generation using splitmix32 algorithm
- Derived seeds for subsystems
- Weighted selection and probability resolution

### 2. Relationship System
- **Heat**: Short-term emotional intensity (-5 to +5)
- **Bond**: Long-term connection strength (-5 to +5)
- Decay mechanics during downtime
- Relationship types: romantic, friendship, rivalry, professional, family, mentor, neutral
- Modifiers for social interactions

### 3. Downtime Phases
- **Hyperspace**: Meditation, ship maintenance
- **Camp**: Socialize, rest, personal time
- **Base**: Training, shopping, mission planning
- Action point system with cooldowns

### 4. Probability Resolution
- Sigmoid/logit transformation for modifier stacking
- Trace system for debugging and UI display
- Dice rolling with NdM+K notation
- Contested checks with margin of success

### 5. Event DSL (Coming Soon)
- JSON/YAML event definitions
- Conditional triggers and weighted selection
- State effects and narrative branching
- Validation and linting tools

### 6. Safety System (Coming Soon)
- Pre-LLM prompt constraints
- Post-generation content filtering
- Commander's Discretion override with audit logging
- Protected tags and consent management

## Web UI Features

- **Response Window**: Streamed narrative with turn tracking
- **Prompt Box**: Context-aware action interface
- **Party Panel**: Character stats and conditions
- **Relationship Panel**: Relationship tracking
- **Save/Load**: Persistent game state
- **Admin Panel**: Safety overrides and debugging

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Package Scripts

```bash
# Core package
pnpm --filter @oracle-fury/core build
pnpm --filter @oracle-fury/core test

# App package
pnpm --filter @oracle-fury/app dev
pnpm --filter @oracle-fury/app build

# Tools package
pnpm --filter @oracle-fury/tools build
```

### Testing

The project uses Vitest for unit tests and Playwright for E2E tests:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm --filter @oracle-fury/core test --watch

# Run E2E tests
pnpm --filter @oracle-fury/app test:e2e
```

## Roadmap

### Phase 1: Core Engine ✅
- [x] Seeded RNG implementation
- [x] Probability resolution system
- [x] Relationship mechanics
- [x] Downtime phase system
- [x] Basic web UI

### Phase 2: Content & Safety
- [ ] Event table DSL
- [ ] Safety filter system
- [ ] LLM integration abstraction
- [ ] Module system
- [ ] Persistence & migrations

### Phase 3: Polish & Expansion
- [ ] Example campaign: "Star Hauler: Echo Run"
- [ ] CLI tools for content creation
- [ ] Comprehensive documentation
- [ ] Multiplayer support (stretch)

## Contributing

This project is currently in early development. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT © Oracle Fury Team