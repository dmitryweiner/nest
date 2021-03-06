import React from 'react';
import styles from './styles.module.css';

type RangeWithButtonsProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

export default function RangeWithButtons({ value, min, max, onChange }: RangeWithButtonsProps) {
  return (
    <div className={styles.rangeBlock}>
      <div>
        <button onClick={() => value > 0 && onChange(value - 1)}>&lt;</button>
      </div>
      <div className={styles.rangeInput}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
      </div>
      <div>
        <button onClick={() => value < max && onChange(value + 1)}>&gt;</button>
      </div>
    </div>
  );
}
