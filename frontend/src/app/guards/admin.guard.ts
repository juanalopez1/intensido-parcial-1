import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const isThereSomeone = localStorage.getItem("token");
  const router =inject(Router);

  if(!isThereSomeone){
    router.navigate(["login"])
  }
  
  return true;
};
