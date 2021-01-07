import type { IFormValidation } from '../domains/Car/types';

export function checkAllFormsValid(formsList: IFormValidation): boolean {
  const formsCount = Object.keys(formsList).length;

  for (let i = 0; i < formsCount; i++) {
    if (!formsList[i]) return false;
  }

  return true;
}
