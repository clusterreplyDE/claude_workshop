#!/bin/bash
# MCP Setup Script — Module 7 Exercise
# Run these commands to set up MCP servers for the workshop

echo "=== Claude Code MCP Setup ==="
echo ""

# Option 1: GitHub MCP Server (recommended for workshop)
echo "Setting up GitHub MCP server..."
echo "Run: claude mcp add --transport stdio github -- npx -y @anthropic-ai/github-mcp"
echo ""

# Option 2: Filesystem MCP Server (alternative)
echo "Setting up Filesystem MCP server..."
echo "Run: claude mcp add --transport stdio filesystem -- npx -y @anthropic-ai/filesystem-mcp /path/to/directory"
echo ""

# Verify installation
echo "Verify with: claude mcp list"
echo "In session:  /mcp"
echo ""

# Project-scoped MCP (creates .mcp.json)
echo "For team-shared config:"
echo "Run: claude mcp add --scope project --transport stdio github -- npx -y @anthropic-ai/github-mcp"
echo ""

echo "=== Windows Users ==="
echo "If using native Windows (not WSL), prefix npx commands with 'cmd /c':"
echo "Run: claude mcp add --transport stdio github -- cmd /c npx -y @anthropic-ai/github-mcp"
