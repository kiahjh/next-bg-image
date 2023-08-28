_default:
 @just --choose

test:
 @pnpm --filter next-bg-image exec vitest

dev-playground:
 @pnpm --filter next-playground dev
