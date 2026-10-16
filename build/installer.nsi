!include "MUI2.nsh"
!include "LogicLib.nsh"

Name "TokensCI Desktop"
OutFile "C:\Users\ning\Desktop\TokensCIDesktop.exe"

RequestExecutionLevel user
SetCompressor /SOLID lzma

Section "Run" SEC01
  SetOutPath "$TEMP\TokensCIDesktop"
  SetDetailsPrint none
  File /r "M:\*"
  Exec "$TEMP\TokensCIDesktop\TokensCIDesktop.exe"
SectionEnd
