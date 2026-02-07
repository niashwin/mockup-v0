import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  MeetingCaptureState,
  CapturedMeeting,
  MeetingCaptureSnapshot,
  UpcomingMeeting,
  CapturedDecision,
  CapturedCommitment,
  CapturedQuestion,
  MeetingTranscriptSegment
} from '../types';

interface MeetingCaptureContextType {
  // State
  captureState: MeetingCaptureState;
  currentCapture: CapturedMeeting | null;
  upcomingMeeting: UpcomingMeeting | null;
  showCapturePrompt: boolean;
  showSummary: boolean;

  // Actions
  startCapture: (source?: CapturedMeeting['source']) => void;
  stopCapture: () => void;
  dismissPrompt: () => void;
  closeSummary: () => void;
  saveCapture: (saveAs: CapturedMeeting['savedAs'], threadId?: string) => void;

  // Duration tracking
  captureDuration: number;
}

const MeetingCaptureContext = createContext<MeetingCaptureContextType | undefined>(undefined);

// Mock function to generate a meeting snapshot (simulates AI processing)
function generateMockSnapshot(duration: number): MeetingCaptureSnapshot {
  const decisions: CapturedDecision[] = [
    {
      id: 'dec-1',
      summary: 'Move forward with the revised timeline for Q2 launch',
      participants: ['Sarah', 'Mike'],
      timestamp: new Date().toISOString()
    },
    {
      id: 'dec-2',
      summary: 'Budget allocation approved for additional contractor support',
      timestamp: new Date().toISOString()
    }
  ];

  const commitments: CapturedCommitment[] = [
    {
      id: 'com-1',
      summary: 'Prepare revised project roadmap by end of week',
      owner: 'Mike',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    },
    {
      id: 'com-2',
      summary: 'Schedule follow-up with engineering team',
      owner: 'Sarah',
      timestamp: new Date().toISOString()
    }
  ];

  const openQuestions: CapturedQuestion[] = [
    {
      id: 'q-1',
      summary: 'How will the new timeline affect the marketing launch?',
      askedBy: 'Mike',
      timestamp: new Date().toISOString(),
      isResolved: false
    }
  ];

  return {
    understanding: 'This discussion focused on the Q2 product launch timeline. The group aligned on a revised schedule and approved additional budget, with marketing impact still to be determined.',
    decisions,
    commitments,
    openQuestions,
    duration,
    participantCount: 3,
    dominantTopics: ['Timeline', 'Budget', 'Q2 Launch']
  };
}

// Mock function to generate transcript segments
function generateMockTranscript(): MeetingTranscriptSegment[] {
  return [
    {
      id: 'ts-1',
      speaker: 'Sarah',
      text: "Let's start by reviewing where we are with the Q2 timeline.",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      confidence: 0.95
    },
    {
      id: 'ts-2',
      speaker: 'Mike',
      text: "We've had some delays on the engineering side. I think we need to push back by two weeks.",
      timestamp: new Date(Date.now() - 280000).toISOString(),
      confidence: 0.92
    },
    {
      id: 'ts-3',
      speaker: 'Sarah',
      text: "That's going to affect marketing. Have we thought about how this impacts the launch campaign?",
      timestamp: new Date(Date.now() - 260000).toISOString(),
      confidence: 0.94
    },
    {
      id: 'ts-4',
      speaker: 'Alex',
      text: "I can bring in some contractor support to help accelerate things if we have the budget.",
      timestamp: new Date(Date.now() - 240000).toISOString(),
      confidence: 0.91
    },
    {
      id: 'ts-5',
      speaker: 'Sarah',
      text: "Let's approve that. Mike, can you prepare a revised roadmap by end of week?",
      timestamp: new Date(Date.now() - 220000).toISOString(),
      confidence: 0.96
    }
  ];
}

export function MeetingCaptureProvider({ children }: { children: React.ReactNode }) {
  const [captureState, setCaptureState] = useState<MeetingCaptureState>('idle');
  const [currentCapture, setCurrentCapture] = useState<CapturedMeeting | null>(null);
  const [upcomingMeeting, setUpcomingMeeting] = useState<UpcomingMeeting | null>(null);
  const [showCapturePrompt, setShowCapturePrompt] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [captureDuration, setCaptureDuration] = useState(0);

  const captureStartTime = useRef<Date | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulate detecting an upcoming meeting
  useEffect(() => {
    // Demo: Show a mock upcoming meeting after 5 seconds
    const timer = setTimeout(() => {
      setUpcomingMeeting({
        id: 'upcoming-1',
        title: 'Q2 Planning Sync',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        attendees: ['Sarah Chen', 'Mike Rodriguez', 'Alex Kim'],
        location: 'Zoom',
        isActive: true
      });
      // Show capture prompt when meeting is active
      setShowCapturePrompt(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Start capture
  const startCapture = useCallback((source: CapturedMeeting['source'] = 'manual') => {
    setCaptureState('capturing');
    setShowCapturePrompt(false);
    captureStartTime.current = new Date();
    setCaptureDuration(0);

    // Start duration counter
    durationInterval.current = setInterval(() => {
      if (captureStartTime.current) {
        const elapsed = Math.floor((Date.now() - captureStartTime.current.getTime()) / 1000);
        setCaptureDuration(elapsed);
      }
    }, 1000);
  }, []);

  // Stop capture
  const stopCapture = useCallback(() => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }

    const endTime = new Date();
    const duration = captureStartTime.current
      ? Math.floor((endTime.getTime() - captureStartTime.current.getTime()) / 1000)
      : 0;

    // Generate mock captured meeting data
    const capturedMeeting: CapturedMeeting = {
      id: `capture-${Date.now()}`,
      startTime: captureStartTime.current?.toISOString() || endTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      snapshot: generateMockSnapshot(duration),
      transcript: generateMockTranscript(),
      source: 'manual',
      calendarEventId: upcomingMeeting?.id,
      title: upcomingMeeting?.title || 'Meeting',
      attendees: upcomingMeeting?.attendees || [],
      isPrivate: false
    };

    setCurrentCapture(capturedMeeting);
    setCaptureState('complete');
    setShowSummary(true);
    captureStartTime.current = null;
  }, [upcomingMeeting]);

  // Dismiss capture prompt
  const dismissPrompt = useCallback(() => {
    setShowCapturePrompt(false);
  }, []);

  // Close summary
  const closeSummary = useCallback(() => {
    setShowSummary(false);
    setCaptureState('idle');
  }, []);

  // Save capture
  const saveCapture = useCallback((saveAs: CapturedMeeting['savedAs'], threadId?: string) => {
    if (currentCapture) {
      setCurrentCapture({
        ...currentCapture,
        savedAs: saveAs,
        attachedToThreadId: threadId
      });
    }
    setShowSummary(false);
    setCaptureState('idle');
  }, [currentCapture]);

  return (
    <MeetingCaptureContext.Provider
      value={{
        captureState,
        currentCapture,
        upcomingMeeting,
        showCapturePrompt,
        showSummary,
        startCapture,
        stopCapture,
        dismissPrompt,
        closeSummary,
        saveCapture,
        captureDuration
      }}
    >
      {children}
    </MeetingCaptureContext.Provider>
  );
}

export function useMeetingCapture() {
  const context = useContext(MeetingCaptureContext);
  if (context === undefined) {
    throw new Error('useMeetingCapture must be used within a MeetingCaptureProvider');
  }
  return context;
}

export default MeetingCaptureProvider;
