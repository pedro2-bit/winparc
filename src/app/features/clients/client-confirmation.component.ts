
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { ClientService } from './clients.service';

@Component({
  selector: 'app-client-confirmation',
  standalone: true,
  templateUrl: './client-confirmation.component.html',
  styleUrls: ['./client-confirmation.component.scss']
})
export class ClientConfirmationComponent {
  @Input() raisonSociale!: string;
  @Input() numCompte!: string;
  @Input() action: 'activer' | 'desactiver' = 'activer';
  @Input() clientId!: number;
  @Input() etatId!: number;
  @Output() confirm = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<void>();

  isLoading = false;

  constructor(private clientService: ClientService) {}

  onConfirm(result: boolean) {
    if (!result) {
      this.confirm.emit(false);
      return;
    }
    if (!this.clientId || !this.etatId) {
      this.confirm.emit(false);
      return;
    }
    this.isLoading = true;
    const client: any = { id: this.clientId, etatClientDto: { id: this.etatId } };
    let obs$;
    if (this.action === 'activer') {
      obs$ = this.clientService.activerClient(client);
    } else {
      obs$ = this.clientService.desactiverClient(client);
    }
    obs$.subscribe({
      next: () => {
        this.isLoading = false;
        let msg = this.action === 'activer' ? 'Client activé avec succès' : 'Client désactivé avec succès';
        window.dispatchEvent(new CustomEvent('client-notification', { detail: { message: msg, type: 'success' } }));
        this.success.emit();
        this.confirm.emit(true);
      },
      error: () => {
        this.isLoading = false;
        let msg = this.action === 'activer' ? "Erreur lors de l'activation du client" : "Erreur lors de la désactivation du client";
        window.dispatchEvent(new CustomEvent('client-notification', { detail: { message: msg, type: 'error' } }));
        this.confirm.emit(false);
      }
    });
  }
}
