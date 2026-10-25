#!/usr/bin/env bash
# Recreate the voice-rendering tooling (venv + Kokoro model) on Linux cloud sessions.
# Idempotent and quiet when everything is already in place. Does nothing off the cloud
# (CLAUDE_CODE_REMOTE != true) unless run with --force.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ] && [ "${1:-}" != "--force" ]; then
  exit 0
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV="$HERE/.venv"
PY="$VENV/bin/python"
MODELS="$HERE/models"
BASE="https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"

export PATH="$HOME/.local/bin:$PATH"
if ! command -v uv >/dev/null 2>&1; then
  echo "setup.sh: installing uv"
  python3 -m pip install --quiet --user uv
  export PATH="$HOME/.local/bin:$PATH"
fi

if [ ! -x "$PY" ]; then
  echo "setup.sh: creating Python 3.12 venv"
  uv venv --quiet --python 3.12 "$VENV"
fi

if ! "$PY" -c 'import kokoro_onnx, soundfile' >/dev/null 2>&1; then
  echo "setup.sh: installing kokoro-onnx and soundfile"
  uv pip install --quiet --python "$PY" kokoro-onnx soundfile
fi

mkdir -p "$MODELS"
for f in kokoro-v1.0.int8.onnx voices-v1.0.bin; do
  if [ ! -s "$MODELS/$f" ]; then
    echo "setup.sh: downloading $f"
    curl -fL --silent --show-error -o "$MODELS/$f.part" "$BASE/$f"
    mv "$MODELS/$f.part" "$MODELS/$f"
  fi
done

if ! command -v afconvert >/dev/null 2>&1 && ! command -v ffmpeg >/dev/null 2>&1; then
  echo "setup.sh: WARNING: neither afconvert nor ffmpeg found; render.py cannot make m4a clips" >&2
fi
