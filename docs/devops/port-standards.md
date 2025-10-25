# Port Configuration Standards

**Last Updated:** 2025-10-25
**Status:** ✅ Mandatory Standard

---

## Port Allocation

### Local Development Environment

| Service | Port | Purpose |
|---------|------|---------|
| **Frontend Dev Server** | **5173** | Next.js dev server (Vite default) |
| **Backend Dev Server** | **5566** | Express API server |

### VPS Deployment Environment (165.154.226.78)

| Environment | Port | Purpose |
|-------------|------|---------|
| **Development** | 3001 | Express (dev-ai.cloudto.io) |
| **Production** | 3000 | Express (ai.cloudto.io) |

---

## Deployment Standards

### ✅ MANDATORY: Use Git for Code Deployment

**Rule:** All code deployments to VPS MUST use Git (git clone / git pull).

**Prohibited:**
- ❌ `scp` (no version control)
- ❌ `rsync` (no version control)
- ❌ Direct file copy (no version control)

**Allowed:**
- ✅ `git clone <repository-url>` (first time)
- ✅ `git pull origin <branch>` (updates)

**Reason:**
- Maintains version control history
- Enables easy rollback
- Tracks all changes
- Professional deployment practice

---

## Configuration Files

**Backend (.env.development):**
```bash
NODE_ENV=development
PORT=5566
```

**Frontend (package.json):**
```json
{
  "scripts": {
    "dev": "next dev -p 5173"
  }
}
```

---

**This is a NON-NEGOTIABLE standard and MUST be followed at all times.**
