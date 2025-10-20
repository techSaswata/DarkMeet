import React, { useState, useEffect } from 'react';
import { Clock, Timer, AlertCircle } from 'lucide-react';

interface MeetingTimerProps {
  startTime?: Date;
  maxDuration?: number; // in minutes
  showWarning?: boolean;
  onTimeLimit?: () => void;
}

const MeetingTimer: React.FC<MeetingTimerProps> = ({
  startTime = new Date(),
  maxDuration = 60,
  showWarning = true,
  onTimeLimit
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);

      // Check if approaching time limit (90% of max duration)
      const maxSeconds = maxDuration * 60;
      if (showWarning && elapsed >= maxSeconds * 0.9 && elapsed < maxSeconds) {
        setIsWarning(true);
      }

      // Check if time limit reached
      if (elapsed >= maxSeconds && onTimeLimit) {
        onTimeLimit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, maxDuration, showWarning, onTimeLimit]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const maxSeconds = maxDuration * 60;
    return Math.min((elapsedTime / maxSeconds) * 100, 100);
  };

  const getRemainingTime = (): string => {
    const maxSeconds = maxDuration * 60;
    const remaining = Math.max(maxSeconds - elapsedTime, 0);
    const mins = Math.floor(remaining / 60);
    return `${mins} min remaining`;
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-lg p-4 shadow-xl">
      {/* Timer Display */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isWarning ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
          {isWarning ? (
            <AlertCircle className={`w-5 h-5 ${isWarning ? 'text-orange-400' : 'text-blue-400'}`} />
          ) : (
            <Clock className="w-5 h-5 text-blue-400" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isWarning ? 'text-orange-400' : 'text-white'}`}>
              {formatTime(elapsedTime)}
            </span>
            <span className="text-sm text-gray-400">elapsed</span>
          </div>
          {showWarning && (
            <div className="text-xs text-gray-400 mt-1">
              {getRemainingTime()}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {showWarning && (
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isWarning 
                ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      )}

      {/* Warning Message */}
      {isWarning && (
        <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 rounded p-2">
          <Timer className="w-4 h-4" />
          <span>Meeting time limit approaching</span>
        </div>
      )}
    </div>
  );
};

export default MeetingTimer;