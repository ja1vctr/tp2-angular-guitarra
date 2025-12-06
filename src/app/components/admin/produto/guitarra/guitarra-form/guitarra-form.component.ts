import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BehaviorSubject } from 'rxjs';
import { Braco } from '../../../../../model/produto/braco';
import { Captador } from '../../../../../model/produto/captador';
import { Cor } from '../../../../../model/produto/cor';
import { Marca, Modelo } from '../../../../../model/produto/marca';
import { Ponte } from '../../../../../model/produto/ponte';
import { Tarraxa } from '../../../../../model/produto/tarraxa';
import { GuitarraPayload } from '../../../../../model/produto/guitarra-payload';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { BracoService } from '../../../../../service/produto/braco.service';
import { CaptadorService } from '../../../../../service/produto/captador.service';
import { CorService } from '../../../../../service/produto/cor.service';
import { GuitarraService } from '../../../../../service/produto/guitarra.service';
import { MarcaService } from '../../../../../service/produto/marca.service';
import { ModeloService } from '../../../../../service/produto/modelo.service';
import { PonteService } from '../../../../../service/produto/ponte.service';
import { TarraxaService } from '../../../../../service/produto/tarraxa.service';

@Component({
  selector: 'app-guitarra-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    NgxMaskDirective,
    MatSlideToggleModule,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [provideNgxMask(), provideNativeDateAdapter()],
  templateUrl: './guitarra-form.component.html',
  styleUrl: './guitarra-form.component.scss',
})
export class GuitarraFormComponent implements OnInit, OnDestroy {
  // Adicionado OnDestroy
  loading = false;
  error: string | null = null;

