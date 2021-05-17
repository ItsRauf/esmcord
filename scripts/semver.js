import { readFile, writeFile } from 'fs/promises';
import semver from 'semver';

(async () => {
  const packageJSON = await readFile('./package.json');
  const { name, version, ...pkg } = JSON.parse(packageJSON);
  const commits = process.env.GitHubCommits
    ? JSON.parse(process.env.GitHubCommits)
    : [];
  let rel = 'patch';
  if (commits.length <= 10) {
    rel = 'patch';
  } else if (commits.length <= 50) {
    rel = 'minor';
  } else {
    rel = 'major';
  }
  const semverVersion = semver.inc(version, rel);
  await writeFile(
    './package.json',
    JSON.stringify({ name, version: semverVersion, ...pkg }, null, 2)
  );
  console.log(semverVersion);
})();
