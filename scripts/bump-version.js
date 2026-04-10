const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const type = process.argv[2] || 'patch'; // major, minor, patch
if (!['major', 'minor', 'patch'].includes(type) && !type.match(/^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$/)) {
    console.error('Usage: npm run bump-version -- [major|minor|patch|specify-version]');
    process.exit(1);
}

try {
    // Run npm version which handles bumping package.json, creating a commit, and tagging it
    console.log(`Bumping version (${type})...`);
    
    // We add --no-git-tag-version first if we wanted to customize, but npm version does exactly what we need
    const result = execSync(`npm version ${type} -m "chore: bump version to %s"`, {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8'
    });
    
    console.log(result.trim());
    console.log(`\nSuccessfully bumped version.`);
    console.log(`To trigger the release pipeline, push to GitHub with tags:`);
    console.log(`  git push --follow-tags`);
} catch (error) {
    console.error('Failed to bump version. Note: your working directory must be clean.');
    console.error(error.message);
    process.exit(1);
}
