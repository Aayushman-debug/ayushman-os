/**
 * usePlayerControls — WASD + mouse third-person controls hook
 * Reads raw keyboard state without adding event listeners per frame.
 */
import { useEffect, useRef } from 'react';
import { useIslandStore } from '../island/useIslandStore';

interface Keys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  interact: boolean;
}

const INITIAL_KEYS: Keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false,
  interact: false,
};

export function usePlayerControls() {
  const keys = useRef<Keys>({ ...INITIAL_KEYS });

  useEffect(() => {
    // Subscribe to store controlsLocked changes to immediately clear pressed keys
    const unsub = useIslandStore.subscribe((state) => {
      if (state.controlsLocked) {
        keys.current = { ...INITIAL_KEYS };
      }
    });

    const onDown = (e: KeyboardEvent) => {
      // Don't capture movement if typing in an input, textarea or if controls are locked
      if (useIslandStore.getState().controlsLocked) {
        keys.current = { ...INITIAL_KEYS };
        return;
      }
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp' || key === 'w') {
        keys.current.forward = true;
      } else if (code === 'KeyS' || code === 'ArrowDown' || key === 's') {
        keys.current.backward = true;
      } else if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a') {
        keys.current.left = true;
      } else if (code === 'KeyD' || code === 'ArrowRight' || key === 'd') {
        keys.current.right = true;
      } else if (code === 'Space' || key === ' ') {
        keys.current.jump = true;
      } else if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        keys.current.sprint = true;
      } else if (code === 'KeyE' || key === 'e') {
        keys.current.interact = true;
      }
    };

    const onUp = (e: KeyboardEvent) => {
      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp' || key === 'w') {
        keys.current.forward = false;
      } else if (code === 'KeyS' || code === 'ArrowDown' || key === 's') {
        keys.current.backward = false;
      } else if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a') {
        keys.current.left = false;
      } else if (code === 'KeyD' || code === 'ArrowRight' || key === 'd') {
        keys.current.right = false;
      } else if (code === 'Space' || key === ' ') {
        keys.current.jump = false;
      } else if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        keys.current.sprint = false;
      } else if (code === 'KeyE' || key === 'e') {
        keys.current.interact = false;
      }
    };

    const onBlur = () => {
      keys.current = { ...INITIAL_KEYS };
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      unsub();
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return keys;
}
