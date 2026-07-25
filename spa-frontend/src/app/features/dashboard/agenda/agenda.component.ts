import { Component, inject, signal, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TurnosService } from '../../../services/turnos.service';
import { CobrosService } from '../../../services/cobros.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { TurnoFormComponent } from './turno-form/turno-form.component';
import { PagoFormComponent } from './pago-form/pago-form.component';
import { CurrencyArsPipe } from '../../../shared/pipes/currency.pipe';
import { ReadableDatePipe } from '../../../shared/pipes/readable-date.pipe';
import { EstadoColorPipe, EstadoLabelPipe } from '../../../shared/pipes/estado-color.pipe';
import type { Turno } from '../../../core/models/turno.model';
import type { EstadoTurno } from '../../../core/enums/estado-turno.enum';
import { ESTADO_TURNO_COLORS, ESTADO_TURNO_LABELS } from '../../../core/enums/estado-turno.enum';

interface Tab {
  id: string;
  label: string;
  estados: EstadoTurno[];
}

const TABS: Tab[] = [
  { id: 'activos', label: 'Activos', estados: ['pendiente', 'confirmado'] },
  { id: 'atendidos', label: 'Atendidos', estados: ['atendido'] },
  { id: 'cancelados', label: 'Cancelados/Ausentes', estados: ['cancelado', 'ausente', 'reprogramado'] },
];

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    FormsModule, SearchInputComponent, StatusBadgeComponent, ConfirmModalComponent,
    LoadingSpinnerComponent, EmptyStateComponent, TurnoFormComponent, PagoFormComponent,
    CurrencyArsPipe, ReadableDatePipe, EstadoColorPipe, EstadoLabelPipe,
  ],
  templateUrl: './agenda.component.html',
})
export class AgendaComponent {
  private readonly turnosService = inject(TurnosService);
  private readonly cobrosService = inject(CobrosService);
  private readonly toast = inject(ToastService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly activeTab = signal('activos');
  readonly search = model('');
  readonly selectedDate = model('');
  readonly selectedEmpleadoId = model<number | null>(null);

  readonly page = signal(1);
  readonly limit = signal(7);
  readonly total = signal(0);
  readonly totalPages = computed(() => Math.ceil(this.total() / this.limit()));

  // Modals
  readonly showTurnoForm = signal(false);
  readonly editingTurno = signal<Turno | null>(null);
  readonly showPagoForm = signal(false);
  readonly turnoForPago = signal<Turno | null>(null);
  readonly pagoMode = signal<'adelanto' | 'final' | 'descuento' | 'reembolso'>('adelanto');

  // Confirm
  readonly showConfirm = signal(false);
  readonly confirmConfig = signal({ title: '', message: '', action: '', variant: 'primary' as 'primary' | 'danger' });
  private confirmCallback: (() => void) | null = null;

  constructor() {
    this.loadTurnos();
  }

  get filters() {
    const tab = TABS.find((t) => t.id === this.activeTab());
    return {
      page: this.page(),
      limit: this.limit(),
      search: this.search(),
      fecha: this.selectedDate(),
      empleadoId: this.selectedEmpleadoId(),
      estado: tab?.estados.join(','),
    };
  }

  loadTurnos(): void {
    this.loading.set(true);
    this.error.set(null);
    this.turnosService.findAll(this.filters).subscribe({
      next: (res) => {
        this.turnos.set(res.data);
        this.total.set(res.meta?.total ?? 0);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar la agenda');
        this.loading.set(false);
      },
    });
  }

  setTab(tabId: string): void {
    this.activeTab.set(tabId);
    this.page.set(1);
    this.loadTurnos();
  }

  onSearch(val: string): void {
    this.search.set(val);
    this.page.set(1);
    this.loadTurnos();
  }

  onDateChange(val: string): void {
    this.selectedDate.set(val);
    this.page.set(1);
    this.loadTurnos();
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadTurnos();
    }
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadTurnos();
    }
  }

  // Turno form
  openNewTurno(): void {
    this.editingTurno.set(null);
    this.showTurnoForm.set(true);
  }

  onTurnoFormClose(): void {
    this.showTurnoForm.set(false);
    this.editingTurno.set(null);
  }

  onTurnoFormSaved(): void {
    this.showTurnoForm.set(false);
    this.editingTurno.set(null);
    this.loadTurnos();
    this.toast.show('Turno creado exitosamente', 'success');
  }

  // Actions
  confirmarTurno(turno: Turno): void {
    this.turnosService.confirmar(turno.id).subscribe({
      next: () => { this.toast.show('Turno confirmado', 'success'); this.loadTurnos(); },
      error: () => this.toast.show('Error al confirmar el turno', 'error'),
    });
  }

  atenderTurno(turno: Turno): void {
    this.turnosService.atender(turno.id).subscribe({
      next: () => { this.toast.show('Turno atendido', 'success'); this.loadTurnos(); },
      error: () => this.toast.show('Error al marcar como atendido', 'error'),
    });
  }

  confirmarCancelar(turno: Turno): void {
    this.confirmConfig.set({
      title: 'Cancelar Turno',
      message: `Estás seguro de cancelar el turno de ${turno.cliente?.nombre}?`,
      action: 'cancelar',
      variant: 'danger',
    });
    this.confirmCallback = () => {
      this.turnosService.update(turno.id, { estado: 'cancelado' }).subscribe({
        next: () => { this.toast.show('Turno cancelado', 'success'); this.loadTurnos(); },
        error: () => this.toast.show('Error al cancelar', 'error'),
      });
    };
    this.showConfirm.set(true);
  }

  // Pago
  openPagoAdelanto(turno: Turno): void {
    this.turnoForPago.set(turno);
    this.pagoMode.set('adelanto');
    this.showPagoForm.set(true);
  }

  openPagoFinal(turno: Turno): void {
    this.turnoForPago.set(turno);
    this.pagoMode.set('final');
    this.showPagoForm.set(true);
  }

  openReembolso(turno: Turno): void {
    this.turnoForPago.set(turno);
    this.pagoMode.set('reembolso');
    this.showPagoForm.set(true);
  }

  onPagoFormClose(): void {
    this.showPagoForm.set(false);
    this.turnoForPago.set(null);
  }

  onPagoFormSaved(): void {
    this.showPagoForm.set(false);
    this.turnoForPago.set(null);
    this.loadTurnos();
    this.toast.show('Operación realizada exitosamente', 'success');
  }

  executeConfirm(): void {
    this.showConfirm.set(false);
    this.confirmCallback?.();
    this.confirmCallback = null;
  }

  // Helpers
  getEstadoColor(estado: string): string {
    return ESTADO_TURNO_COLORS[estado as EstadoTurno] ?? '';
  }

  getEstadoLabel(estado: string): string {
    return ESTADO_TURNO_LABELS[estado as EstadoTurno] ?? estado;
  }

  getServicioNombres(turno: Turno): string {
    return turno.servicios?.map((s) => s.nombre).join(', ') ?? '';
  }

  canShowAction(turno: Turno, action: string): boolean {
    const estado = turno.estado;
    if (action === 'confirmar') return estado === 'pendiente';
    if (action === 'atender') return estado === 'confirmado';
    if (action === 'cancelar') return estado === 'pendiente' || estado === 'confirmado';
    if (action === 'adelanto') return turno.cobro?.estadoPago === 'pendiente_adelanto';
    if (action === 'pago_final') return turno.cobro?.estadoPago === 'adelanto_pagado' && estado === 'atendido';
    if (action === 'reembolso') return (estado === 'cancelado' || estado === 'ausente') && turno.cobro?.montoAdelanto > 0 && turno.cobro?.estadoPago !== 'reembolsado';
    return false;
  }
}
