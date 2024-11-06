// src/types/typesSendFilterProcessPage.ts

export const fileTypes = ['XLS', 'XLSX'];

export interface ExcelRow {
  unidad: string | null;
  tel_uni: string | null;
  tel_clien: string | null;
  tipo_plan: string | null;
  plan_num: string | null;
  cod_mot_gen: string | null;
  criterios: string | null;
  contrato: string | null;
  entrega: string | null;
  situ_actual: string | null;
  situ_uni: string | null;
  cant_venci: string | null;
  cant_cuot: string | null;
  cliente_01: string | null;
  ejecutivoCta: string | null;
}

export const columns = [
  { name: 'Unidad', selector: (row: ExcelRow) => row.unidad ?? '', sortable: true },
  { name: 'Telefono Unidad', selector: (row: ExcelRow) => row.tel_uni ?? '', sortable: true },
  { name: 'Telefono Cliente', selector: (row: ExcelRow) => row.tel_clien ?? '', sortable: true },
  { name: 'Tipo Plan', selector: (row: ExcelRow) => row.tipo_plan ?? '', sortable: true },
  { name: 'Plan Numero', selector: (row: ExcelRow) => row.plan_num ?? '', sortable: true },
  { name: 'Cod Mot Gen', selector: (row: ExcelRow) => row.cod_mot_gen ?? '', sortable: true },
  { name: 'Criterios', selector: (row: ExcelRow) => row.criterios ?? '', sortable: true },
  { name: 'Contrato', selector: (row: ExcelRow) => row.contrato ?? '', sortable: true },
  { name: 'Entrega', selector: (row: ExcelRow) => row.entrega ?? '', sortable: true },
  { name: 'Situacion Actual', selector: (row: ExcelRow) => row.situ_actual ?? '', sortable: true },
  { name: 'Situacion Unidad', selector: (row: ExcelRow) => row.situ_uni ?? '', sortable: true },
  { name: 'Cantidad Vencidas', selector: (row: ExcelRow) => row.cant_venci ?? '', sortable: true },
  { name: 'Cant Cuotas', selector: (row: ExcelRow) => row.cant_cuot ?? '', sortable: true },
  { name: 'Cliente', selector: (row: ExcelRow) => row.cliente_01 ?? '', sortable: true },
  { name: 'Ejecutivo Cta', selector: (row: ExcelRow) => row.ejecutivoCta ?? '', sortable: true },
];

// Agregar 10 filas vacías para mostrar los encabezados si no hay datos
export const emptyRow = {
  unidad: '',
  tel_uni: '',
  tel_clien: '',
  tipo_plan: '',
  plan_num: '',
  cod_mot_gen: '',
  criterios: '',
  contrato: '',
  entrega: '',
  situ_actual: '',
  situ_uni: '',
  cant_venci: '',
  cant_cuot: '',
  cliente_01: '',
  ejecutivoCta: ''
};

export const steps = [
  { title: 'Subir archivo', description: 'Carga el archivo Excel' },
  { title: 'Filtrar Archivo', description: 'Aplica los filtros necesarios' },
  { title: 'Procesar Archivo', description: 'Preparar datos para envío' },
  { title: 'Envio de PDF', description: 'Enviar el archivo por WhatsApp' },
];