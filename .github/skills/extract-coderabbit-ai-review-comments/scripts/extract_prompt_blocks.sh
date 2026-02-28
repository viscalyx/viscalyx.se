#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <input-file|-> <output-file>" >&2
  exit 1
fi

input_file="$1"
output_file="$2"

cleanup_temp_input_file() {
  local temp_file="${temp_input_file:-}"
  if [[ -n "$temp_file" && -f "$temp_file" ]]; then
    rm -f "$temp_file"
  fi
}
trap cleanup_temp_input_file EXIT ERR

if [[ "$input_file" == "-" ]]; then
  temp_input_file="$(mktemp)"
  cat > "$temp_input_file"
  input_file="$temp_input_file"
fi

if [[ ! -f "$input_file" ]]; then
  echo "Input file not found: $input_file" >&2
  exit 1
fi

awk '
function dequote(s) {
  sub(/^> ?/, "", s)
  return s
}

BEGIN {
  waiting = 0
  in_code = 0
  count = 0
  in_block = 0
  drop_next_blank = 0
  leadin = "Verify each finding against the current code and only fix it if needed."
}

{
  line = $0
  norm = dequote(line)

  if (!in_code) {
    if (norm ~ /^<summary>🤖 Prompt for AI Agents<\/summary>$/) {
      waiting = 1
      next
    }

    if (waiting && norm ~ /^```/) {
      in_code = 1
      in_block = 1
      drop_next_blank = 0
      if (count > 0) {
        print ""
      }
      count++
      next
    }

    next
  }

  if (norm ~ /^```/) {
    in_code = 0
    waiting = 0
    in_block = 0
    drop_next_blank = 0
    next
  }

  if (in_block && norm == leadin) {
    drop_next_blank = 1
    next
  }

  if (in_block && drop_next_blank && norm == "") {
    drop_next_blank = 0
    next
  }

  if (in_block && norm == "") {
    next
  }

  in_block = 0
  drop_next_blank = 0
  print norm
}
' "$input_file" > "$output_file"
