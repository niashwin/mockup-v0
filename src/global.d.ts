export {};

declare global {
  interface Window {
    electronAPI?: {
      openMain?: (mode?: string) => void;
      onSetMode?: (cb: (mode: string) => void) => () => void;
      modeChanged?: (mode: string) => void;
      hideMain?: () => void;
      commitMeeting?: (payload: {
        type: string;
        title: string;
        references: string;
      }) => void;
      onCommitMeeting?: (
        cb: (payload: {
          type: string;
          title: string;
          references: string;
        }) => void,
      ) => () => void;
    };
  }
}
