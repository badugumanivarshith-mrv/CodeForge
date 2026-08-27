const getLevelTitle = (level: number): string => {
  const titles: Record<number, string> = {
    1: 'Novice Apprentice',
    2: 'Syntax Seeker',
    3: 'Logic Explorer',
    4: 'Code Crafter',
    5: 'Function Builder',
    6: 'Scope Navigator',
    7: 'Data Tinkerer',
    8: 'Algorithm Scout',
    9: 'Module Architect',
    10: 'Paradigm Pioneer',
    15: 'Concurrency Cadet',
    20: 'Architecture Adept',
    25: 'Optimization Sage',
    30: 'Dynamic Programmer',
    35: 'Distributed Engineer',
    40: 'System Vanguard',
    45: 'Grandmaster Developer',
    50: 'CodeForge Titan',
  };

  if (titles[level]) return titles[level];
  if (level < 10) return `Apprentice Tier ${level}`;
  if (level < 20) return `Engineer Tier ${level}`;
  if (level < 30) return `Architect Tier ${level}`;
  if (level < 40) return `Master Tier ${level}`;
  return `Grandmaster Tier ${level}`;
};

export const seedLevels = Array.from({ length: 50 }, (_, i) => {
  const levelNumber = i + 1;
  const minXpRequired = levelNumber === 1 ? 0 : Math.floor(100 * Math.pow(levelNumber - 1, 1.65));

  return {
    levelNumber,
    minXpRequired,
    title: getLevelTitle(levelNumber),
    badgeUrl: `/assets/badges/level-${levelNumber}.svg`,
    rewardDescription: `Unlocked rank of ${getLevelTitle(levelNumber)} with exclusive platform perks.`,
  };
});
