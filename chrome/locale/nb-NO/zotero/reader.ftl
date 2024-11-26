pdfReader-underlineText = Understrek tekst
pdfReader-highlightText = Merk tekst
pdfReader-addText = Legg til tekst
pdfReader-selectArea = Velg område
pdfReader-draw = Tegn
pdfReader-highlightAnnotation = Uthevingskommentar
pdfReader-underlineAnnotation = Understrekingskommentar
pdfReader-noteAnnotation = Notatkommentar
pdfReader-textAnnotation = Tekstkommentar
pdfReader-imageAnnotation = Bildekommentar
pdfReader-find-in-document = Finn i dokument
pdfReader-move-annotation-start-key =
    { PLATFORM() ->
        [macos] { general-key-command }
       *[other] { general-key-alt }
    }
pdfReader-a11yMoveAnnotation = Bruk piltastene til å flytte kommentaren.
pdfReader-a11yEditTextAnnotation = For å flytte slutten av tekstkommentaren holder du inne { general-key-shift } og bruker venstre/høyre piltast. Hvis du vil flytte starten av kommentaren, holder du inne { general-key-shift }-{ pdfReader-move-annotation-start-key } og bruker piltastene.
pdfReader-a11yResizeAnnotation = Hvis du vil endre størrelsen på kommentaren, holder du inne { general-key-shift } og bruker piltastene.
pdfReader-a11yAnnotationPopupAppeared = Bruk Tab for å navigere i popup-vinduet for kommentarer.
pdfReader-a11yAnnotationCreated = { $type } opprettet.
pdfReader-a11yAnnotationSelected = { $type } valgt.
-pdfReader-a11yTextualAnnotationInstruction = Hvis du vil kommentere tekst via tastaturet, bruker du først "{ pdfReader-find-in-document }" for å finne frasen, og deretter trykker du { general-key-control }-{ option-or-alt }-{ $number } for å gjøre søkeresultatet om til en kommentar.
-pdfReader-a11yAnnotationInstruction = For å legge til denne kommentaren i dokumentet, fokuserer du på dokumentet og trykker { general-key-control }-{ option-or-alt }-{ $number }.
pdfReader-toolbar-highlight =
    .aria-description = { -pdfReader-a11yTextualAnnotationInstruction(number: 1) }
    .title = { pdfReader-highlightText }
pdfReader-toolbar-underline =
    .aria-description = { -pdfReader-a11yTextualAnnotationInstruction(number: 2) }
    .title = { pdfReader-underlineText }
pdfReader-toolbar-note =
    .aria-description = { -pdfReader-a11yAnnotationInstruction(number: 3) }
    .title = { pdfReader-noteAnnotation }
pdfReader-toolbar-text =
    .aria-description = { -pdfReader-a11yAnnotationInstruction(number: 4) }
    .title = { pdfReader-addText }
pdfReader-toolbar-area =
    .aria-description = { -pdfReader-a11yAnnotationInstruction(number: 5) }
    .title = { pdfReader-selectArea }
pdfReader-toolbar-draw =
    .aria-description = Denne type kommentar kan ikke opprettes ved hjelp av tastaturet.
    .title = { pdfReader-draw }
pdfReader-findInDocumentInput =
    .title = Finn
    .placeholder = { pdfReader-find-in-document }
    .aria-description = Hvis du vil gjøre et søkeresultat om til en uthevingskommentar, trykker du på { general-key-control }-{ option-or-alt }-1. Hvis du vil gjøre et søkeresultat om til en understrekingskommentar, trykker du på { general-key-control }-{ option-or-alt }-2.
pdfReader-import-from-epub =
    .label = Importer E-bok kommentarer…
pdfReader-import-from-epub-prompt-title = Importer E-bok kommentarer
pdfReader-import-from-epub-prompt-text =
    { -app-name } fant { $count ->
        [1] { $count } { $tool } kommentar
       *[other] { $count } { $tool } kommentarer
    }, sist redigert { $lastModifiedRelative }.
    
    Alle { -app-name }-kommentarer som tidligere er importert fra denne e-boken, vil bli oppdatert.
pdfReader-import-from-epub-no-annotations-current-file =
    Denne e-boken ser ikke ut til å inneholde noen importerbare kommentarer.
    
    { -app-name } kan importere e-bok kommentarer som er opprettet i Calibre og KOReader.
pdfReader-import-from-epub-no-annotations-other-file =
    “{ $filename }” ser ikke ut til å inneholde noen Calibre- eller KOReader-kommentarer.
    
    Hvis denne e-boken har kommentarer opprettet i KOReader, kan du prøve å velge en "metadata.epub.lua"-fil direkte.
pdfReader-import-from-epub-select-other = Velg annen fil…
