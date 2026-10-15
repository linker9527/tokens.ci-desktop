!include "MUI2.nsh"
!include "LogicLib.nsh"
Name "TokensCI Desktop"
OutFile "C:\Users\ning\Desktop\TokensCIDesktop.exe"
InstallDir "$DESKTOP\TokensCIDesktop"
RequestExecutionLevel user
SetCompressor /SOLID lzma
Section "Install" SEC01
  SectionIn RO
  SetOutPath "$INSTDIR"
  SetDetailsPrint none
  File /r "M:\*"
  SectionEnd
SectionEnd
