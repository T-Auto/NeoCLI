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
SetupIconFile=..\dist\windows\NeoCLI.ico

[Languages]
Name: "chinesesimp"; MessagesFile: "languages\ChineseSimplified.isl"

[Files]
Source: "..\dist\windows\NeoCLI.exe"; DestDir: "{app}"; Flags: ignoreversion
[UninstallDelete]
Type: files; Name: "{app}\neocli.cmd"
Type: files; Name: "{app}\neo.cmd"
[Dirs]
Name: "{app}\workplace"
[Icons]
Name: "{autoprograms}\NeoCLI"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}\workplace"
Name: "{autodesktop}\NeoCLI"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}\workplace"; Tasks: desktopicon
[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; GroupDescription: "附加快捷方式："; Flags: unchecked
[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "启动 NeoCLI"; WorkingDir: "{app}\workplace"; Flags: nowait postinstall skipifsilent

[Code]
var
  ApiKeyPage: TInputQueryWizardPage;
function PathContainsEntry(Path, Entry: String): Boolean;
begin
  Result := Pos(';' + Entry + ';', ';' + Path + ';') > 0;
end;
function RemovePathEntry(Path, Entry: String): String;
begin
  Result := Path;
  StringChangeEx(Result, ';' + Entry, '', True);
  StringChangeEx(Result, Entry + ';', '', True);
  if Result = Entry then Result := '';
end;
procedure AddInstallDirToUserPath;
var
  Path, AppPath: String;
begin
  AppPath := ExpandConstant('{app}');
  if not RegQueryStringValue(HKCU, 'Environment', 'Path', Path) then Path := '';
  if not PathContainsEntry(Path, AppPath) then begin
    if (Path <> '') and (Path[Length(Path)] <> ';') then Path := Path + ';';
    RegWriteExpandStringValue(HKCU, 'Environment', 'Path', Path + AppPath);
  end;
end;
procedure RemoveInstallDirFromUserPath;
var
  Path, AppPath, UpdatedPath: String;
begin
  AppPath := ExpandConstant('{app}');
  if RegQueryStringValue(HKCU, 'Environment', 'Path', Path) then begin
    UpdatedPath := RemovePathEntry(Path, AppPath);
    RegWriteExpandStringValue(HKCU, 'Environment', 'Path', UpdatedPath);
  end;
end;
function GetNeoCliConfigDir(): String;
begin
  Result := AddBackslash(GetEnv('USERPROFILE')) + '.NeoCLI';
end;
function GetInstallerConfigPath(): String;
begin
  Result := AddBackslash(GetNeoCliConfigDir()) + 'config.toml';
end;
function GetInstallerAuthPath(): String;
begin
  Result := AddBackslash(GetNeoCliConfigDir()) + 'auth.toml';
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
  ApiKeyPage := CreateInputQueryPage(wpSelectDir, 'API 密钥', '配置 NeoCLI', '请输入 NeoCLI 使用的 API 密钥。密钥仅保存到当前 Windows 用户目录，并可通过 ANTHROPIC_AUTH_TOKEN 环境变量覆盖。');
  ApiKeyPage.Add('API 密钥：', True);
end;
function ShouldSkipPage(PageID: Integer): Boolean;
begin
  Result := (PageID = ApiKeyPage.ID) and FileExists(GetInstallerAuthPath());
end;
function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if (CurPageID = ApiKeyPage.ID) and (Trim(ApiKeyPage.Values[0]) = '') then begin
    MsgBox('必须输入 API 密钥才能继续。', mbError, MB_OK);
    Result := False;
  end;
end;
procedure CurStepChanged(CurStep: TSetupStep);
var
  ConfigPath, ConfigDir, AuthPath, Toml: String;
begin
  if CurStep = ssPostInstall then begin
    ConfigPath := GetInstallerConfigPath();
    AuthPath := GetInstallerAuthPath();
    ConfigDir := GetNeoCliConfigDir();
    ForceDirectories(ConfigDir);
    if not FileExists(AuthPath) then
      SaveStringToFile(AuthPath, 'api_key = "' + JsonEscape(ApiKeyPage.Values[0]) + '"' + #13#10, False);
    if not FileExists(ConfigPath) then begin
      Toml := '# NeoCLI user configuration' + #13#10 +
        '# Edit this file to change the API endpoint or model names.' + #13#10 + #13#10 +
        'base_url = "https://api.deepseek.com/anthropic"' + #13#10 +
        'model = "deepseek-v4-pro"' + #13#10 +
        'default_opus_model = "deepseek-v4-pro"' + #13#10 +
        'default_sonnet_model = "deepseek-v4-pro"' + #13#10 +
        'default_haiku_model = "deepseek-v4-flash"' + #13#10 +
        'subagent_model = "deepseek-v4-flash"' + #13#10;
      SaveStringToFile(ConfigPath, Toml, False);
    end;
    SaveStringToFile(ExpandConstant('{app}\neocli.cmd'), '@echo off' + #13#10 + '"%~dp0NeoCLI.exe" %*' + #13#10, False);
    SaveStringToFile(ExpandConstant('{app}\neo.cmd'), '@echo off' + #13#10 + '"%~dp0NeoCLI.exe" %*' + #13#10, False);
    AddInstallDirToUserPath();
    if not FileExists(AddBackslash(GetNeoCliConfigDir()) + 'settings.json') then
      SaveStringToFile(AddBackslash(GetNeoCliConfigDir()) + 'settings.json', '{' + #13#10 + '  "permissions": {' + #13#10 + '    "defaultMode": "bypassPermissions"' + #13#10 + '  }' + #13#10 + '}' + #13#10, False);
  end;
end;
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usPostUninstall then RemoveInstallDirFromUserPath();
end;
