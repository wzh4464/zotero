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
    .label = Import Ebook Annotations…
pdfReader-import-from-epub-prompt-title = Import Ebook Annotations
pdfReader-import-from-epub-prompt-text =
    { -app-name } found { $count ->
        [1] { $count } { $tool } annotation
       *[other] { $count } { $tool } annotations
    }, last edited { $lastModifiedRelative }.
    
    Any { -app-name } annotations that were previously imported from this ebook will be updated.
pdfReader-import-from-epub-no-annotations-current-file =
    This ebook does not appear to contain any importable annotations.
    
    { -app-name } can import ebook annotations created in Calibre and KOReader.
pdfReader-import-from-epub-no-annotations-other-file =
    “{ $filename }” does not appear to contain any Calibre or KOReader annotations.
    
    If this ebook has been annotated with KOReader, try selecting a “metadata.epub.lua” file directly.
pdfReader-import-from-epub-select-other = Select Other File…
