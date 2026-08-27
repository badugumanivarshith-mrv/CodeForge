import { db, queryClient } from '../connection';
import { languages, levels, achievements } from '../schema';
import { seedLanguages } from './data/languages';
import { seedLevels } from './data/levels';
import { seedAchievements } from './data/achievements';
import { logger } from '../../core/utils/logger';

export const runSeed = async () => {
  logger.info('🌱 Starting CodeForge V2 Database Seeding...');

  try {
    // 1. Seed Languages
    logger.info('  -> Seeding Tier-1 Languages...');
    for (const lang of seedLanguages) {
      await db
        .insert(languages)
        .values(lang)
        .onConflictDoUpdate({
          target: languages.id,
          set: {
            name: lang.name,
            monacoId: lang.monacoId,
            compilerId: lang.compilerId,
            version: lang.version,
            isActive: lang.isActive,
            displayOrder: lang.displayOrder,
          },
        });
    }
    logger.info(`  ✓ Successfully seeded ${seedLanguages.length} Tier-1 languages.`);

    // 2. Seed Levels 1-50
    logger.info('  -> Seeding Levels 1 through 50...');
    for (const lvl of seedLevels) {
      await db
        .insert(levels)
        .values(lvl)
        .onConflictDoUpdate({
          target: levels.levelNumber,
          set: {
            minXpRequired: lvl.minXpRequired,
            title: lvl.title,
            badgeUrl: lvl.badgeUrl,
            rewardDescription: lvl.rewardDescription,
          },
        });
    }
    logger.info(`  ✓ Successfully seeded ${seedLevels.length} progression levels.`);

    // 3. Seed Achievements
    logger.info('  -> Seeding Base Achievements...');
    for (const ach of seedAchievements) {
      await db
        .insert(achievements)
        .values(ach)
        .onConflictDoUpdate({
          target: achievements.slug,
          set: {
            title: ach.title,
            description: ach.description,
            badgeIconUrl: ach.badgeIconUrl,
            achievementType: ach.achievementType,
            xpReward: ach.xpReward,
            criteriaJson: ach.criteriaJson,
          },
        });
    }
    logger.info(`  ✓ Successfully seeded ${seedAchievements.length} core achievements.`);

    logger.info('🎉 Database seeding completed successfully!');
  } catch (error) {
    logger.error({ error }, '❌ Error during database seeding');
    throw error;
  } finally {
    await queryClient.end();
  }
};

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
