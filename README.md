# Proplast Backend

API NestJS pour gérer les utilisateurs et les clients avec authentification JWT.

## Installation

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

Le serveur démarre sur `http://localhost:3000`

---

## Authentification

Tous les endpoints (sauf register/login) nécessitent un JWT dans le header :
```
Authorization: Bearer <token>
```

Rôles disponibles : `ADMIN`, `ANALYST`

---

## Endpoints

### 📝 Auth

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123",
  "role": "ADMIN"
}
```

**Réponse :**
```json
{
  "id": "uuid",
  "email": "admin@test.com",
  "role": "ADMIN"
}
```

---

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@test.com",
    "role": "ADMIN"
  }
}
```

---

### 👥 Clients

#### Créer un client (ADMIN)
```bash
POST /clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "telephone": "+33612345678",
  "site": "Paris",
  "type": "Entreprise"
}
```

#### Lister les clients (ADMIN, ANALYST)
```bash
GET /clients
Authorization: Bearer <token>
```

**Réponse :**
```json
[
  {
    "id": "uuid",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "telephone": "+33612345678",
    "site": "Paris",
    "type": "Entreprise",
    "createdAt": "2026-02-19T10:30:00Z"
  }
]
```

#### Récupérer un client (ADMIN, ANALYST)
```bash
GET /clients/{id}
Authorization: Bearer <token>
```

#### Modifier un client (ADMIN)
```bash
PUT /clients/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "prenom": "Jacques",
  "telephone": "+33612345679"
}
```

#### Supprimer un client (ADMIN)
```bash
DELETE /clients/{id}
Authorization: Bearer <token>
```

---

## Script de test complet

```bash
# 1. Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "role": "ADMIN"
  }'

# 2. Login et récupérer le token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"

# 3. Créer un client
curl -X POST http://localhost:3000/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "telephone": "+33612345678",
    "site": "Paris",
    "type": "Entreprise"
  }'

# 4. Lister les clients
curl -X GET http://localhost:3000/clients \
  -H "Authorization: Bearer $TOKEN"
```

---

## Permissions

| Endpoint | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| `/clients` | ANALYST, ADMIN | ADMIN | ADMIN | ADMIN |

### 📥 Imports

#### Télécharger le template d'import
```bash
GET /imports/template
Authorization: Bearer <token>
```
**Accès:** ADMIN, ANALYST

**Le template contient les colonnes:**
- `Nom/Structure` (obligatoire)
- `Personne Contact` (optionnel)
- `Numéro` (optionnel)
- `Adresse` (optionnel)
- `Contacté via` (obligatoire: SOGEVADE ou RECUPLAST)
- `Email` (optionnel)
- `Téléphone` (optionnel)
- `Site` (optionnel)
- `Type` (optionnel)

#### Importer des clients
```bash
POST /imports/files
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form-Data:
  file: <fichier.xlsx>
```
**Accès:** ADMIN only

**Réponse:**
```json
{
  "totalFiles": 1,
  "reports": [
    {
      "filename": "clients.xlsx",
      "totalRows": 100,
      "validRows": 95,
      "invalidRows": 5
    }
  ]
}
```