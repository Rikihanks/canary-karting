import fs from 'fs';
import readline from 'readline';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targets = {
    main: {
        repo: 'https://github.com/Rikihanks/canary-karting.git',
        homepage: 'https://rikihanks.github.io/canary-karting',
        base: '/canary-karting/'
    },
    app: {
        repo: 'https://github.com/canarykarting/canary-karting-app.git',
        homepage: 'https://canarykarting.github.io/canary-karting-app',
        base: '/canary-karting-app/'
    }
};

const targetName = process.argv[2];

if (!targets[targetName]) {
    console.error(`Invalid target: ${targetName}. Available targets: ${Object.keys(targets).join(', ')}`);
    process.exit(1);
}

const target = targets[targetName];
const packageJsonPath = path.resolve(__dirname, '../package.json');
const originalPackageJson = fs.readFileSync(packageJsonPath, 'utf-8');
const packageData = JSON.parse(originalPackageJson);

console.log(`Preparing deployment for target: ${targetName}`);
console.log(`Repo: ${target.repo}`);
console.log(`Homepage: ${target.homepage}`);
console.log(`Base: ${target.base}`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`\n⚠️  WARNING: You are about to deploy to [ ${targetName.toUpperCase()} ].\n   Repo: ${target.repo}\n   Are you sure? (y/N) `, (answer) => {
    rl.close();
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('Deployment cancelled.');
        process.exit(0);
    }

    try {
        // 1. Update package.json homepage
        packageData.homepage = target.homepage;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2));
        console.log('Updated package.json homepage.');

        // 2. Build with correct base
        console.log(`Building with base: ${target.base}...`);
        execSync(`vite build --base=${target.base}`, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

        // 3. Deploy
        console.log(`Deploying to ${target.repo}...`);
        execSync(`npx gh-pages -d dist -r ${target.repo}`, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

        console.log('Deployment successful!');

    } catch (error) {
        console.error('Deployment failed:', error);
        process.exitCode = 1;
    } finally {
        // 4. Revert package.json
        fs.writeFileSync(packageJsonPath, originalPackageJson);
        console.log('Reverted package.json.');
    }
});
