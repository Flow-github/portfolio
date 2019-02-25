import { InjectionToken } from "@angular/core";

export const environment = {
  production: true,
  data_xml: new InjectionToken<string>(''),
};
