const args = process.argv.slice(2)
const {execSync, spawn} = require("child_process");
const { error } = require("console");

let output;

switch(args[0]) {
    case "test":
        (async () => {
            await runCommand('jekyll', ['build'])
            await runCommand('jekyll', ['serve', '--livereload'])
        })().catch(err => {
            console.error('Unhandled error:', err)
            process.exit(1)
        })
        break
    case "publish":
        (async () => {
            const commitMsg = args.slice(1).join(' ')
            await runCommand('jekyll', ['build'])
            await runCommand('git', ['add', '.'])
            await runCommand('git', ['commit'])
            await runCommand('git', ['push'])
        })().catch(err => {
            console.error('Unhandled error:', err)
            process.exit(1)
        })
        break
}


function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: 'inherit', shell: true }); // Streams directly

    proc.on('error', reject);

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}
