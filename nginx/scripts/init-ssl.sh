#!/bin/bash
# ═══════════════════════════════════════════════════════════
# scripts/init-ssl.sh
# Obtention du premier certificat Let's Encrypt
# À exécuter UNE SEULE FOIS après le premier démarrage
# ═══════════════════════════════════════════════════════════

set -e

# ── Configuration ─────────────────────────────────────────
DOMAIN="${1:-votredomaine.fr}"
EMAIL="${2:-votre@email.fr}"
STAGING="${3:-0}"  # Mettre 1 pour tester sans rate limit

echo ""
echo "════════════════════════════════════════════"
echo "  Initialisation SSL — Let's Encrypt"
echo "  Domaine : $DOMAIN"
echo "  Email   : $EMAIL"
echo "════════════════════════════════════════════"
echo ""

# ── Vérifications préalables ──────────────────────────────
if [ "$DOMAIN" = "votredomaine.fr" ]; then
  echo "❌ Erreur : Modifiez la variable DOMAIN avec votre vrai domaine."
  echo "   Usage : ./scripts/init-ssl.sh mondomaine.fr mon@email.fr"
  exit 1
fi

if [ "$EMAIL" = "votre@email.fr" ]; then
  echo "❌ Erreur : Modifiez la variable EMAIL avec votre vrai email."
  exit 1
fi

# ── Étape 1 : Démarrer Nginx en mode HTTP-only ────────────
echo "▶ Étape 1 : Démarrage Nginx (mode HTTP init)..."

# S'assurer que seul le fichier init est actif
if [ -f nginx/conf.d/portfolio.conf ]; then
  mv nginx/conf.d/portfolio.conf nginx/conf.d/portfolio.conf.disabled
  echo "   Config HTTPS temporairement désactivée"
fi

# Démarrer (ou redémarrer) le stack
docker compose up -d nginx certbot
sleep 3

echo "   Nginx démarré ✓"

# ── Étape 2 : Obtenir le certificat ───────────────────────
echo ""
echo "▶ Étape 2 : Obtention du certificat SSL..."

STAGING_ARG=""
if [ "$STAGING" = "1" ]; then
  STAGING_ARG="--staging"
  echo "   ⚠️  Mode staging activé (certificat de test)"
fi

docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  $STAGING_ARG \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

echo "   Certificat obtenu ✓"

# ── Étape 3 : Activer la config HTTPS ────────────────────
echo ""
echo "▶ Étape 3 : Activation de la configuration HTTPS..."

# Remplacer le domaine dans la config HTTPS
sed -i "s/votredomaine.fr/$DOMAIN/g" nginx/conf.d/portfolio.conf.disabled
mv nginx/conf.d/portfolio.conf.disabled nginx/conf.d/portfolio.conf

# Remplacer aussi dans init (pour le fallback ACME)
sed -i "s/votredomaine.fr/$DOMAIN/g" nginx/conf.d/portfolio-init.conf

echo "   Config HTTPS activée ✓"

# ── Étape 4 : Redémarrer Nginx avec HTTPS ─────────────────
echo ""
echo "▶ Étape 4 : Rechargement Nginx avec SSL..."

docker compose restart nginx
sleep 2

echo "   Nginx rechargé ✓"

# ── Résultat ──────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════"
echo "  ✅ SSL configuré avec succès !"
echo ""
echo "  🌐 Votre site est disponible sur :"
echo "     https://$DOMAIN"
echo "     https://www.$DOMAIN"
echo ""
echo "  🔄 Renouvellement automatique : toutes les 12h"
echo "     (géré par le container certbot)"
echo "════════════════════════════════════════════"
echo ""
