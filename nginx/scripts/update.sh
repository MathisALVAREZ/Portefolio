#!/bin/bash
# ═══════════════════════════════════════════════════════════
# scripts/update.sh
# Met à jour les fichiers du site et recharge Nginx
# ═══════════════════════════════════════════════════════════

set -e

echo "▶ Rechargement Nginx..."
docker compose exec nginx nginx -s reload
echo "✅ Site mis à jour et Nginx rechargé."
