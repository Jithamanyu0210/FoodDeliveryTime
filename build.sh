#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "===> Installing Frontend Dependencies & Building React App..."
cd frontend
npm install
npm run build
cd ..

echo "===> Installing Python Dependencies..."
pip install -r backend/requirements.txt

echo "===> Build Completed Successfully!"
