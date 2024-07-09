export enum AiLevels {
    MONKEY,
    BEGINNER,
    INTERMEDIATE,
    ADVANCED,
    EXPERIENCED
}

export type AiLevel = keyof typeof AiLevels;
export const AI_LEVELS: AiLevel[] = ["MONKEY", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERIENCED"]