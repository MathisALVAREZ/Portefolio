# 📖 Guide d'édition du portfolio — Mathis Alvarez

Ton site est maintenant un **site multi-pages**. Tu peux tout modifier toi-même sans
connaître le code : il suffit de remplacer du texte et de déposer des images.

---

## 🗂️ Structure du site

```
site/
├── index.html                         ← Page d'accueil
├── livres.html                        ← Page "Mes livres"
├── experiences/
│   ├── spirica-rssi.html              ← Alternance RSSI Spirica
│   ├── credit-agricole-secops.html    ← Stage SecOps
│   ├── evogen-rp.html                 ← Evogen RP (screens + vidéos)
│   ├── the-hostel.html                ← Escape game
│   └── _modele.html                   ← MODÈLE à dupliquer pour une nouvelle page
├── css/   (style.css + pages.css)     ← Le design, ne pas toucher sauf envie
├── js/    (main.js + pages.js)        ← Le code, ne pas toucher
└── assets/
    ├── favicon.svg
    └── img/
        ├── profile/   ← ta photo de profil  → profile.jpg
        ├── evogen/    ← screenshots Evogen RP
        ├── livres/    ← couvertures de livres → cover-1.jpg, cover-2.jpg
        ├── hostel/    ← photos The Hostel
        └── spirica/   ← schémas / visuels cyber (anonymisés !)
    └── video/         ← vidéos hébergées localement (.mp4)
```

---

## 🖼️ Ajouter une PHOTO / une CAPTURE

1. Dépose ton image dans le bon dossier (ex. `assets/img/evogen/screen-1.jpg`).
2. Dans la page, trouve la ligne `<img src="..."` correspondante.
3. Remplace le chemin par le tien.

> Astuce : les images placeholder s'affichent automatiquement tant que tu n'as pas
> mis les tiennes — donc rien n'est jamais "cassé".

**Formats conseillés :** `.jpg` ou `.webp`, captures en **16:9** (1280×720 ou plus),
couvertures de livres en **portrait** (~400×600).

---

## 🎬 Ajouter une VIDÉO (page Evogen RP)

### Option A — YouTube (le plus simple)
1. Ouvre ta vidéo sur YouTube, copie l'ID (la partie après `watch?v=`).
   Ex : `https://www.youtube.com/watch?v=`**`abc123XYZ`**
2. Dans `experiences/evogen-rp.html`, remplace dans l'`<iframe>` :
   `https://www.youtube.com/embed/dQw4w9WgXcQ`
   par `https://www.youtube.com/embed/abc123XYZ`

### Option B — Fichier vidéo local
1. Dépose ton `.mp4` dans `assets/video/`.
2. Dans `evogen-rp.html`, dé-commente le bloc `<video>` d'exemple (déjà présent)
   et change le nom du fichier.

---

## 📚 Ajouter / modifier un LIVRE (`livres.html`)

Chaque livre est un bloc `<article class="book-item">`. Pour chacun, modifie :
- la **couverture** : `assets/img/livres/cover-1.jpg`
- le **titre** : `<h3>...</h3>`
- le **genre** : `<div class="book-genre">...</div>`
- le **statut** : `Disponible` (vert) ou `Bientôt` (jaune)
- le **synopsis** : le `<p>...</p>`
- le **lien d'achat** : le `href="https://..."`

Pour **ajouter un livre**, copie-colle un bloc `<article class="book-item">...</article>` entier.
Pour en **retirer un**, supprime le bloc.

---

## ➕ Créer une NOUVELLE page (projet, passion, etc.)

1. Copie `experiences/_modele.html` et renomme-le (ex. `experiences/mon-projet.html`).
2. Remplace tout ce qui est en MAJUSCULES.
3. (Optionnel) Pour qu'elle apparaisse sur l'accueil, ajoute une carte dans
   `index.html`, section `<section id="experiences">` (copie une carte `<a class="exp-card ...">` existante).

---

## ✅ À FAIRE — petites infos à compléter (voir aussi le récap envoyé en chat)

- [ ] `index.html` → lien **LinkedIn** : remplace `linkedin.com/in/votre-lien`
- [ ] `index.html` → vérifie le lien **GitHub** (`github.com/mathisalvarez`)
- [ ] `evogen-rp.html` → lien **Discord** d'invitation
- [ ] `livres.html` → vrais titres, synopsis et liens d'achat
- [ ] Déposer : `profile.jpg`, screens Evogen, couvertures de livres, photos Hostel
- [ ] Le **formulaire de contact** est en mode simulation : voir la note ci-dessous

---

## ✉️ Activer le formulaire de contact (pour de vrai)

Le formulaire (dans `index.html`) fait actuellement une **simulation**. Pour recevoir
les messages par mail sans serveur, le plus simple est **Formspree** (gratuit) :

1. Crée un compte sur https://formspree.io et récupère ton ID de formulaire.
2. Ouvre `js/main.js`, fonction `initContactForm`, et remplace la partie SIMULATION
   par un vrai envoi :
   ```js
   const res = await fetch('https://formspree.io/f/TON_ID', {
     method: 'POST',
     headers: { 'Accept': 'application/json' },
     body: new FormData(form),
   });
   const success = res.ok;
   ```

---

## 🚀 Mettre en ligne

Le site est servi par Nginx via Docker (`docker compose up -d`).
Après modification des fichiers dans `site/`, recharge simplement la page (les fichiers
sont montés en volume, pas besoin de rebuild).
