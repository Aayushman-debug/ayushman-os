/**
 * usePlayerControls — WASD + mouse third-person controls hook
 * Reads raw keyboard state without adding event listeners per frame.
 */
import { useEffect, useRef } from 'react';

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
    const onDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward  = true; break;
        case 'KeyS': case 'ArrowDown':  keys.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft':  keys.current.left     = true; break;
        case 'KeyD': case 'ArrowRight': keys.current.right    = true; break;
        case 'Space':                   keys.current.jump     = true; e.preventDefault(); break;
        case 'ShiftLeft': case 'ShiftRight': keys.current.sprint = true; break;
        case 'KeyE':                    keys.current.interact = true; break;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward  = false; break;
        case 'KeyS': case 'ArrowDown':  keys.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft':  keys.current.left     = false; break;
        case 'KeyD': case 'ArrowRight': keys.current.right    = false; break;
        case 'Space':                   keys.current.jump     = false; break;
        case 'ShiftLeft': case 'ShiftRight': keys.current.sprint = false; break;
        case 'KeyE':                    keys.current.interact = false; break;
      }
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return keys;
}
