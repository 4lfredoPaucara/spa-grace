import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyArsPipe } from '../../../shared/pipes/currency.pipe';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyArsPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly reportsService = inject(ReportsService);

  readonly loading = signal(true);
  readonly dashboardData = signal<any>(null);
  readonly error = signal<string | null>(null);

  readonly turnosPorEstado = computed(() => {
    const data = this.dashboardData();
    if (!data?.turnosPorEstado) return [];
    return Object.entries(data.turnosPorEstado).map(([key, value]) => ({
      key,
      value: value as number,
    }));
  });

  readonly totalTurnos = computed(() =>
    this.turnosPorEstado().reduce((acc, item) => acc + item.value, 0)
  );

  readonly topServicios = computed(() => this.dashboardData()?.topServicios ?? []);
  readonly topEmpleados = computed(() => this.dashboardData()?.topEmpleados ?? []);

  barColors: Record<string, string> = {
    pendiente: 'bg-yellow-400',
    confirmado: 'bg-blue-400',
    atendido: 'bg-green-400',
    cancelado: 'bg-red-400',
    ausente: 'bg-gray-400',
    reprogramado: 'bg-purple-400',
  };

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportsService.getDashboard().subscribe({
      next: (res) => {
        this.dashboardData.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los datos del dashboard');
        this.loading.set(false);
      },
    });
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  getBarColor(key: string): string {
    return this.barColors[key] || 'bg-gray-300';
  }
}
