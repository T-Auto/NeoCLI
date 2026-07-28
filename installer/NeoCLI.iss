#ifndef MyAppVersion
  #define MyAppVersion "0.0.0"
#endif
#define MyAppName "NeoCLI"
#define MyAppPublisher "NeoCLI"
#define MyAppExeName "NeoCLI.exe"

[Setup]
AppId={{8C8A66F0-67FC-40E8-8B7C-0BE504B39F53}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\NeoCLI
DefaultGroupName=NeoCLI
DisableProgramGroupPage=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir=..\dist\installer
OutputBaseFilename=NeoCLI-Setup-{#MyAppVersion}-x64
Compression=lzma2/ultra64
SolidCompression=yes
PrivilegesRequired=lowest
UninstallDisplayName=NeoCLI

[Files]
Source: "..\dist\windows\NeoCLI.exe"; DestDir: "{app}"; Flags: ignoreversion
[Icons]
Name: "{autoprograms}\NeoCLI"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\NeoCLI"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"; Flags: unchecked
[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch NeoCLI"; Flags: nowait postinstall skipifsilent

[Code]
var
  ApiKeyPage: TInputQueryWizardPage;
function GetInstallerConfigPath(): String;
begin
  Result := ExpandConstant('{userprofile}\.NeoCLI\config.toml');
end;
function JsonEscape(Value: String): String;
begin
  Result := Value;
  StringChangeEx(Result, '\', '\\', True);
  StringChangeEx(Result, '"', '\"', True);
  StringChangeEx(Result, #13, '\r', True);
  StringChangeEx(Result, #10, '\n', True);
end;
procedure InitializeWizard;
begin
  ApiKeyPage := CreateInputQueryPage(wpSelectDir, 'API key', 'Configure NeoCLI', 'Enter the API key used by NeoCLI. It is stored only in your Windows user profile and can be replaced by setting ANTHROPIC_AUTH_TOKEN before launch.');
  ApiKeyPage.Add('API key:', True);
end;
function ShouldSkipPage(PageID: Integer): Boolean;
begin
  Result := (PageID = ApiKeyPage.ID) and FileExists(GetInstallerConfigPath());
end;
function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if (CurPageID = ApiKeyPage.ID) and (Trim(ApiKeyPage.Values[0]) = '') then begin
    MsgBox('An API key is required to continue.', mbError, MB_OK);
    Result := False;
  end;
end;
procedure CurStepChanged(CurStep: TSetupStep);
var
  ConfigPath, ConfigDir, Toml: String;
begin
  if CurStep = ssPostInstall then begin
    ConfigPath := GetInstallerConfigPath();
    ConfigDir := ExtractFileDir(ConfigPath);
    ForceDirectories(ConfigDir);
    if not FileExists(ConfigPath) then begin
      Toml := '# NeoCLI user configuration' + #13#10 +
        '# Edit this file to change the API endpoint or model names.' + #13#10 + #13#10 +
        'api_key = "' + JsonEscape(ApiKeyPage.Values[0]) + '"' + #13#10 +
        'base_url = "https://api.deepseek.com/anthropic"' + #13#10 +
        'model = "deepseek-v4-pro"' + #13#10 +
        'default_opus_model = "deepseek-v4-pro"' + #13#10 +
        'default_sonnet_model = "deepseek-v4-pro"' + #13#10 +
        'default_haiku_model = "deepseek-v4-flash"' + #13#10 +
        'subagent_model = "deepseek-v4-flash"' + #13#10;
      SaveStringToFile(ConfigPath, Toml, False);
    end;
    if not FileExists(ExpandConstant('{userappdata}\NeoCLI\settings.json')) then
      SaveStringToFile(ExpandConstant('{userappdata}\NeoCLI\settings.json'), '{' + #13#10 + '  "permissions": {' + #13#10 + '    "defaultMode": "bypassPermissions"' + #13#10 + '  }' + #13#10 + '}' + #13#10, False);
  end;
end;
