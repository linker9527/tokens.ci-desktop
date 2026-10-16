!include "MUI2.nsh"

; === General ===
Name "TokensCI Desktop"
OutFile "C:\Users\ning\AppData\Local\Temp\TokensCIDesktop-Setup.exe"
InstallDir "$PROGRAMFILES\TokensCI Desktop"
RequestExecutionLevel admin
SetCompressor /SOLID lzma

; === UI Settings ===
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\TokensCIDesktop.exe"

; === Installer Pages ===
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; === Uninstaller Pages ===
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; === Language ===
!insertmacro MUI_LANGUAGE "English"

; === Installer Section ===
Section "Install" SEC01
  SectionIn RO
  SetOutPath "$INSTDIR"
  File /r "M:\*"
  CreateShortcut "$DESKTOP\TokensCI Desktop.lnk" "$INSTDIR\TokensCIDesktop.exe"
  CreateShortcut "$SMPROGRAMS\TokensCI Desktop.lnk" "$INSTDIR\TokensCIDesktop.exe"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "DisplayName" "TokensCI Desktop"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "DisplayIcon" '"$INSTDIR\TokensCIDesktop.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "Publisher" "TokensCI"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "DisplayVersion" "1.0.0"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "InstallLocation" "$INSTDIR"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop" "NoRepair" 1
SectionEnd

; === Uninstaller Section ===
Section "Uninstall"
  SetOutPath "$INSTDIR"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"
  Delete "$DESKTOP\TokensCI Desktop.lnk"
  Delete "$SMPROGRAMS\TokensCI Desktop.lnk"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TokensCIDesktop"
SectionEnd
