import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Validaciones {
  public fechaValida(control: any) {
        const seleccionada = new Date(control.value);
        const hoy = new Date();
        const hace120Anios = new Date();
        hace120Anios.setFullYear(hoy.getFullYear() - 120);

        if (!control.value) return null;
        if (seleccionada > hoy) return { futura: true };
        if (seleccionada < hace120Anios) return { muyAntigua: true };

        return null;
  }
}
