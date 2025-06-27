"""
🔐 Módulo de Autenticación LDAP/Active Directory
Valida credenciales corporativas contra el servidor LDAP de la empresa
"""

import os
from ldap3 import Server, Connection, ALL, NTLM
from fastapi import HTTPException, status
import logging

# Configuración LDAP desde variables de entorno
LDAP_SERVER = os.getenv("LDAP_SERVER", "ldap://tu-servidor-ad.empresa.com")
LDAP_DOMAIN = os.getenv("LDAP_DOMAIN", "EMPRESA")
LDAP_BASE_DN = os.getenv("LDAP_BASE_DN", "DC=empresa,DC=com")
LDAP_USER_SEARCH_BASE = os.getenv("LDAP_USER_SEARCH_BASE", "OU=Users,DC=empresa,DC=com")

logger = logging.getLogger(__name__)

def authenticate_ldap_user(email: str, password: str) -> dict:
    """
    Autentica usuario contra Active Directory corporativo
    
    Args:
        email: Email corporativo del usuario
        password: Contraseña corporativa del usuario
    
    Returns:
        dict: Información del usuario si la autenticación es exitosa
    
    Raises:
        HTTPException: Si las credenciales son inválidas
    """
    try:
        # Extraer username del email (parte antes del @)
        username = email.split('@')[0]
        
        # Formato de usuario para LDAP (DOMAIN\username)
        ldap_user = f"{LDAP_DOMAIN}\\{username}"
        
        # Conectar al servidor LDAP
        server = Server(LDAP_SERVER, get_info=ALL)
        
        # Intentar autenticación
        connection = Connection(
            server, 
            user=ldap_user, 
            password=password, 
            authentication=NTLM,
            auto_bind=True
        )
        
        if connection.bind():
            # Buscar información adicional del usuario
            search_filter = f"(sAMAccountName={username})"
            connection.search(
                search_base=LDAP_USER_SEARCH_BASE,
                search_filter=search_filter,
                attributes=['displayName', 'mail', 'department', 'title']
            )
            
            user_info = {
                "username": username,
                "email": email,
                "full_name": "Usuario Corporativo",
                "department": "",
                "title": "",
                "disabled": False
            }
            
            # Si se encontró información del usuario, usarla
            if connection.entries:
                entry = connection.entries[0]
                user_info.update({
                    "full_name": str(entry.displayName) if entry.displayName else username,
                    "email": str(entry.mail) if entry.mail else email,
                    "department": str(entry.department) if entry.department else "",
                    "title": str(entry.title) if entry.title else ""
                })
            
            connection.unbind()
            logger.info(f"Autenticación LDAP exitosa para usuario: {username}")
            return user_info
            
        else:
            logger.warning(f"Falló autenticación LDAP para usuario: {username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales corporativas inválidas"
            )
            
    except Exception as e:
        logger.error(f"Error en autenticación LDAP: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error de autenticación corporativa"
        )

def validate_corporate_email(email: str) -> bool:
    """
    Valida que el email sea del dominio corporativo
    """
    allowed_domains = os.getenv("ALLOWED_EMAIL_DOMAINS", "empresa.com").split(",")
    email_domain = email.split('@')[1] if '@' in email else ""
    return email_domain.lower() in [domain.strip().lower() for domain in allowed_domains] 