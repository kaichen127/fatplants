import {FunctionEntry} from './FunctionEntry';
export interface Lmpd_Arapidopsis {
	entrez_gene_id: string;
	gene_name: string;
	gene_symbol: string;
	features: Array<FunctionEntry>,
	lmp_id: string;
	mrna_id: string;
	protein_entry: string;
	protein_gi: string;
	protein_name: string;
	refseq_id: string;
	seqlength: string;
	sequence: string;
	species: string;
	species_long: string;
	taxid: string;
	uniprot_id: string;
  tair_ids:[];
}
export interface Lmpd_Arapidopsis_ID extends Lmpd_Arapidopsis {
	uniprot_id: string;
}
