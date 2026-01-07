import type { Exercise } from './types';

/**
 * EXERCISE DATABASE
 * 
 * A curated set of bodyweight exercises for the Daily Floor.
 * Each exercise has clear instructions, common mistakes, and variants.
 */
export const EXERCISES: Exercise[] = [
    // ============================================
    // PUSH MOVEMENTS
    // ============================================
    {
        id: 'push-ups-standard',
        name: 'Push-Ups',
        movementType: 'push',
        muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
        isPrimary: true,
        isSupport: false,
        baseReps: 10,
        goal: 'Control the descent; drive through your palms.',
        instructions: [
            'Hands slightly wider than shoulders, fingers spread',
            'Lower until chest nearly touches floor, elbows at 45°',
            'Push up explosively while keeping core tight'
        ],
        commonMistake: 'Letting hips sag or pike up—keep body in a straight line.',
        easierVariant: 'Incline push-ups (hands on elevated surface)',
        harderVariant: 'Diamond push-ups (hands close together)',
        contraindications: ['wrist', 'shoulder'],
        difficultyLevel: 2,
    },
    {
        id: 'push-ups-incline',
        name: 'Incline Push-Ups',
        movementType: 'push',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        isPrimary: true,
        isSupport: false,
        baseReps: 12,
        goal: 'Use an elevated surface to reduce load while keeping form.',
        instructions: [
            'Place hands on a sturdy elevated surface (chair, counter)',
            'Walk feet back until body forms a straight line',
            'Lower chest to the edge, then push back up'
        ],
        commonMistake: 'Standing too close—step back to get proper angle.',
        easierVariant: 'Wall push-ups',
        harderVariant: 'Standard push-ups',
        contraindications: ['wrist'],
        difficultyLevel: 1,
    },
    {
        id: 'pike-push-ups',
        name: 'Pike Push-Ups',
        movementType: 'push',
        muscleGroups: ['shoulders', 'triceps', 'core'],
        isPrimary: true,
        isSupport: false,
        baseReps: 8,
        goal: 'Target shoulders by creating an inverted V shape.',
        instructions: [
            'Start in push-up position, walk feet toward hands forming a V',
            'Bend elbows and lower head toward floor between hands',
            'Push back up to start, keeping hips high throughout'
        ],
        commonMistake: 'Not piking high enough—get hips as high as possible.',
        easierVariant: 'Standard push-ups',
        harderVariant: 'Feet elevated pike push-ups',
        contraindications: ['wrist', 'shoulder', 'neck'],
        difficultyLevel: 3,
    },

    // ============================================
    // PULL MOVEMENTS (bodyweight)
    // ============================================
    {
        id: 'supermans',
        name: 'Supermans',
        movementType: 'pull',
        muscleGroups: ['back', 'glutes', 'shoulders'],
        isPrimary: true,
        isSupport: true,
        baseReps: 10,
        goal: 'Strengthen posterior chain without equipment.',
        instructions: [
            'Lie face down, arms extended overhead, legs straight',
            'Lift arms, chest, and legs off floor simultaneously',
            'Hold 1-2 seconds at top, squeezing glutes and back'
        ],
        commonMistake: 'Using momentum—lift with control, not jerking.',
        easierVariant: 'Lift only arms OR only legs',
        harderVariant: 'Hold at top for 3-5 seconds',
        contraindications: ['lower-back', 'neck'],
        difficultyLevel: 2,
    },
    {
        id: 'prone-y-raises',
        name: 'Prone Y-Raises',
        movementType: 'pull',
        muscleGroups: ['back', 'shoulders'],
        isPrimary: false,
        isSupport: true,
        baseReps: 10,
        goal: 'Target lower traps and improve posture.',
        instructions: [
            'Lie face down, arms extended in Y shape (thumbs up)',
            'Lift arms off floor while squeezing shoulder blades',
            'Lower with control, keep head neutral'
        ],
        commonMistake: 'Craning neck up—keep forehead near floor.',
        easierVariant: 'Arms at 45° (T position)',
        harderVariant: 'Hold each rep for 3 seconds',
        contraindications: ['shoulder', 'neck'],
        difficultyLevel: 2,
    },

    // ============================================
    // SQUAT / LOWER BODY
    // ============================================
    {
        id: 'bodyweight-squats',
        name: 'Squats',
        movementType: 'squat',
        muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
        isPrimary: true,
        isSupport: false,
        baseReps: 12,
        goal: 'Sit back and down; drive through heels to stand.',
        instructions: [
            'Feet shoulder-width apart, toes slightly out',
            'Push hips back and bend knees, keeping chest up',
            'Descend until thighs parallel, then drive up through heels'
        ],
        commonMistake: 'Knees caving in—push them out over toes.',
        easierVariant: 'Box squats (sit to a chair)',
        harderVariant: 'Pause squats (3-second hold at bottom)',
        contraindications: ['knee'],
        difficultyLevel: 2,
    },
    {
        id: 'glute-bridges',
        name: 'Glute Bridges',
        movementType: 'hinge',
        muscleGroups: ['glutes', 'hamstrings', 'core'],
        isPrimary: true,
        isSupport: true,
        baseReps: 12,
        goal: 'Squeeze glutes hard at top; don\'t hyperextend back.',
        instructions: [
            'Lie on back, knees bent, feet flat near glutes',
            'Drive through heels to lift hips toward ceiling',
            'Squeeze glutes at top, pause, then lower with control'
        ],
        commonMistake: 'Arching lower back—focus on glute squeeze, not height.',
        easierVariant: 'Smaller range of motion',
        harderVariant: 'Single-leg glute bridges',
        contraindications: [],
        difficultyLevel: 1,
    },
    {
        id: 'reverse-lunges',
        name: 'Reverse Lunges',
        movementType: 'squat',
        muscleGroups: ['quads', 'glutes', 'hamstrings'],
        isPrimary: true,
        isSupport: false,
        baseReps: 8,
        goal: 'Step back with control; front knee tracks over ankle.',
        instructions: [
            'Stand tall, step one foot straight back',
            'Lower until both knees at 90°, back knee hovering',
            'Push through front heel to return to standing'
        ],
        commonMistake: 'Front knee shooting forward—keep shin vertical.',
        easierVariant: 'Hold onto something for balance',
        harderVariant: 'Walking lunges',
        contraindications: ['knee'],
        difficultyLevel: 2,
    },

    // ============================================
    // CORE MOVEMENTS
    // ============================================
    {
        id: 'plank',
        name: 'Plank',
        movementType: 'core',
        muscleGroups: ['core', 'shoulders'],
        isPrimary: false,
        isSupport: true,
        baseTime: 30,
        goal: 'Keep ribs down; squeeze glutes; breathe normally.',
        instructions: [
            'Forearms on floor, elbows under shoulders',
            'Form a straight line from head to heels',
            'Brace core like expecting a punch, hold position'
        ],
        commonMistake: 'Hips too high or sagging—check in mirror or record.',
        easierVariant: 'Kneeling plank',
        harderVariant: 'Plank with shoulder taps',
        contraindications: ['wrist', 'shoulder'],
        difficultyLevel: 2,
    },
    {
        id: 'dead-bugs',
        name: 'Dead Bugs',
        movementType: 'core',
        muscleGroups: ['core', 'hip-flexors'],
        isPrimary: false,
        isSupport: true,
        baseReps: 10,
        goal: 'Keep lower back pressed into floor throughout.',
        instructions: [
            'Lie on back, arms toward ceiling, knees at 90°',
            'Slowly extend opposite arm and leg toward floor',
            'Return to start, repeat on other side'
        ],
        commonMistake: 'Lower back arching—flatten it before each rep.',
        easierVariant: 'Only move legs, arms stay up',
        harderVariant: 'Slow 3-count on each extension',
        contraindications: ['lower-back'],
        difficultyLevel: 2,
    },
    {
        id: 'bird-dogs',
        name: 'Bird Dogs',
        movementType: 'core',
        muscleGroups: ['core', 'glutes', 'back'],
        isPrimary: false,
        isSupport: true,
        baseReps: 10,
        goal: 'Move slowly; keep hips and shoulders square.',
        instructions: [
            'Start on hands and knees, wrists under shoulders',
            'Extend opposite arm and leg until parallel to floor',
            'Hold briefly, return with control, switch sides'
        ],
        commonMistake: 'Rotating hips or shoulders—keep them level.',
        easierVariant: 'Only extend arm OR leg, not both',
        harderVariant: 'Hold each rep for 5 seconds',
        contraindications: ['wrist'],
        difficultyLevel: 1,
    },
    {
        id: 'hollow-hold',
        name: 'Hollow Hold',
        movementType: 'core',
        muscleGroups: ['core', 'hip-flexors'],
        isPrimary: false,
        isSupport: true,
        baseTime: 20,
        goal: 'Press lower back into floor; pull ribs down.',
        instructions: [
            'Lie on back, arms overhead, legs straight',
            'Lift shoulders and legs off floor, creating a "banana" shape',
            'Keep lower back glued to floor, hold position'
        ],
        commonMistake: 'Lower back lifting—bend knees if needed to maintain contact.',
        easierVariant: 'Bent knees, arms at sides',
        harderVariant: 'Rock gently while maintaining position',
        contraindications: ['lower-back', 'neck'],
        difficultyLevel: 3,
    },
    {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        movementType: 'core',
        muscleGroups: ['core', 'hip-flexors', 'shoulders'],
        isPrimary: true,
        isSupport: true,
        baseReps: 16,
        goal: 'Stay low and controlled; hips stay level.',
        instructions: [
            'Start in high plank position, hands under shoulders',
            'Drive one knee toward chest, then quickly switch',
            'Keep core tight and hips from bouncing'
        ],
        commonMistake: 'Hips piking up—maintain straight plank position.',
        easierVariant: 'Slow mountain climbers (step instead of hop)',
        harderVariant: 'Cross-body mountain climbers',
        contraindications: ['wrist', 'shoulder'],
        difficultyLevel: 2,
    },

    // ============================================
    // MOBILITY MOVEMENTS
    // ============================================
    {
        id: 'cat-cow',
        name: 'Cat-Cow',
        movementType: 'mobility',
        muscleGroups: ['back', 'core'],
        isPrimary: false,
        isSupport: true,
        baseReps: 10,
        goal: 'Move slowly through full range; sync with breath.',
        instructions: [
            'Start on hands and knees, wrists under shoulders',
            'Inhale: drop belly, lift chest and tailbone (cow)',
            'Exhale: round spine toward ceiling, tuck chin (cat)'
        ],
        commonMistake: 'Moving too fast—take 2-3 seconds for each position.',
        easierVariant: 'Seated cat-cow (on chair)',
        harderVariant: 'Add 3-second pause in each position',
        contraindications: ['wrist'],
        difficultyLevel: 1,
    },
    {
        id: 'hip-circles',
        name: 'Hip Circles',
        movementType: 'mobility',
        muscleGroups: ['hip-flexors', 'glutes'],
        isPrimary: false,
        isSupport: true,
        baseReps: 8,
        goal: 'Open up tight hips with controlled circles.',
        instructions: [
            'Stand on one leg, hold wall for balance if needed',
            'Lift knee, rotate hip out and around in circles',
            'Reverse direction, then switch legs'
        ],
        commonMistake: 'Moving from knee, not hip—initiate from hip joint.',
        easierVariant: 'Smaller circles with support',
        harderVariant: 'No support, larger circles',
        contraindications: ['knee'],
        difficultyLevel: 1,
    },
    {
        id: 'worlds-greatest-stretch',
        name: "World's Greatest Stretch",
        movementType: 'mobility',
        muscleGroups: ['hip-flexors', 'hamstrings', 'back', 'shoulders'],
        isPrimary: false,
        isSupport: true,
        baseReps: 6,
        goal: 'Full-body opener; hit multiple areas in one move.',
        instructions: [
            'Lunge forward, place both hands inside front foot',
            'Rotate torso, reach same-side arm toward ceiling',
            'Hold briefly, return hand down, step back, switch sides'
        ],
        commonMistake: 'Rushing—spend 2-3 seconds in the twist.',
        easierVariant: 'Skip the rotation, just hold the lunge',
        harderVariant: 'Add hamstring stretch by straightening front leg',
        contraindications: ['knee', 'lower-back'],
        difficultyLevel: 2,
    },
    {
        id: 'thoracic-rotations',
        name: 'Thoracic Rotations',
        movementType: 'mobility',
        muscleGroups: ['back', 'core'],
        isPrimary: false,
        isSupport: true,
        baseReps: 8,
        goal: 'Improve upper back rotation and reduce stiffness.',
        instructions: [
            'Side-lying position, knees stacked and bent at 90°',
            'Top arm reaches over, rotate upper back to open chest',
            'Follow hand with eyes, hold, return with control'
        ],
        commonMistake: 'Knees lifting—keep them stacked and still.',
        easierVariant: 'Place pillow between knees for comfort',
        harderVariant: 'Hold each rotation for 5 seconds',
        contraindications: ['shoulder', 'lower-back'],
        difficultyLevel: 1,
    },
];

/**
 * Get exercise by ID
 */
export function getExerciseById(id: string): Exercise | undefined {
    return EXERCISES.find(ex => ex.id === id);
}

/**
 * Get all primary exercises (can be main movement)
 */
export function getPrimaryExercises(): Exercise[] {
    return EXERCISES.filter(ex => ex.isPrimary);
}

/**
 * Get all support exercises (can be secondary movement)
 */
export function getSupportExercises(): Exercise[] {
    return EXERCISES.filter(ex => ex.isSupport);
}

/**
 * Get exercises by movement type
 */
export function getExercisesByType(type: Exercise['movementType']): Exercise[] {
    return EXERCISES.filter(ex => ex.movementType === type);
}

/**
 * Get exercises that don't violate constraints
 */
export function getSafeExercises(constraints: string[]): Exercise[] {
    return EXERCISES.filter(ex =>
        !ex.contraindications.some(c => constraints.includes(c))
    );
}
