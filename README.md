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
