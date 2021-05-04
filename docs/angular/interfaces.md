## Fatplant Interfaces (ADTs)

Author: Matt Hudson

**FatPlantDataSource**: wrapper type for Material Table Data Sources; includes retrieval date along with the data. Retrieval date is used when refreshing stale data.

**FunctionEntry**: type for entries in the `protein_entry` functions, includes data modeled after that present in arapidopsis entries.

**G2SEntry**: type for information from G2S, used for the 3D protein modeling. Just numbers and strings.

**lmpd_Arapidopsis_Detail**: This may be deprecated; replaced by ProteinEntry, so use the latter.

**lmpd_Arapidopsis_Evidence**: This may also be deprecated; evidence is no longer used as far as we know.

**lmpd_Arapidopsis_More**: Also deprecated; used to show up in the 'more' mouseover on the database; now just included in the main Arapidopsis ADT.

**lmpd_Arapidopsis**: The main ADT, used to represent an Arapidopsis data entry. Mostly string values, the functions are a list of FunctionEntry objects.

**ProteinEntry**: Used for protein details showed on the ProteinEntry page/

**Soybean**: Represents a soybean data entry.

*note*: many attributes are similar between Arapidopsis and Soybean, just note the spelling is different (i.e. uniprot_id (arapidopsis) vs UniprotID (soybean)). I know this is confusing; those were a carryover from previous iterations of the project.