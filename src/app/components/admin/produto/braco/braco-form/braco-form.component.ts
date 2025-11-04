import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, model, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { BracoService } from '../../../../../service/produto/braco.service';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule, MatCalendar } from '@angular/material/datepicker';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { notFutureDateValidator } from '../../../../../shared/validators/past-date.validator';

registerLocaleData(localePt);

@Component({
  selector: 'app-braco-form',
  providers: [
    provideNativeDateAdapter(),
  { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  imports: [
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    CommonModule,
    MatCardModule, 
    MatDatepickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './braco-form.component.html',
  styleUrl: './braco-form.component.scss'
})
export class BracoFormComponent implements OnInit {
  loading = false;
  bracoForm: FormGroup;
  error: string | null = null;
  bracoId: number | null = null;
  backendErrorsList: any[] = [];
  dataSelecionada: Date | null = null;
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  constructor(
    private router:              Router,
    private bracoService:        BracoService,
    private fb:                  FormBuilder,
    private route:               ActivatedRoute,
    private notificationService: NotificationService,
    private cdr:                 ChangeDetectorRef,
    private dateAdapter:         DateAdapter<Date>
  ) 
  {
    this.dateAdapter.setLocale('pt-BR'); 

    
    this.bracoForm = this.fb.group({
    id: [null],
    formato: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    madeira: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    numeroDeTrastes: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(2),
        Validators.pattern('^[0-9]+$'),
      ]],
    dataDeFabricacao: ['', [Validators.required, notFutureDateValidator()]],
    descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.bracoId = +idParam;
        this.loadBraco(this.bracoId);
      }
    })
  }

  loadBraco(id: number): void {
    this.loading = true;
    this.bracoService.getById(id).subscribe({
      next: (data) => {
        this.bracoForm.patchValue(data);  
        
        if(data.dataDeFabricacao) {
          const dateStr = data.dataDeFabricacao.toString().split('T')[0];
          const [year, month, day] =  dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          
          this.dataSelecionada = date;

          const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
          this.bracoForm.get('dataDeFabricacao')?.setValue(formattedDate);

          setTimeout(() => {
            if(this.calendar){
              this.calendar.activeDate = date;
            }
          } )
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error.message || 'Erro ao carregar o braco.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.bracoForm.invalid) {
      this.bracoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const bracoData = this.bracoForm.value;

    const saveOperation = this.bracoId
      ? this.bracoService.alter(bracoData)
      : this.bracoService.create(bracoData);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(this.bracoId ? 'Braco atualizado com sucesso!' : 'Braco criado com sucesso!');
        this.router.navigate(['/admin/bracos']);
      },
      error: (error) => {
        this.loading = false;

        console.error('Erro ao salvar o braco:', error.error);
      }
    });
  }

  onDateSelected(date: Date | null): void {
    this.dataSelecionada = date;
    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
      this.bracoForm.get('dataDeFabricacao')?.setValue(formattedDate);
    } else {
      this.bracoForm.get('dataDeFabricacao')?.reset();
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/bracos']);
  }
}
