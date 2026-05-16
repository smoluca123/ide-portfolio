#!/usr/bin/env node
/**
 * Tiny cross-platform wrapper that runs the given command with
 * NODE_OPTIONS="--use-system-ca". This makes Node trust certificates from the
 * OS trust store (Windows trust store / macOS Keychain), which is required on
 * machines behind a TLS-intercepting proxy or antivirus (Zscaler, Kaspersky,
 * Bitdefender, Netskope, ...).
 *
 * Usage:
 *   node scripts/with-system-ca.mjs next dev
 */
import { spawn } from "node:child_process"

const [, , cmd, ...args] = process.argv
if (!cmd) {
  console.error("Usage: node scripts/with-system-ca.mjs <command> [args...]")
  process.exit(1)
}

const existing = process.env.NODE_OPTIONS ?? ""
const flag = "--use-system-ca"
const nodeOptions = existing.includes(flag)
  ? existing
  : `${existing} ${flag}`.trim()

const child = spawn(cmd, args, {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_OPTIONS: nodeOptions },
})

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 0)
})
