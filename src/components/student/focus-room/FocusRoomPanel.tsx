import React from "react";

interface FocusRoomPanelProps {
  presets: any;
  selectedMinutes: number;
  remainingTime: string;
  isRunning: boolean;
  completedSessions: number;
  isSaving: boolean;
  energyMode: any;
  focusPlan: any;
  onSelectPreset: (minutes: number) => void;
  onChangeEnergyMode: (value: any) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function FocusRoomPanel(props: FocusRoomPanelProps) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <p>FocusRoomPanel placeholder</p>
      <p>Selected: {props.selectedMinutes} min, Remaining: {props.remainingTime}</p>
      <button onClick={props.onStart} disabled={props.isRunning}>Start</button>
      <button onClick={props.onPause}>Pause</button>
      <button onClick={props.onReset}>Reset</button>
    </div>
  );
}