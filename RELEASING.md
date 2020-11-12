## 0. Remove any danging oclif manifest

```
rm oclif.manifest.json
```

## 1. Increment a version

```
npm --no-git-tag-version version [major | minor | patch]
# get the package.json version in a variable
export PKG_VER=`node -e "console.log(require('./package.json').version)"`
```
## 2. Commit the changed files
```
git commit -m "Release $PKG_VER" package.json README.md
```

## 3. Push it

```
git push origin main
```

## 4. publish the GitHub release

Not sure why this is needed, it should be handled by gren...

## 6. update GitHub release

```
npm run update-release
```

> See https://github.com/github-tools/github-release-notes to set up the token

## 7. update changelog

```
npm run update-changelog
git commit -m "Update CHANGELOG for $PKG_VER" CHANGELOG.md
git push origin main
```