  guitarraForm!: FormGroup;
  guitarraId!: number | null;
  imagemPreview: string | null = null;
  imagemArquivo!: File | null;
  dataSelecionada: Date | null = null;
  bracos: Braco[] = [];
  cores: Cor[] = [];
  captadoresBraco: Captador[] = [];
  captadoresMeio: Captador[] = [];
  captadoresPonte: Captador[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  pontes: Ponte[] = [];
  tarraxas: Tarraxa[] = [];
  corHex$ = new BehaviorSubject<string>('#000000');

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private notificationService: NotificationService,
    private guitarraService: GuitarraService,
    private bracoService: BracoService,
    private corService: CorService,
    private captadorService: CaptadorService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private ponteService: PonteService,
    private tarraxaService: TarraxaService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.guitarraId = +idParam;
        this.loadGuitarra(this.guitarraId);
        this.loadRelacionamentos();
      } else {
        this.loadRelacionamentos();
      }
    });

    // Chamada para começar a monitorar as mudanças do formulário
    this.watchFormChanges();
  }

  // ---------------------------------------------------------
  // DESTRUIÇÃO DO COMPONENTE
  // ---------------------------------------------------------
  ngOnDestroy(): void {
    // Libera o URL do Blob para evitar vazamentos de memória
    if (this.imagemPreview) {
      URL.revokeObjectURL(this.imagemPreview);
    }
  }

  // ---------------------------------------------------------
  // MONITORAMENTO DE MUDANÇAS
  // ---------------------------------------------------------
  private watchFormChanges(): void {
    this.guitarraForm.valueChanges.subscribe((value) => {
      // Dados do Formulário no Console
      console.log('--- Mudança no Formulário ---');
      console.log(value);
      console.log('------------------------------');
      this.atualizarCorHex();
    });
    this.guitarraForm.get('idCor')?.valueChanges.subscribe(() => {
      this.atualizarCorHex();
    });
  }

  private buildForm(): void {
    const currentYear = new Date().getFullYear();
    this.guitarraForm = this.fb.group({
      id: [null],
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      descricao: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(250),
        ],
      ],
      preco: ['', [Validators.required, Validators.min(0)]],
      quantidade: ['', [Validators.required, Validators.min(0)]],
      status: [false, Validators.required],
      anoFabricacao: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}$/),
          Validators.min(1900),
          Validators.max(currentYear),
        ],
      ],
      // Campos no formato API
      numeroDeCordas: [
        '',
        [Validators.required, Validators.min(4), Validators.max(12)],
      ],
      madeira: ['', Validators.required],

      // Relacionamentos - IDs planos para a API
      idBraco: [null, Validators.required],
      idCor: [null, Validators.required],
      idCaptadorBraco: [null],
      idCaptadorMeio: [null],
      idCaptadorPonte: [null],
      idMarca: [null, Validators.required],
      idModelo: [null, Validators.required],
      idPonte: [null, Validators.required],
      idTarracha: [null, Validators.required],
    });
  }

  // ---------------------------------------------------------
  // LOAD GUITARRA PARA EDIÇÃO (COM MAPEAMENTO)
  // ---------------------------------------------------------
  private loadGuitarra(id: number): void {
    this.guitarraService.getById(id).subscribe({
      next: (guitarra) => {
        // ⭐️ Mapeamento: Extrai os IDs dos objetos aninhados para preencher o FormGroup ⭐️
        const formValues = {
          // Campos primitivos são copiados
          ...guitarra,

          // Mapeamento explícito de objetos (retornados pela API) para IDs (esperados pelo FormGroup):
          idBraco: guitarra.braco?.id ?? null,
          idCor: guitarra.cor?.id ?? null,
          idCaptadorBraco: guitarra.captadorBraco?.id ?? null,
          idCaptadorMeio: guitarra.captadorMeio?.id ?? null,
          idCaptadorPonte: guitarra.captadorPonte?.id ?? null,
          idMarca: guitarra.marca?.id ?? null,
          idModelo: guitarra.modelo?.id ?? null,
          idPonte: guitarra.ponte?.id ?? null,
          // Assumindo que a propriedade da API para Tarraxa é 'tarracha'
          idTarracha: guitarra.tarracha?.id ?? null,

          // Garante que o status é um booleano
          status: guitarra.status !== undefined ? guitarra.status : false,
        };

        // patchValue usa os IDs planos, que agora coincidem com os valores das opções no select (o valor de [value]="object.id")
        this.guitarraForm.patchValue(formValues);
        console.log(
          'Guitarra carregada e formulário preenchido com:',
          formValues
        );

        // ⭐️ Carrega a imagem da guitarra após o carregamento dos dados principais ⭐️
        this.loadGuitarraImagem(id);

        this.atualizarCorHex();
        this.cdr.detectChanges();
      },
      error: () => {
        this.notification.showError('Erro ao carregar guitarra.');
      },
    });
  }

  // ---------------------------------------------------------
  // LOAD IMAGEM DA GUITARRA
  // ---------------------------------------------------------
  private loadGuitarraImagem(id: number): void {
    // Revoga a URL anterior se existir, para liberar memória
    if (this.imagemPreview) {
      URL.revokeObjectURL(this.imagemPreview);
    }

    if (id) {
      this.guitarraService.getImagem(id).subscribe({
        next: (blob) => {
          // Cria uma URL temporária para o Blob (URL para exibição no <img>)
          this.imagemPreview = URL.createObjectURL(blob);
          this.cdr.detectChanges(); // Garante que a UI atualiza
        },
        error: (err) => {
          // Tratamento para quando não há imagem (Status 404, etc.)
          console.warn(
            'Guitarra não tem imagem associada ou erro ao carregar:',
            err
          );
          this.imagemPreview = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  // ---------------------------------------------------------
  // SELECIONA NOVO ARQUIVO DE IMAGEM
  // ---------------------------------------------------------
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      // Validação básica do tipo de arquivo (opcional, mas boa prática)
      if (!file.type.match('image.*')) {
        this.notification.showError(
          'Por favor, selecione um arquivo de imagem válido.'
        );
        this.imagemArquivo = null;
        input.value = ''; // Limpa o input file
        return;
      }

      this.imagemArquivo = file;

      // Cria um preview local temporário da nova imagem
      if (this.imagemPreview) {
        URL.revokeObjectURL(this.imagemPreview); // Revoga a imagem anterior (se houver)
      }
      this.imagemPreview = URL.createObjectURL(file);
      this.cdr.detectChanges();
    }
  }

  // ---------------------------------------------------------
  // UPLOAD DO NOVO ARQUIVO DE IMAGEM
  // ---------------------------------------------------------
  onUploadImagem(): void {
    if (!this.guitarraId) {
      this.notification.showError(
        'É necessário salvar a guitarra antes de adicionar uma imagem.'
      );
      return;
    }

    if (!this.imagemArquivo) {
      this.notification.showError(
        'Nenhum arquivo de imagem selecionado para upload.'
      );
      return;
    }

    this.loading = true;
    this.guitarraService
      .uploadImagem(this.guitarraId, this.imagemArquivo)
      .subscribe({
        next: () => {
          this.loading = false;
          this.notification.showSuccess(
            'Imagem da guitarra atualizada com sucesso!'
          );

          // Recarrega a imagem do servidor para garantir que a versão finalizada seja exibida
          this.loadGuitarraImagem(this.guitarraId!);
          this.imagemArquivo = null; // Limpa o arquivo selecionado

          // Opcional: Limpar o input file (se você adicionar um no HTML)
          // const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
          // if (fileInput) fileInput.value = '';
        },
        error: (err) => {
          this.loading = false;
          this.notification.showError(
            'Erro ao fazer upload da imagem: ' +
              (err.error?.message || 'Erro desconhecido.')
          );
          console.error('Erro de upload:', err);
        },
      });
  }

  // ---------------------------------------------------------
  // DOWNLOAD DA IMAGEM
  // ---------------------------------------------------------
  onDownloadImagem(): void {
    if (this.imagemPreview) {
      // 1. Cria um link temporário (elemento <a>)
      const link = document.createElement('a');

      // 2. Define o atributo href com a URL do Blob (imagemPreview)
      link.href = this.imagemPreview;

      // 3. Define o nome do arquivo para o download
      // Usa o ID da guitarra e a extensão .jpeg (assumindo um formato comum)
      const fileName = `guitarra_${this.guitarraId || 'nova'}_imagem.jpeg`;
      link.download = fileName;

      // 4. Adiciona o link ao corpo do documento (necessário para Firefox)
      document.body.appendChild(link);

      // 5. Simula o clique para iniciar o download
      link.click();

      // 6. Remove o link do corpo do documento
      document.body.removeChild(link);

      this.notification.showSuccess('Download iniciado com sucesso!');
    } else {
      this.notification.showError('Nenhuma imagem carregada para download.');
    }
  }

  private loadRelacionamentos(): void {
    // Continua a carregar todos os dados de relacionamento
    this.bracoService.getAll().subscribe((data) => {
      this.bracos = data;
      this.cdr.detectChanges();
    });
    this.corService.getAll().subscribe((data) => {
      this.cores = data;
      this.atualizarCorHex();
      this.cdr.detectChanges();
    });
    this.captadorService.getAll().subscribe((data) => {
      this.separarCaptadoresPorPosicao(data);
      this.cdr.detectChanges();
    });
    this.marcaService.getAll().subscribe((data) => {
      this.marcas = data;
      this.cdr.detectChanges();
    });
    this.modeloService.getAll().subscribe((data) => {
      this.modelos = data;
      this.cdr.detectChanges();
    });
    this.ponteService.getAll().subscribe((data) => {
      this.pontes = data;
      this.cdr.detectChanges();
    });
    this.tarraxaService.getAll().subscribe((data) => {
      this.tarraxas = data;
      this.cdr.detectChanges();
    });
  }

  // ---------------------------------------------------------
  // SALVAR
  // ---------------------------------------------------------
  onSubmit(): void {
    if (this.guitarraForm.invalid) {
      this.guitarraForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    // Pega o valor do formulário que JÁ está no formato da API (IDs planos)
    const apiPayload = this.guitarraForm.value as GuitarraPayload;

    // Converte e garante que números estão no formato correto, especialmente do input text (anoFabricacao)
    if (
      apiPayload.anoFabricacao !== undefined &&
      apiPayload.anoFabricacao !== null
    ) {
      apiPayload.anoFabricacao = Number(apiPayload.anoFabricacao);
    }
    if (
      apiPayload.numeroDeCordas !== undefined &&
      apiPayload.numeroDeCordas !== null
    ) {
      apiPayload.numeroDeCordas = Number(apiPayload.numeroDeCordas);
    }
    if (apiPayload.preco !== undefined && apiPayload.preco !== null) {
      apiPayload.preco = Number(apiPayload.preco);
    }
    if (apiPayload.quantidade !== undefined && apiPayload.quantidade !== null) {
      apiPayload.quantidade = Number(apiPayload.quantidade);
    }

    // Limpeza final: Remove o 'id' do payload se for uma operação de criação (POST)
    if (!this.guitarraId) {
      delete apiPayload.id;
    }

    const saveOperation = this.guitarraId
      ? this.guitarraService.alter(apiPayload)
      : this.guitarraService.create(apiPayload);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(
          this.guitarraId
            ? 'Guitarra atualizada com sucesso!'
            : 'Guitarra criada com sucesso!'
        );
        this.router.navigate(['/admin/guitarras']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Erro ao salvar a guitarra.';

        console.error('Erro ao salvar a guitarra:', error.error);
        this.cdr.detectChanges();
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/guitarras']);
  }

  private separarCaptadoresPorPosicao(lista: Captador[]): void {
    const normalizar = (label?: string) => (label || '').toUpperCase();
    this.captadoresBraco = lista.filter(
      (c) => normalizar(c.posicao?.label) === 'BRACO'
    );
    this.captadoresMeio = lista.filter(
      (c) => normalizar(c.posicao?.label) === 'MEIO'
    );
    this.captadoresPonte = lista.filter(
      (c) => normalizar(c.posicao?.label) === 'PONTE'
    );
  }

  private atualizarCorHex(): void {
    const idCor = this.guitarraForm?.get('idCor')?.value;
    const cor = this.cores.find((c) => c.id === idCor);
    this.corHex$.next(cor ? cor.codigoHexadecimal : '#000000');
  }
}
