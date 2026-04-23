#!/bin/bash
# PreToolUse hook: block dangerous Bash commands
# $TOOL_INPUT contains JSON like: {"command": "rm -rf /", ...}

# Block rm -rf on important paths
if echo "$TOOL_INPUT" | grep -q '"command".*rm.*-rf.*/'; then
  echo "BLOCKED: Recursive deletion of important directories."
  exit 2
fi

# Block sudo rm
if echo "$TOOL_INPUT" | grep -q '"command".*sudo.*rm'; then
  echo "BLOCKED: sudo rm is not allowed."
  exit 2
fi

# Block git force-push to main
if echo "$TOOL_INPUT" | grep -q '"command".*git.*push.*--force.*main'; then
  echo "BLOCKED: Force-push to main is not allowed."
  exit 2
fi

exit 0
