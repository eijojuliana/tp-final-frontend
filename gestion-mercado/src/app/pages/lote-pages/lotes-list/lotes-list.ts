import { Router } from '@angular/router';
import { LoteService } from '../../../services/lote-service';
import { Component, inject } from '@angular/core';
import { Lote } from '../../../models/lote.model';

@Component({
  selector: 'app-lotes-list',
  imports: [],
  templateUrl: './lotes-list.html',
  styleUrl: './lotes-list.css',
})
export class LotesList {
  private loteService = inject(LoteService);
  lotes = this.loteService.lotes;
  private router = inject(Router);

  deleteLote(id:number) {
    if(confirm("Desea eliminar?")) {
      this.loteService.delete(id).subscribe(() => {
        console.log(`Lote de ID: ${id} eliminado.`);
      })
    }
  }

  updateLote(lote:Lote) {
    this.loteService.seleccionarLoteToEdit(lote);
    this.router.navigate(['/lotes-form']);
  }
}
