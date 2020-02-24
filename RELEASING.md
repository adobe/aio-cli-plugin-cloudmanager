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
git commit -m "Incremented version to $PKG_VER" package.json package-lock.json README.md
```

## 3. Tag a version

```
git tag $PKG_VER
```

## 4. Push version and tag

```
git push origin master
git push origin $PKG_VER
```

## 5. publish to npm

```
npm publish --access public
```

## 6. update GitHub release

```
npm run update-release
```

> See https://github.com/github-tools/github-release-notes to set up the token

## 7. update changelog

```
npm run update-changelog
git commit -m "Update CHANGELOG for $PKG_VER" CHANGELOG.md
git push origin master
```
