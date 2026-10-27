import {
  FaAws,
  FaBolt,
  FaBrain,
  FaCloud,
  FaCoins,
  FaDatabase,
  FaExchangeAlt,
  FaLayerGroup,
  FaLock,
  FaNetworkWired,
  FaServer,
  FaShieldAlt,
  FaStream,
  FaTools,
  FaHdd,
} from 'react-icons/fa';

/**
 * Central registry mapping short icon keys (used inside data files) to the
 * react-icons component that renders them. Keeping this indirection means
 * data files stay framework-agnostic and swapping an icon library only
 * requires changes in this one file.
 */
export const iconRegistry = {
  foundations: FaAws,
  security: FaShieldAlt,
  networking: FaNetworkWired,
  compute: FaServer,
  storage: FaHdd,
  database: FaDatabase,
  integration: FaStream,
  analytics: FaLayerGroup,
  management: FaTools,
  migration: FaExchangeAlt,
  ml: FaBrain,
  cost: FaCoins,
  lock: FaLock,
  cloud: FaCloud,
};

/**
 * Resolves an icon key to its component, falling back to a generic bolt
 * icon so an unmapped key never crashes the render tree.
 * @param {string} iconKey
 * @returns {React.ComponentType}
 */
export function resolveIcon(iconKey) {
  return iconRegistry[iconKey] ?? FaBolt;
}
