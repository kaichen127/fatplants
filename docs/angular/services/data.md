# Data Service

Author: Matt Hudson

### Purpose

The Data Service provides common data accessors to UI components that share data.

### Properties

  public uniprot_id: string;
  public BlastNeedUpdate: boolean;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;
  private lmpdOb: Observable<Lmpd_Arapidopsis[]>

  public lmpd: Lmpd_Arapidopsis;
  public seqence: string;
  public loading = false;
  public g2sLoading = false;
  private blastRes: string;
  private blastResOb = new Observable<string>();

  private pathwayDb=[];

### Methods

  constructor(private http: HttpClient, private afs: AngularFirestore): main function is to load the reactome.csv file and populate the pathwayDB list.

  getDataFromAbs(uniprot_id): Observable<Lmpd_Arapidopsis[]>: queries a Lmpd_Arapidopsis entry from the uniprot id, returns an Observable you can subscribe to.

  public getLmpdData(): accesses and returns the lmpd property.

  public updateBlastRes(uniprot_id, proteinDatabase): Observable<string>: calls the one click function with the properties of the service, then updates the blastRes property with the response.
  public getBlastRes(): string: accesses and returns the blastRes property.

  public getPathwayDB(): string[]: accesses and returns the pathwayDb property.
