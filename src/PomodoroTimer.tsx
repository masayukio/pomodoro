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
    let beepAudioContext: AudioContext | null = null;
    const playBeepSound = () => {
        if (beepAudioContext) {
            beepAudioContext.close();
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        beepAudioContext = new (window.AudioContext || window.webkitAudioContext as AudioContext)();
        const oscillator = beepAudioContext.createOscillator();
        oscillator.type = 'sine'; // サイン波
        oscillator.frequency.setValueAtTime(440, beepAudioContext.currentTime); // 440Hzの音を生成
        oscillator.connect(beepAudioContext.destination);

        oscillator.start();
        oscillator.stop(beepAudioContext.currentTime + 1); // 1秒間再生
    };

    useEffect(() => {
        let interval = 1000;

        if (state.isRunning && state.timeRemaining > 0) {
            interval = setInterval(() => {
                dispatch({type: 'TICK'});
            }, 1000);
        } else if (state.timeRemaining === 0) {
            // タイマーが終了したときの処理
            // ここでアラームを表示するなどの操作を行うことができます
            playBeepSound();
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
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const percentage = ((25 * 60 - state.timeRemaining) / (25 * 60)) * 100;
    return (
        <div>
            <h1>Pomodoro Timer</h1>
            <svg viewBox="0 0 200 200">
                <circle
                    stroke="lime"
                    fill="transparent"
                    strokeWidth="10"
                    r="90"
                    cx="100"
                    cy="100"
                />
                <circle
                    stroke="whitesmoke"
                    fill="transparent"
                    strokeWidth="10"
                    strokeDasharray="565.48 565.48"
                    strokeDashoffset={565.48 - (percentage / 100) * 565.48}
                    r="90"
                    cx="100"
                    cy="100"
                />
                <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="20"
                    fill="#000"
                >
                    {formatTime(state.timeRemaining)}
                </text>
                <g>
                    <rect
                        x="47"
                        y="110"
                        width="50"
                        height="20"
                        fill={state.isRunning ? "lightgrey" : "lightgreen"}
                        onClick={handleStart}
                    />
                    <text
                        x="70"
                        y="120"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fill={state.isRunning ? "grey" : "#000"}
                        onClick={handleStart}
                        style={{ cursor: 'pointer' }}
                    >
                        Start
                    </text>
                    <rect
                        x="107"
                        y="110"
                        width="50"
                        height="20"
                        fill={!state.isRunning ? "lightgrey" : "lightpink"}
                        onClick={handleStart}
                    />
                    <text
                        x="130"
                        y="120"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fill={!state.isRunning ? "grey" : "#000"}
                        onClick={handleReset}
                        style={{ cursor: 'pointer' }}
                    >
                        Reset
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default PomodoroTimer;