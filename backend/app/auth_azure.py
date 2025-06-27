import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
import requests

router = APIRouter()

AZURE_TENANT_ID = os.getenv("AZURE_AD_TENANT_ID", "<tenant-id>")
AZURE_CLIENT_ID = os.getenv("AZURE_AD_CLIENT_ID", "<client-id>")
AZURE_OPENID_CONFIG_URL = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration"

# Obtener las claves públicas de Azure AD
def get_azure_jwks():
    resp = requests.get(AZURE_OPENID_CONFIG_URL)
    jwks_uri = resp.json()["jwks_uri"]
    keys = requests.get(jwks_uri).json()
    return keys

# Validar el token de Azure AD
def verify_azure_token(token: str):
    keys = get_azure_jwks()
    try:
        unverified_header = jwt.get_unverified_header(token)
        for key in keys["keys"]:
            if key["kid"] == unverified_header["kid"]:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                payload = jwt.decode(
                    token,
                    public_key,
                    algorithms=[key["alg"]],
                    audience=AZURE_CLIENT_ID,
                    issuer=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0"
                )
                return payload
        raise HTTPException(status_code=401, detail="No matching key found")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")

@router.post("/auth/azure")
async def auth_azure(request: Request):
    data = await request.json()
    token = data.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token requerido")
    user_info = verify_azure_token(token)
    return JSONResponse(content={"user": user_info}) 