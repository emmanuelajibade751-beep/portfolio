import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const [command, ...args] = process.argv.slice(2);
const allowedCommands = new Set(["dev", "build", "start"]);

if (!allowedCommands.has(command)) {
  console.error("Usage: node scripts/run-vinext.mjs <dev|build|start> [...args]");
  process.exit(1);
}

const vinextCli = fileURLToPath(
  new URL("../node_modules/vinext/dist/cli.js", import.meta.url),
);

const child = spawn(process.execPath, [vinextCli, command, ...args], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
  },
  stdio: "inherit",
});

child.once("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});
