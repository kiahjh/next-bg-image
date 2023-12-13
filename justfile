_default:
 @just --choose

build:
  @rm -rf next-bg-image/dist
  @pnpm --filter next-bg-image build

test:
 @pnpm --filter next-bg-image exec vitest

dev-playground:
 @pnpm --filter next-playground dev
