import React, { FC, useState } from 'react';
import { Box, IconButton, SvgIcon, makeStyles } from '@material-ui/core';
import { Die } from '../logic/die';
import { DiceIcons } from '../logic/diceIcons';
import { RollType } from '../logic/rolls';

export interface DiePickerProps {
  initialDie?: Die | null;
  die?: Die | null;
  setDie?: (die: Die) => void;
  type?: RollType;
  disabled?: boolean;
  className?: string;
}

export const DiePicker: FC<DiePickerProps> = ({
  initialDie,
  die: propDie,
  setDie,
  type = 'regular',
  disabled = false,
  className,
}) => {
  const classes = useStyles();
  const [stateDie, setStateDie] = useState(propDie ?? initialDie ?? null);
  const die = propDie !== undefined ? propDie : stateDie;
  const handleDie = (die: Die) => {
    setDie?.(die);
    setStateDie(die);
  };

  return (
    <Box display="flex" alignItems="center" className={className}>
      {Object.keys(DiceIcons).map((key) => {
        const dieType = Number(key) as Die;
        const selected = dieType === die;
        return (
          <IconButton
            key={dieType}
            onClick={() => handleDie(dieType)}
            disabled={disabled}
            color={
              selected
                ? type === 'regular'
                  ? 'primary'
                  : 'secondary'
                : 'default'
            }
          >
            <SvgIcon
              className={classes.icon}
              component={DiceIcons[dieType]}
              viewBox="0 0 100 100"
            />
          </IconButton>
        );
      })}
    </Box>
  );
};

const useStyles = makeStyles({
  icon: {
    width: '1.25em',
    height: '1.25em',
  },
});