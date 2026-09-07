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

  public sinEspacios(control: any) {
        const valor = control?.value;
        if (valor == null) return null;
        if (typeof valor === 'string' && valor.trim() === '') {
            return { soloEspacios: true };
        }
        return null;
  }

  public sinNumeros(control: any) {
        const valor = control?.value;
        if (valor == null || valor === '') return null;
        if (/\d/.test(String(valor))) {
            return { contieneNumeros: true };
        }
        return null;
  }

  public fechaNoAnteriorA(fechaMinima: () => string | null | undefined) {
        return (control: any) => {
            const seleccionada = control?.value;
            if (!seleccionada) return null;
            const minima = fechaMinima();
            if (!minima) return null;
            if (new Date(seleccionada) < new Date(minima)) {
                return { anteriorAInicio: true };
            }
            return null;
        };
  }
}
