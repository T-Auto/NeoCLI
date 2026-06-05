import React from 'react';
import { Box, Text, useTheme } from 'src/ink.js';
import { env } from '../../utils/env.js';

const WELCOME_V2_WIDTH = 58;

type Seg = { t: string; c?: string; bg?: string; dim?: boolean; bold?: boolean };

function TitleLine() {
  return (
    <Text>
      <Text>  Welcome to NeoCLI  v</Text>
      <Text dimColor>{MACRO.VERSION} </Text>
    </Text>
  );
}

function DotLine() {
  return <Text dimColor>{'…'.repeat(58)}</Text>;
}

function BottomLine() {
  return <Text dimColor>{'•'.repeat(58)}</Text>;
}

function safeRepeat(n: number): number {
  return Math.max(0, n);
}

function padRight(s: string, w: number) {
  if (s.length >= w) return s;
  return s + ' '.repeat(safeRepeat(w - s.length));
}

// ── Shared decorative lines ─────────────────────────────────────

const CLOUD_LINES: string[] = [
  padRight('            ░░░░░░', 58),
  padRight('    ░░░   ░░░░░░░░░░', 58),
  padRight('   ░░░░░░░░░░░░░░░░░░░', 58),
  '',
  '',
  padRight('                           ░░░░', 58),
  padRight('                         ░░░░░░░░░░', 58),
];

// ── Cat ears + body (shared across themes) ─────────────────────

function CatEarsTipLine() {
  return (
    <Text>
      <Text>{'                '}</Text>
      <Text color="clawd_body">▀▄▀</Text>
      <Text>{'       '}</Text>
      <Text color="clawd_body">▀▄▀</Text>
      <Text>{' '.repeat(safeRepeat(58 - 16 - 3 - 7 - 3))}</Text>
    </Text>
  );
}

function CatEarsBaseLine() {
  return (
    <Text>
      <Text>{'                '}</Text>
      <Text color="clawd_body">███</Text>
      <Text>{'       '}</Text>
      <Text color="clawd_body">███</Text>
      <Text>{' '.repeat(safeRepeat(58 - 16 - 3 - 7 - 3))}</Text>
    </Text>
  );
}

function ClawdBodyLine() {
  return (
    <Text>
      <Text>{'       '}</Text>
      <Text color="clawd_body" backgroundColor="clawd_background">
        █████████
      </Text>
    </Text>
  );
}

function ClawdMidLine() {
  return (
    <Text>
      <Text>{'      '}</Text>
      <Text color="clawd_body" backgroundColor="clawd_background">
        ██▄██████▄██
      </Text>
    </Text>
  );
}

// ── Light theme ─────────────────────────────────────────────────

function LightTheme() {
  return (
    <Text>
      <TitleLine />
      <DotLine />
      <Text>{padRight('', 58)}</Text>
      <Text>{padRight('', 58)}</Text>
      <Text>{padRight('', 58)}</Text>
      {CLOUD_LINES.map((l, i) => (
        <Text key={i}>{l}</Text>
      ))}
      <Text>{padRight('', 58)}</Text>
      <CatEarsTipLine />
      <CatEarsBaseLine />
      <ClawdBodyLine />
      <ClawdMidLine />
      <ClawdBodyLine />
      <Text>{padRight('', 58)}</Text>
      <BottomLine />
    </Text>
  );
}

// ── Dark theme ──────────────────────────────────────────────────

// In dark themes, the cat ears base line includes star decorations.
// Total available: 58 - 16(lead) - 3(ear) - 7(gap) - 3(ear) = 29 chars.
// We use: 28 spaces + 1 star = 29 chars to fill the row.
const DARK_EARS_BASE_FILLER = ' '.repeat(28);

function DarkTheme() {
  return (
    <Text>
      <TitleLine />
      <DotLine />
      <Text>{padRight('', 58)}</Text>
      <Text>{padRight('     *                                       █████▓▓░', 58)}</Text>
      <Text>{padRight('                                 *         ███▓░     ░░', 58)}</Text>
      <Text>{padRight('            ░░░░░░                        ███▓░', 58)}</Text>
      <Text>{padRight('    ░░░   ░░░░░░░░░░                      ███▓░', 58)}</Text>
      <Text>
        <Text>{'   ░░░░░░░░░░░░░░░░░░░    '}</Text>
        <Text bold>*</Text>
        <Text>{'                ██▓░░      ▓'}</Text>
      </Text>
      <Text>{padRight('                                             ░▓▓███▓▓░', 58)}</Text>
      <Text>
        <Text dimColor>{' *                                 ░░░░'}</Text>
        <Text>{' '.repeat(safeRepeat(58 - 41))}</Text>
      </Text>
      <Text>
        <Text dimColor>{'                                 ░░░░░░░░'}</Text>
        <Text>{' '.repeat(safeRepeat(58 - 45))}</Text>
      </Text>
      <Text>
        <Text dimColor>{'                               ░░░░░░░░░░░░░░░░'}</Text>
        <Text>{' '.repeat(safeRepeat(58 - 53))}</Text>
      </Text>
      <CatEarsTipLine />
      <Text>
        <Text>{'                '}</Text>
        <Text color="clawd_body">███</Text>
        <Text>{'       '}</Text>
        <Text color="clawd_body">███</Text>
        <Text>{DARK_EARS_BASE_FILLER}</Text>
        <Text bold>*</Text>
      </Text>
      <ClawdBodyLine />
      <Text>
        <Text>{'      '}</Text>
        <Text color="clawd_body" backgroundColor="clawd_background">
          ██▄██████▄██
        </Text>
        <Text>{'                        '}</Text>
        <Text bold>*</Text>
      </Text>
      <Text>
        <Text>{'       '}</Text>
        <Text color="clawd_body" backgroundColor="clawd_background">
          █████████
        </Text>
        <Text>{'      *'}</Text>
      </Text>
      <Text>{padRight('', 58)}</Text>
      <BottomLine />
    </Text>
  );
}

