_default:
  @just --choose

test:
  @pnpm --filter next-bg-image exec vitest

check: build
  @pnpm --filter next-bg-image exec vitest run

build:
  @rm -rf next-bg-image/dist
  @pnpm --filter next-bg-image compile

publish *FLAGS: build
  @cd next-bg-image && npub {{FLAGS}}

dev-playground:
  @pnpm --filter next-playground dev
