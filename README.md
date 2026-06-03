Change the code of package.json into this:
{
  "name": "workspace",
  "version": "0.0.0",
  "license": "MIT",
  "packageManager": "pnpm@11.1.2",
  "scripts": {
    "build": "pnpm run typecheck && pnpm -r --if-present run build",
    "typecheck:libs": "tsc --build",
    "typecheck": "pnpm run typecheck:libs && pnpm -r --filter \"./artifacts/**\" --filter \"./scripts\" --if-present run typecheck"
  },
  "private": true,
  "devDependencies": {
    "prettier": "^3.8.3",
    "typescript": "~5.9.3",
    "@rollup/rollup-win32-x64-msvc": "4.61.0",
    "lightningcss-win32-x64-msvc": "1.32.0",
    "@tailwindcss/oxide-win32-x64-msvc": "4.3.0"
  }
}

cd into Yas
pnpm install --filter @workspace/startpage
pnpm --filter @workspace/startpage run build

If it fails try again 

cd 
# This deletes all the previous build things
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue
pnpm install --filter @workspace/startpage
pnpm --filter @workspace/startpage run build
