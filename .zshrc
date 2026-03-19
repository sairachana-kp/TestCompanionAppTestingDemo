# Auto-load .env in this project
if [ -f "$(pwd)/.env" ]; then
  source .env
fi