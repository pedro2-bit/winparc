import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { NotificationComponent } from '@shared/components/notification/notification.component';
import { TranslateModule } from '@ngx-translate/core';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotificationComponent, TranslateModule]
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('lotsChart') lotsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('essenceChart') essenceChart!: ElementRef<HTMLCanvasElement>;

  loading = false;

  // KPI
  totalLots = 12;
  totalPaquets = 38;
  totalProduits = 124;
  totalStock = 256.75;

  // Derniers mouvements
  derniersMouvements = [
    {
      date: new Date(),
      lot: 'LOT-2025-001',
      type: 'entrée',
      volume: 12.5,
      produit: 'Chêne - Plot',
    },
    {
      date: new Date(),
      lot: 'LOT-2025-002',
      type: 'sortie',
      volume: 8.2,
      produit: 'Hêtre - Avivé',
    },
    {
      date: new Date(),
      lot: 'LOT-2025-003',
      type: 'transfert',
      volume: 5.0,
      produit: 'Chêne - Plot',
    }
  ];

  // Bilan matière
  bilanMatiere = {
    entrees: 120.5,
    sorties: 98.3,
    solde: 22.2
  };

  // Comptes principaux
  comptes = [
    { nom: 'Stock principal', solde: 180.5 },
    { nom: 'Stock séchage', solde: 45.2 },
    { nom: 'Stock vente', solde: 31.05 }
  ];

  // Notification state
  notification = {
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  };

  constructor() {}

  ngOnInit() {
    // Ici, charger les données réelles via services si besoin
  }

  ngAfterViewInit() {
    this.initLotsChart();
    this.initEssenceChart();
  }

  // Graphique évolution des lots
  private initLotsChart() {
    if (!this.lotsChart) return;
    const ctx = this.lotsChart.nativeElement.getContext('2d');
    new Chart(ctx!, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [{
          label: 'Lots créés',
          data: [5, 8, 12, 9, 15, 10, 7],
          borderColor: '#228B22',
          backgroundColor: 'rgba(34,139,34,0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#228B22'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Graphique répartition du stock par essence
  private initEssenceChart() {
    if (!this.essenceChart) return;
    const ctx = this.essenceChart.nativeElement.getContext('2d');
    new Chart(ctx!, {
      type: 'doughnut',
      data: {
        labels: ['Chêne', 'Hêtre', 'Douglas', 'Sapin', 'Autres'],
        datasets: [{
          data: [110, 60, 40, 30, 16.75],
          backgroundColor: [
            '#8B5E3C', // Chêne
            '#FFD966', // Hêtre
            '#34D399', // Douglas
            '#60A5FA', // Sapin
            '#A78BFA'  // Autres
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }

  // Notification helpers
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notification = { show: true, message, type };
  }
  onNotificationClosed() {
    this.notification.show = false;
  }

  // Style pour le type de mouvement
  getMouvementTypeClass(type: string): string {
    switch (type) {
      case 'entrée': return 'bg-green-100 text-green-800 px-2 py-1 rounded';
      case 'sortie': return 'bg-red-100 text-red-800 px-2 py-1 rounded';
      case 'transfert': return 'bg-blue-100 text-blue-800 px-2 py-1 rounded';
      default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded';
    }
  }

  // Action sur détail mouvement
  voirDetailsMouvement(mouvement: any) {
    this.showNotification(
      `Détail du mouvement : ${mouvement.lot} (${mouvement.type}, ${mouvement.volume} m³, ${mouvement.produit})`,
      'info'
    );
  }
}