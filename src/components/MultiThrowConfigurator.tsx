import React, { FC, useState } from 'react';
import {
  MultiThrowOptions,
  defaultDiceOptions,
  ThrowOptions,
} from '../logic/rolls';
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Box,
  makeStyles,
} from '@material-ui/core';
import { ThrowConfigurator } from './ThrowConfigurator';

export interface RollConfiguratorProps {
  initialValue?: MultiThrowOptions;
  value?: MultiThrowOptions;
  setValue?: (options: MultiThrowOptions) => void;
}

export const MultiThrowConfigurator: FC<RollConfiguratorProps> = ({
  initialValue = defaultDiceOptions,
  value,
  setValue,
}) => {
  const classes = useStyles();
  const [stateValue, setStateValue] = useState(value ?? initialValue);
  const options = value ?? stateValue;
  const { throws, acing, canFail } = options;

  const handleChange = (partialOptions: Partial<MultiThrowOptions>) => {
    const updatedOptions = { ...options, ...partialOptions };
    setValue?.(updatedOptions);
    setStateValue(updatedOptions);
  };

  const addThrow = (throwOptions: ThrowOptions) => {
    handleChange({ throws: [throwOptions, ...throws] });
  };

  const modifyThrow = (index: number) => (throwOptions: ThrowOptions) => {
    const throwsCopy = [...throws];
    if (throwOptions.dice.length) {
      throwsCopy.splice(index, 1, throwOptions);
    } else {
      throwsCopy.splice(index, 1);
    }
    handleChange({ throws: throwsCopy });
  };

  const modifyWildThrow = (throwOptions: ThrowOptions) => {
    const currentIndex = throws.findIndex((t) => t.type !== 'regular');
    const shouldAdd = throwOptions.dice.length > 0;
    const exists = currentIndex >= 0;

    if (exists) {
      modifyThrow(currentIndex)(throwOptions);
    } else if (shouldAdd) {
      addThrow(throwOptions);
    }
  };

  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      <ThrowConfigurator
        value={{ dice: [], modifier: 0, target: 4, type: 'regular' }}
        setValue={addThrow}
      />

      {throws
        .filter((t) => t.type === 'regular')
        .map((aThrow, index) => {
          return (
            <ThrowConfigurator
              key={index}
              value={aThrow}
              setValue={modifyThrow(index)}
            />
          );
        })}

      <ThrowConfigurator
        value={
          throws.find((t) => t.type !== 'regular') ?? {
            dice: [],
            modifier: 0,
            target: 4,
            type: 'wild',
          }
        }
        setValue={modifyWildThrow}
        maxRolls={1}
      />

      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={acing}
              onChange={(e) => handleChange({ acing: e.target.checked })}
            />
          }
          label="Ace"
        />
        <FormControlLabel
          control={
            <Switch
              checked={canFail}
              onChange={(e) => handleChange({ canFail: e.target.checked })}
            />
          }
          label="Can Fail"
        />
      </FormGroup>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > :not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
}));
