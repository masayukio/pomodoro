import React, {useEffect, useReducer} from 'react';

interface PomodoroState {
    timeRemaining: number;
    isRunning: boolean;
}

// 初期状態
const initialState: PomodoroState = {
    timeRemaining: 25 * 60, // 初期値は25分（秒単位）
    isRunning: false,
};

type PomodoroAction =
    | { type: 'START_TIMER' }
    | { type: 'RESET_TIMER' }
    | { type: 'TICK' }
    ;

// Reducer関数
const reducer = (state: PomodoroState, action: PomodoroAction): PomodoroState => {
    switch (action.type) {
        case 'START_TIMER':
            return {...state, isRunning: true};
        case 'RESET_TIMER':
            return {...state, isRunning: false, timeRemaining: 25 * 60};
        case 'TICK':
            return {...state, timeRemaining: state.timeRemaining - 1};
        default:
            return state;
    }
};

const PomodoroTimer: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        let interval = 1000;

        if (state.isRunning && state.timeRemaining > 0) {
            interval = setInterval(() => {
                dispatch({type: 'TICK'});
            }, 1000);
        } else if (state.timeRemaining === 0) {
            // タイマーが終了したときの処理
            // ここでアラームを表示するなどの操作を行うことができます
        }

        return () => clearInterval(interval);
    }, [state.isRunning, state.timeRemaining]);

    const handleStart = () => {
        dispatch({type: 'START_TIMER'});
    };

    const handleReset = () => {
        dispatch({type: 'RESET_TIMER'});
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const percentage = ((25 * 60 - state.timeRemaining) / (25 * 60)) * 100;

    return (
        <div>
            <h1>Pomodoro Timer</h1>
            <svg height="200" width="200">
                <circle
                    stroke="#ccc"
                    fill="transparent"
                    strokeWidth="10"
                    r="90"
                    cx="100"
                    cy="100"
                />
                <circle
                    stroke="#e91e63"
                    fill="transparent"
                    strokeWidth="10"
                    strokeDasharray="565.48 565.48"
                    strokeDashoffset={565.48 - (percentage / 100) * 565.48}
                    r="90"
                    cx="100"
                    cy="100"
                />
            </svg>
            <p>{formatTime(state.timeRemaining)}</p>
            <button onClick={handleStart} disabled={state.isRunning}>
                Start
            </button>
            <button onClick={handleReset} disabled={!state.isRunning}>
                Reset
            </button>
        </div>
    );
};

export default PomodoroTimer;