Name "TokensCI Desktop"
OutFile "C:\Users\ning\AppData\Local\Temp\TokensCIDesktop.exe"

RequestExecutionLevel user
SetCompressor /SOLID lzma

Section "Run" SEC01
  SetSilent silent
  SetOutPath "$TEMP\TokensCIDesktop"
  SetDetailsPrint none
  File /r "M:\*"
  Exec "$TEMP\TokensCIDesktop\TokensCIDesktop.exe"
SectionEnd
