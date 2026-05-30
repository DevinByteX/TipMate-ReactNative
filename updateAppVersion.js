const fs = require('fs');
const readline = require('readline');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`${colors.bright}Enter the ${colors.cyan}versionName: ${colors.reset}`, versionName => {
  if (!versionName) {
    console.error('Invalid versionName. Please provide a versionName.');
    rl.close();
    return;
  }

  rl.question(
    `${colors.bright}Enter the ${colors.cyan}versionCode${colors.bright} (Android only, default = 1): ${colors.reset}`,
    versionCode => {
      if (!versionCode || isNaN(versionCode)) {
        versionCode = 1;
      }
      updateVersionInfo(versionCode, versionName);
      rl.close();
    },
  );
});

const updateVersionInfo = (versionCode, version) => {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageLockJsonPath = path.join(__dirname, 'package-lock.json');
  const buildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
  const pbxprojPath = path.join(__dirname, 'ios', 'TipCalculator.xcodeproj', 'project.pbxproj');

  try {
    // Android build.gradle
    let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
    buildGradleContent = buildGradleContent.replace(
      /versionName "[^"]*"/,
      `versionName "${version}"`,
    );
    buildGradleContent = buildGradleContent.replace(
      /versionCode\s+\d+/,
      `versionCode ${versionCode}`,
    );
    fs.writeFileSync(buildGradlePath, buildGradleContent, 'utf8');
    console.log(`Updated versionName in build.gradle to "${version}"`);

    // package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    console.log(`Updated package.json version to ${version}`);

    // package-lock.json
    const packageLockJson = JSON.parse(fs.readFileSync(packageLockJsonPath, 'utf8'));
    packageLockJson.version = version;
    if (packageLockJson.packages && packageLockJson.packages['']) {
      packageLockJson.packages[''].version = version;
    }
    fs.writeFileSync(packageLockJsonPath, JSON.stringify(packageLockJson, null, 2) + '\n', 'utf8');
    console.log(`Updated package-lock.json version to ${version}`);

    // iOS project.pbxproj (MARKETING_VERSION)
    let pbxprojContent = fs.readFileSync(pbxprojPath, 'utf8');
    pbxprojContent = pbxprojContent.replace(/(MARKETING_VERSION = )([^;\n]+)/g, `$1${version}`);
    fs.writeFileSync(pbxprojPath, pbxprojContent, 'utf8');
    console.log(`Updated MARKETING_VERSION in project.pbxproj to "${version}"`);

    // app/configs/appInfo.ts (APP_INFO.version)
    const appInfoPath = path.join(__dirname, 'app', 'configs', 'appInfo.ts');
    let appInfoContent = fs.readFileSync(appInfoPath, 'utf8');
    appInfoContent = appInfoContent.replace(/version:\s*'[^']*'/, `version: '${version}'`);
    fs.writeFileSync(appInfoPath, appInfoContent, 'utf8');
    console.log(`Updated APP_INFO.version in appInfo.ts to ${version}`);
  } catch (error) {
    console.error('Error updating version info:', error);
  }
};
