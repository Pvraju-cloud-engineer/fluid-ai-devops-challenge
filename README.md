# Fluid AI DevOps Engineer - Kubernetes & CI/CD Challenge

## Stack

- Node.js backend
- PostgreSQL StatefulSet
- Kubernetes Service
- PersistentVolumeClaim
- Readiness and liveness probes
- Docker
- GitHub Actions
- GitHub Container Registry
- k3s on AWS EC2

## Flow

GitHub -> GitHub Actions -> GHCR -> SSH -> k3s -> Backend Deployment -> PostgreSQL StatefulSet/PVC

## Important

Create the Kubernetes database secret manually on the EC2 host. Do not commit the real password to Git.

```bash
kubectl create secret generic postgres-secret   -n fluid-demo   --from-literal=POSTGRES_USER=appuser   --from-literal=POSTGRES_PASSWORD='CHANGE_ME'   --from-literal=POSTGRES_DB=appdb
```
