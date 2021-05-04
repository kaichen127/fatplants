# Uniprot Scraper (and database update utility)

Author: Matt Hudson

## Purpose

The [uniprot scraper](../util/uniprot-scraper) is a side project to Fatplants aimed to automate database management. It was originally used to scraper www.uniprot.org for data, but was later updated to allow for the transfer of collected JSON data to our database. While this data is now updated, you can modify this node script should there be any new mass updates to the database.

## Setup

1. If not already, download and install both `node` and `npm`.
2. Run `npm install` to install needed dependencies in the project directory
3. Run `node uniprot-scraper.js <function>` where function specifies what operation to perform
4. If the script finishes but does not exit, use `CTRL+C` to exit.

## Functions

There are many existing functions for the script. These are specialized, but can easily be modified to accomodate a specific task. They are:

```
            get-fatplant => queries the fatplant database to obtain a list of uniprot ids present. Exported to fatplant-uniprots.json.
            Use sparingly to avoid overreading the FatPlant firestore.

            get-uniprot-data => reads in a list of uniprot IDs from fatplant-uniprots.json, then queries https://uniprot.org for relevant data.
            Output is sent to uniprot-data.json. API requests are throttled to prevent overloading the host system and web server. This parameter
            can be changed in the script \`numOfAPICallsAtOneTime\` in the callUniprotAPI() function.

            write-uniprot-data => using the uniprot-data.json file generated with "get-uniprot-data", writes the updated data to the fatplant
            database. Use sparingly to avoid high writing usage on the FatPlant firestore.
    
            fix-protein-entries => fixes the schema and syntax of protein entries on the database

            write-soybean-data => reads in the soybean-related data from uniprot-data.json, writes the updates to the Fatplant database.
            Use sparingly to avoid high writing usage on the FatPlant firestore.

            get-tair-ids => Parses uniprottoTAIR.txt and converts the data into JSON (uniprotToTair.json)

            get-soybean-update => Parses soybean_data_921_update.csv and converts the data into a JSON file.

            write-tair-ids => Given the mappings of TAIR ids in uniprotToTair.json, writes this data to the FatPlant database.
            Use sparingly to avoid high writing usage on the FatPlant firestore.

            update-soybean-db => Given the soybean update in soybean_data_921_update.json, writes this data to the FatPlant database.
            Use sparingly to avoid high writing usage on the FatPlant firestore.

            help => displays the help message.
```

To add your own, you can likely copy/paste a similar existing function into a new one, then edit its functionality to match the specific use case.