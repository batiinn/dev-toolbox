export interface Perm {
  r: boolean
  w: boolean
  x: boolean
}

export interface ChmodPerms {
  owner: Perm
  group: Perm
  other: Perm
}

function digit(p: Perm): number {
  return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0)
}

function fromDigit(n: number): Perm {
  return { r: (n & 4) !== 0, w: (n & 2) !== 0, x: (n & 1) !== 0 }
}

export function permsToOctal(p: ChmodPerms): string {
  return `${digit(p.owner)}${digit(p.group)}${digit(p.other)}`
}

export function octalToPerms(octal: string): ChmodPerms {
  const m = octal.trim().replace(/^0o?/i, '')
  if (!/^[0-7]{3}$/.test(m)) throw new Error('Geçerli bir octal izin değeri girin (örn. 755).')
  return {
    owner: fromDigit(Number(m[0])),
    group: fromDigit(Number(m[1])),
    other: fromDigit(Number(m[2])),
  }
}

export function permsToSymbolic(p: ChmodPerms): string {
  const part = (x: Perm) => `${x.r ? 'r' : '-'}${x.w ? 'w' : '-'}${x.x ? 'x' : '-'}`
  return part(p.owner) + part(p.group) + part(p.other)
}
