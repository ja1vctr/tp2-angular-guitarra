import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

function getLeafRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let leaf = route;
  while (leaf.firstChild) {
    leaf = leaf.firstChild;
  }
  return leaf;
}

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const snapshot = route as ActivatedRouteSnapshot;
  const leaf = getLeafRoute(snapshot);
  const isPublic = leaf.data?.['public'] === true;

  if (isPublic) {
    return true;
  }

  const token = authService.getToken();
  const tokenExpired = !token || authService.isTokenExpired(token);

  if (tokenExpired) {
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some((role) => authService.hasRole(role));
    if (!hasRole) {
      return router.createUrlTree(['/home']);
    }
  }

  return true;
};
