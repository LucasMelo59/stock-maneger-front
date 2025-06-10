import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak!: Keycloak;

  kcProps = {
    url: 'https://keycloak-production-448b.up.railway.app/',
    realm: 'demo-realm',
    clientId: 'app1'
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.keycloak = new Keycloak(this.kcProps);

      this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false
      }).then(authenticated => {
        resolve()
      }).catch(() => {
        reject();
      });
    });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  logout(): void {
    this.keycloak.logout();
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getRealmRoles(): string[] | undefined {
    return this.keycloak.tokenParsed?.["realm_access"]?.roles
  }

  getCurrentClientRoles(): string[] | undefined {
    return this.keycloak.tokenParsed?.['resource_access']?.[this.kcProps.clientId].roles
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role) || this.keycloak.hasResourceRole(role);
}

}