// ── Apple Terminal light theme ──────────────────────────────────

function AppleTerminalBodyLine() {
  return (
    <Text>
      <Text>{'      '}</Text>
      <Text color="clawd_body">▗</Text>
      <Text> </Text>
      <Text color="clawd_body">▗</Text>
      <Text>{'     '}</Text>
      <Text color="clawd_body">▖</Text>
      <Text> </Text>
      <Text color="clawd_body">▖</Text>
    </Text>
  );
}

function AppleTerminalBodyFillLine() {
  return (
    <Text>
      <Text>{'       '}</Text>
      <Text backgroundColor="clawd_body">{' '.repeat(9)}</Text>
    </Text>
  );
}

function AppleLightTheme() {
  return (
    <Text>
      <TitleLine />
      <DotLine />
      <Text>{padRight('', 58)}</Text>
      <Text>{padRight('', 58)}</Text>
      <Text>{padRight('', 58)}</Text>
      {CLOUD_LINES.map((l, i) => (
        <Text key={i}>{l}</Text>
      ))}
      <Text>{padRight('', 58)}</Text>
      <CatEarsTipLine />
      <CatEarsBaseLine />
      <AppleTerminalBodyLine />
      <AppleTerminalBodyFillLine />
      <Text>{padRight('', 58)}</Text>
      <BottomLine />
    </Text>
  );
}

// ── Apple Terminal dark theme ───────────────────────────────────

function AppleDarkTheme() {
  return (
    <Text>
      <TitleLine />
      <DotLine />
      <Text>{padRight('', 58)}</Text>
      <Text>{padRight('     *                                       █████▓▓░', 58)}</Text>
      <Text>{padRight('                                 *         ███▓░     ░░', 58)}</Text>
      <Text>{padRight('            ░░░░░░                        ███▓░', 58)}</Text>
      <Text>{padRight('    ░░░   ░░░░░░░░░░                      ███▓░', 58)}</Text>
      <Text>
        <Text>{'   ░░░░░░░░░░░░░░░░░░░    '}</Text>
        <Text bold>*</Text>
        <Text>{'                ██▓░░      ▓'}</Text>
      </Text>
      <Text>{padRight('                                             ░▓▓███▓▓░', 58)}</Text>
      <Text>
        <Text dimColor>{' *                                 ░░░░'}</Text>
        <Text>{' '.repeat(safeRepeat(58 - 41))}</Text>
      </Text>
      <Text>
        <Text dimColor>{'                                 ░░░░░░░░'}</Text>
        <Text>{' '.repeat(safeRepeat(58 - 45))}</Text>
      </Text>
      <Text>
        <Text dimColor>{'                               ░░░░░░░░░░░░░░░░'}</Text>
        <Text>{' '.repeat(safeRepeat(58 - 53))}</Text>
      </Text>
      <CatEarsTipLine />
      <Text>
        <Text>{'                '}</Text>
        <Text color="clawd_body">███</Text>
        <Text>{'       '}</Text>
        <Text color="clawd_body">███</Text>
        <Text>{DARK_EARS_BASE_FILLER}</Text>
        <Text bold>*</Text>
      </Text>
      <Text>
        <Text>{'      '}</Text>
        <Text color="clawd_body">▗</Text>
        <Text> </Text>
        <Text color="clawd_body">▗</Text>
        <Text>{'     '}</Text>
        <Text color="clawd_body">▖</Text>
        <Text> </Text>
        <Text color="clawd_body">▖</Text>
        <Text>{'                        '}</Text>
        <Text bold>*</Text>
      </Text>
      <Text>
        <Text>{'       '}</Text>
        <Text backgroundColor="clawd_body">{' '.repeat(9)}</Text>
        <Text>{'      *'}</Text>
      </Text>
      <Text>{padRight('', 58)}</Text>
      <BottomLine />
    </Text>
  );
}

// ── Main component ──────────────────────────────────────────────

export function WelcomeV2(): React.ReactNode {
  const [theme] = useTheme();

  if (env.terminal === 'Apple_Terminal') {
    const isLight = ['light', 'light-daltonized', 'light-ansi'].includes(theme);
    return (
      <Box width={WELCOME_V2_WIDTH}>
        {isLight ? <AppleLightTheme /> : <AppleDarkTheme />}
      </Box>
    );
  }

  const isLight = ['light', 'light-daltonized', 'light-ansi'].includes(theme);
  return (
    <Box width={WELCOME_V2_WIDTH}>
      {isLight ? <LightTheme /> : <DarkTheme />}
    </Box>
  );
}
