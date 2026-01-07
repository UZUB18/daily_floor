'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DailyFloor, StreakData, Feedback, UserProfile } from '@/lib/types';
import {
  loadAppState,
  saveDailyFloor,
  saveStreakData,
  saveFeedback,
  getRecentFloors,
  getRecentFeedback,
  saveUserProfile,
} from '@/lib/storage';
import { generateDailyFloor, toggleExerciseComplete, getToday, isFloorComplete } from '@/lib/floor-generator';
import { markFloorCompleteAndUpdateStreak } from '@/lib/streak';
import { adjustFloor } from '@/lib/adjustment';
import { Button } from '@/components/ui/Button';
import { ExerciseCard } from '@/components/ExerciseCard';
import { StreakCalendar } from '@/components/StreakCalendar';
import { CompletionStamp } from '@/components/CompletionStamp';
import { ExerciseModal } from '@/components/ExerciseModal';
import { AdjustPanel } from '@/components/AdjustPanel';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';

/**
 * Main Today screen - the core of the app
 */
export default function TodayPage() {
  // State
  const [floor, setFloor] = useState<DailyFloor | null>(null);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    graceDaysUsed: 0,
    completionCalendar: {},
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // UI state
  const [showCompletion, setShowCompletion] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState<string | null>(null);
  const [showAdjustPanel, setShowAdjustPanel] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Initialize
  useEffect(() => {
    const initializeApp = () => {
      const state = loadAppState();
      setStreak(state.streak);
      setProfile(state.userProfile);

      // Check if we have today's floor
      const today = getToday();
      const existingFloor = state.floors.find(f => f.date === today);

      if (existingFloor) {
        setFloor(existingFloor);
      } else {
        // Create default profile if needed
        let userProfile = state.userProfile;
        if (!userProfile) {
          userProfile = {
            id: Date.now().toString(),
            level: 5,
            timePreference: 5,
            equipment: 'none',
            constraints: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          saveUserProfile(userProfile);
          setProfile(userProfile);
        }

        // Generate new floor
        const recentFloors = getRecentFloors(7);
        const recentFeedback = getRecentFeedback(3);
        const newFloor = generateDailyFloor(userProfile, recentFloors, recentFeedback);
        saveDailyFloor(newFloor);
        setFloor(newFloor);
      }

      setLoading(false);
    };

    initializeApp();
  }, []);

  // Handle exercise toggle
  const handleToggleComplete = useCallback((exerciseId: string) => {
    if (!floor) return;

    const updatedFloor = toggleExerciseComplete(floor, exerciseId);
    setFloor(updatedFloor);
    saveDailyFloor(updatedFloor);

    // Check if floor just completed
    if (updatedFloor.completed && !floor.completed) {
      // Update streak
      const newStreak = markFloorCompleteAndUpdateStreak(updatedFloor, streak);
      setStreak(newStreak);
      saveStreakData(newStreak);

      // Show completion animation
      setShowCompletion(true);
      setJustCompleted(true);
    }
  }, [floor, streak]);

  // Handle adjustment
  const handleAdjust = useCallback((feedback: Omit<Feedback, 'id' | 'date' | 'createdAt'>) => {
    if (!floor) return;

    const fullFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      date: getToday(),
      createdAt: new Date().toISOString(),
    };

    saveFeedback(fullFeedback);

    // Apply adjustment to current floor
    const recentFeedback = getRecentFeedback(3);
    const { floor: adjustedFloor } = adjustFloor(floor, fullFeedback, recentFeedback, profile);
    setFloor(adjustedFloor);
    saveDailyFloor(adjustedFloor);
  }, [floor, profile]);

  // Handle completion animation finish
  const handleCompletionFinish = useCallback(() => {
    setShowCompletion(false);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading your floor...</p>
        </div>
      </div>
    );
  }

  if (!floor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-500">Something went wrong. Please refresh.</p>
      </div>
    );
  }

  const nonBonusExercises = floor.exercises.filter(e => !e.isBonus);
  const bonusExercises = floor.exercises.filter(e => e.isBonus);
  const completedCount = nonBonusExercises.filter(e => e.completed).length;
  const totalCount = nonBonusExercises.length;

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container py-6 space-y-6">
          {/* Header */}
          <header className="text-center">
            <p className="eyebrow mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Today's Floor
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold">{floor.estimatedDuration} min</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Minimum to keep momentum
            </p>
          </header>

          {/* Progress bar (if partially complete) */}
          {completedCount > 0 && completedCount < totalCount && (
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}

          {/* Floor exercises */}
          <section className="space-y-3 stagger-children">
            {nonBonusExercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.exerciseId}
                exercise={exercise}
                onToggleComplete={handleToggleComplete}
                onShowHowTo={(id) => setShowExerciseModal(id)}
                index={index}
              />
            ))}
          </section>

          {/* Bonus section */}
          {bonusExercises.length > 0 && floor.completed && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <hr className="flex-1 border-gray-200" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Bonus
                </span>
                <hr className="flex-1 border-gray-200" />
              </div>
              {bonusExercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.exerciseId}
                  exercise={exercise}
                  onToggleComplete={handleToggleComplete}
                  onShowHowTo={(id) => setShowExerciseModal(id)}
                  index={index}
                />
              ))}
            </section>
          )}

          {/* Completed state */}
          {floor.completed && justCompleted && (
            <div className="text-center py-4 animate-fadeInUp">
              <p className="text-accent-600 font-semibold mb-2">
                ✓ Floor complete for today!
              </p>
              {bonusExercises.length > 0 && !bonusExercises[0].completed && (
                <p className="text-sm text-gray-500">
                  Want to do the bonus exercise?
                </p>
              )}
            </div>
          )}

          {/* Streak calendar */}
          <StreakCalendar streakData={streak} />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowLibrary(true)}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Library
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowAdjustPanel(true)}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Adjust
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CompletionStamp
        show={showCompletion}
        streakCount={streak.current}
        onComplete={handleCompletionFinish}
      />

      <ExerciseModal
        exerciseId={showExerciseModal}
        onClose={() => setShowExerciseModal(null)}
      />

      <AdjustPanel
        isOpen={showAdjustPanel}
        onClose={() => setShowAdjustPanel(false)}
        onSubmit={handleAdjust}
      />

      <ExerciseLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
      />
    </>
  );
}
