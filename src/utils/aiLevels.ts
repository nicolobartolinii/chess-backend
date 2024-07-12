/** Enum for AI levels */
export enum AiLevels {
    MONKEY,
    BEGINNER,
    INTERMEDIATE,
    ADVANCED,
    EXPERIENCED
}

/** Type for AI levels */
export type AiLevel = keyof typeof AiLevels;
/** Constant array of AI levels */
export const AI_LEVELS: AiLevel[] = ["MONKEY", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERIENCED"]